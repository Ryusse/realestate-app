import { describe, it, expect } from "vitest";
import { createPropertySchema } from "@src/modules/properties/schemas/property.schema";

describe("createPropertySchema", () => {
  describe("Validaciones exitosas", () => {
    it("debería validar una propiedad completa válida", () => {
      const validProperty = {
        title: "Casa moderna",
        description: "Hermosa casa con jardín",
        price: 100000,
        address: "Calle 123",
        city: "Buenos Aires",
        beds: 3,
        baths: 2,
      };

      const result = createPropertySchema.safeParse(validProperty);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validProperty);
      }
    });

    it("debería validar con description opcional vacía", () => {
      const propertyWithoutDescription = {
        title: "Departamento",
        price: 50000,
        address: "Av. Principal 456",
        city: "Córdoba",
        beds: 2,
        baths: 1,
      };

      const result = createPropertySchema.safeParse(propertyWithoutDescription);

      expect(result.success).toBe(true);
    });

    it("debería validar con description undefined", () => {
      const propertyWithUndefinedDescription = {
        title: "Casa chica",
        description: undefined,
        price: 75000,
        address: "Calle 789",
        city: "Rosario",
        beds: 1,
        baths: 1,
      };

      const result = createPropertySchema.safeParse(
        propertyWithUndefinedDescription
      );

      expect(result.success).toBe(true);
    });

    it("debería validar con beds y baths en 0", () => {
      const propertyWithZeros = {
        title: "Terreno",
        price: 30000,
        address: "Ruta 9 km 10",
        city: "La Plata",
        beds: 0,
        baths: 0,
      };

      const result = createPropertySchema.safeParse(propertyWithZeros);

      expect(result.success).toBe(true);
    });

    it("debería coerce strings a números para price", () => {
      const propertyWithStringPrice = {
        title: "Oficina",
        price: "150000", // string
        address: "Av. Corrientes 1000",
        city: "CABA",
        beds: "0", // string
        baths: "1", // string
      };

      const result = createPropertySchema.safeParse(propertyWithStringPrice);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.price).toBe(150000); // número
        expect(result.data.beds).toBe(0); // número
        expect(result.data.baths).toBe(1); // número
      }
    });
  });

  describe("Validaciones de title", () => {
    it("debería fallar si title es muy corto (menos de 3 caracteres)", () => {
      const invalidProperty = {
        title: "Ca", // muy corto
        price: 100000,
        address: "Calle 123",
        city: "Buenos Aires",
        beds: 3,
        baths: 2,
      };

      const result = createPropertySchema.safeParse(invalidProperty);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain("title");
        expect(result.error.issues[0].message).toBe("El título es obligatorio");
      }
    });

    it("debería fallar si title está vacío", () => {
      const invalidProperty = {
        title: "",
        price: 100000,
        address: "Calle 123",
        city: "Buenos Aires",
        beds: 3,
        baths: 2,
      };

      const result = createPropertySchema.safeParse(invalidProperty);

      expect(result.success).toBe(false);
    });

    it("debería fallar si title no existe", () => {
      const invalidProperty = {
        price: 100000,
        address: "Calle 123",
        city: "Buenos Aires",
        beds: 3,
        baths: 2,
      };

      const result = createPropertySchema.safeParse(invalidProperty);

      expect(result.success).toBe(false);
    });
  });

  describe("Validaciones de price", () => {
    it("debería fallar si price es 0", () => {
      const invalidProperty = {
        title: "Casa gratis",
        price: 0,
        address: "Calle 123",
        city: "Buenos Aires",
        beds: 3,
        baths: 2,
      };

      const result = createPropertySchema.safeParse(invalidProperty);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain("price");
        expect(result.error.issues[0].message).toBe("Debe ser mayor a 0");
      }
    });

    it("debería fallar si price es negativo", () => {
      const invalidProperty = {
        title: "Casa",
        price: -1000,
        address: "Calle 123",
        city: "Buenos Aires",
        beds: 3,
        baths: 2,
      };

      const result = createPropertySchema.safeParse(invalidProperty);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain("price");
      }
    });

    it("debería fallar si price no es un número válido", () => {
      const invalidProperty = {
        title: "Casa",
        price: "no es un número",
        address: "Calle 123",
        city: "Buenos Aires",
        beds: 3,
        baths: 2,
      };

      const result = createPropertySchema.safeParse(invalidProperty);

      expect(result.success).toBe(false);
    });
  });

  describe("Validaciones de address", () => {
    it("debería fallar si address es muy corta (menos de 3 caracteres)", () => {
      const invalidProperty = {
        title: "Casa",
        price: 100000,
        address: "Ca", // muy corto
        city: "Buenos Aires",
        beds: 3,
        baths: 2,
      };

      const result = createPropertySchema.safeParse(invalidProperty);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain("address");
        expect(result.error.issues[0].message).toBe("Dirección obligatoria");
      }
    });

    it("debería fallar si address está vacía", () => {
      const invalidProperty = {
        title: "Casa",
        price: 100000,
        address: "",
        city: "Buenos Aires",
        beds: 3,
        baths: 2,
      };

      const result = createPropertySchema.safeParse(invalidProperty);

      expect(result.success).toBe(false);
    });
  });

  describe("Validaciones de city", () => {
    it("debería fallar si city es muy corta (menos de 2 caracteres)", () => {
      const invalidProperty = {
        title: "Casa",
        price: 100000,
        address: "Calle 123",
        city: "B", // muy corto
        beds: 3,
        baths: 2,
      };

      const result = createPropertySchema.safeParse(invalidProperty);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain("city");
        expect(result.error.issues[0].message).toBe("Ciudad obligatoria");
      }
    });

    it("debería fallar si city está vacía", () => {
      const invalidProperty = {
        title: "Casa",
        price: 100000,
        address: "Calle 123",
        city: "",
        beds: 3,
        baths: 2,
      };

      const result = createPropertySchema.safeParse(invalidProperty);

      expect(result.success).toBe(false);
    });
  });

  describe("Validaciones de beds y baths", () => {
    it("debería fallar si beds es negativo", () => {
      const invalidProperty = {
        title: "Casa",
        price: 100000,
        address: "Calle 123",
        city: "Buenos Aires",
        beds: -1,
        baths: 2,
      };

      const result = createPropertySchema.safeParse(invalidProperty);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain("beds");
      }
    });

    it("debería fallar si baths es negativo", () => {
      const invalidProperty = {
        title: "Casa",
        price: 100000,
        address: "Calle 123",
        city: "Buenos Aires",
        beds: 3,
        baths: -2,
      };

      const result = createPropertySchema.safeParse(invalidProperty);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain("baths");
      }
    });
  });

  describe("Validaciones múltiples errores", () => {
    it("debería reportar múltiples errores a la vez", () => {
      const invalidProperty = {
        title: "Ca", // muy corto
        price: 0, // debe ser mayor a 0
        address: "", // vacío
        city: "B", // muy corto
        beds: -1, // negativo
        baths: -1, // negativo
      };

      const result = createPropertySchema.safeParse(invalidProperty);

      expect(result.success).toBe(false);
      if (!result.success) {
        // Debería tener al menos 5 errores
        expect(result.error.issues.length).toBeGreaterThanOrEqual(5);
      }
    });
  });
});
