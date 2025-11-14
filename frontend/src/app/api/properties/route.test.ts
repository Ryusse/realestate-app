import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST } from "./route";
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

// Mocks
vi.mock("fs");
// No mockeamos `path` para poder espiar `path.join` con vi.spyOn
vi.mock("next/server", () => ({
  NextResponse: {
    json: vi.fn((data, options) => ({
      json: async () => data,
      status: options?.status || 200,
      data,
      ...options,
    })),
  },
}));

// No reasignamos `global.crypto` aquí para evitar errores en el entorno de test.
// En lugar de comprobar un UUID fijo, verificamos que la nueva propiedad tiene
// un `id` de tipo string en las aserciones más abajo.

describe("API Route /api/properties", () => {
  const mockFilePath = "/fake/path/properties.json";

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock de path.join para devolver siempre la misma ruta
    vi.spyOn(path, "join").mockReturnValue(mockFilePath as any);
  });

  describe("GET /api/properties", () => {
    it("debería leer y devolver todas las propiedades", async () => {
      const mockProperties = [
        {
          id: "1",
          title: "Casa 1",
          price: 100000,
          address: "Calle 1",
          city: "Buenos Aires",
          beds: 3,
          baths: 2,
        },
        {
          id: "2",
          title: "Casa 2",
          price: 150000,
          address: "Calle 2",
          city: "Córdoba",
          beds: 4,
          baths: 3,
        },
      ];

      vi.spyOn(fs, "readFileSync").mockReturnValue(
        JSON.stringify(mockProperties) as any
      );

      const response = await GET();
      const data = await response.json();

      expect(fs.readFileSync).toHaveBeenCalled();
      expect(NextResponse.json).toHaveBeenCalledWith(mockProperties);
      expect(data).toEqual(mockProperties);
    });

    it("debería devolver un array vacío si el archivo está vacío", async () => {
      vi.spyOn(fs, "readFileSync").mockReturnValue("[]" as any);

      const response = await GET();
      const data = await response.json();

      expect(data).toEqual([]);
    });
  });

  describe("POST /api/properties", () => {
    it("debería crear una nueva propiedad exitosamente", async () => {
      const existingProperties = [
        {
          id: "1",
          title: "Casa existente",
          price: 100000,
          address: "Calle 1",
          city: "Buenos Aires",
          beds: 3,
          baths: 2,
        },
      ];

      const newPropertyData = {
        title: "Casa nueva",
        description: "Descripción de prueba",
        price: 200000,
        address: "Calle Nueva 123",
        city: "Rosario",
        beds: 4,
        baths: 3,
      };

      // Mock del archivo existente
      vi.spyOn(fs, "readFileSync").mockReturnValue(
        JSON.stringify(existingProperties) as any
      );
      vi.spyOn(fs, "writeFileSync").mockImplementation(() => {});

      // Mock del request
      const mockRequest = {
        json: vi.fn().mockResolvedValue(newPropertyData),
      } as any;

      const response = await POST(mockRequest);
      const data = await response.json();

      // Verificar que leyó el archivo
      expect(fs.readFileSync).toHaveBeenCalled();

      // Verificar que escribió correctamente y que la nueva entrada tiene id
      expect(fs.writeFileSync).toHaveBeenCalled();
      const written = (fs.writeFileSync as unknown as any).mock
        .calls[0][1] as string;
      const parsed = JSON.parse(written);
      expect(parsed).toHaveLength(existingProperties.length + 1);
      expect(parsed[parsed.length - 1]).toMatchObject(newPropertyData);
      expect(typeof parsed[parsed.length - 1].id).toBe("string");

      // Verificar la respuesta contiene la nueva propiedad con id (tipo string)
      expect(NextResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({ id: expect.any(String), ...newPropertyData }),
        { status: 201 }
      );

      expect(data).toEqual(
        expect.objectContaining({ id: expect.any(String), ...newPropertyData })
      );
    });

    it("debería agregar propiedad cuando el archivo está vacío", async () => {
      vi.spyOn(fs, "readFileSync").mockReturnValue("[]" as any);
      vi.spyOn(fs, "writeFileSync").mockImplementation(() => {});

      const newPropertyData = {
        title: "Primera propiedad",
        price: 100000,
        address: "Calle 1",
        city: "Buenos Aires",
        beds: 2,
        baths: 1,
      };

      const mockRequest = {
        json: vi.fn().mockResolvedValue(newPropertyData),
      } as any;

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(fs.writeFileSync).toHaveBeenCalled();
      const written = (fs.writeFileSync as unknown as any).mock
        .calls[0][1] as string;
      const parsed = JSON.parse(written);
      expect(parsed).toHaveLength(1);
      expect(parsed[0]).toMatchObject(newPropertyData);
      expect(typeof parsed[0].id).toBe("string");

      expect(data.id).toEqual(expect.any(String));
      expect(data.title).toBe(newPropertyData.title);
    });

    it("debería manejar error cuando readFileSync falla", async () => {
      vi.spyOn(fs, "readFileSync").mockImplementation(() => {
        throw new Error("File not found");
      });

      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          title: "Casa",
          price: 100000,
          address: "Calle 1",
          city: "Buenos Aires",
          beds: 2,
          baths: 1,
        }),
      } as any;

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({
        message: "Error al guardar la propiedad",
      });
    });

    it("debería manejar error cuando writeFileSync falla", async () => {
      vi.spyOn(fs, "readFileSync").mockReturnValue("[]" as any);
      vi.spyOn(fs, "writeFileSync").mockImplementation(() => {
        throw new Error("Permission denied");
      });

      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          title: "Casa",
          price: 100000,
          address: "Calle 1",
          city: "Buenos Aires",
          beds: 2,
          baths: 1,
        }),
      } as any;

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({
        message: "Error al guardar la propiedad",
      });
      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    it("debería manejar error cuando JSON.parse falla", async () => {
      vi.spyOn(fs, "readFileSync").mockReturnValue("invalid json{" as any);

      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          title: "Casa",
          price: 100000,
          address: "Calle 1",
          city: "Buenos Aires",
          beds: 2,
          baths: 1,
        }),
      } as any;

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({
        message: "Error al guardar la propiedad",
      });
    });

    it("debería manejar error cuando req.json() falla", async () => {
      const mockRequest = {
        json: vi.fn().mockRejectedValue(new Error("Invalid JSON in request")),
      } as any;

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({
        message: "Error al guardar la propiedad",
      });
    });

    it("debería preservar propiedades existentes al agregar una nueva", async () => {
      const existingProperties = [
        {
          id: "1",
          title: "Casa 1",
          price: 100000,
          address: "Calle 1",
          city: "BA",
          beds: 2,
          baths: 1,
        },
        {
          id: "2",
          title: "Casa 2",
          price: 150000,
          address: "Calle 2",
          city: "CBA",
          beds: 3,
          baths: 2,
        },
        {
          id: "3",
          title: "Casa 3",
          price: 200000,
          address: "Calle 3",
          city: "ROS",
          beds: 4,
          baths: 3,
        },
      ];

      vi.spyOn(fs, "readFileSync").mockReturnValue(
        JSON.stringify(existingProperties) as any
      );
      vi.spyOn(fs, "writeFileSync").mockImplementation(() => {});

      const newProperty = {
        title: "Casa 4",
        price: 250000,
        address: "Calle 4",
        city: "MDZ",
        beds: 5,
        baths: 4,
      };

      const mockRequest = {
        json: vi.fn().mockResolvedValue(newProperty),
      } as any;

      await POST(mockRequest);

      const writtenData = (fs.writeFileSync as unknown as any).mock
        .calls[0][1] as string;
      const parsedData = JSON.parse(writtenData);

      expect(parsedData).toHaveLength(4);
      expect(parsedData[0]).toEqual(existingProperties[0]);
      expect(parsedData[1]).toEqual(existingProperties[1]);
      expect(parsedData[2]).toEqual(existingProperties[2]);
      expect(parsedData[3]).toMatchObject(newProperty);
      expect(typeof parsedData[3].id).toBe("string");
    });
  });
});
