import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useCreateProperty } from "../../hook/useCreateProperty";
import { toast } from "sonner";

// Mock de dependencias
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@src/lib/utils", () => ({
  wait: vi.fn(() => Promise.resolve()),
}));

describe("useCreateProperty", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it("debería inicializar con valores por defecto", () => {
    const { result } = renderHook(() => useCreateProperty());

    expect(result.current.loading).toBe(false);
    expect(result.current.form.getValues()).toEqual({
      title: "",
      description: "",
      price: 0,
      address: "",
      city: "",
      beds: 0,
      baths: 0,
    });
  });

  it("debería manejar el estado de loading correctamente durante el submit", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: "123" }),
    });
    global.fetch = mockFetch;

    const { result } = renderHook(() => useCreateProperty());

    expect(result.current.loading).toBe(false);

    const submitPromise = result.current.onSubmit({
      title: "Casa Test",
      description: "Descripción",
      price: 100000,
      address: "Calle 123",
      city: "Buenos Aires",
      beds: 3,
      baths: 2,
    });

    // Durante el submit debería estar loading
    await waitFor(() => {
      expect(result.current.loading).toBe(true);
    });

    await submitPromise;

    // Después del submit debería volver a false
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it("debería crear una propiedad exitosamente", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: "123", title: "Casa Test" }),
    });
    global.fetch = mockFetch;

    const onSuccess = vi.fn();
    const { result } = renderHook(() => useCreateProperty(onSuccess));

    const testData = {
      title: "Casa Test",
      description: "Descripción test",
      price: 100000,
      address: "Calle 123",
      city: "Buenos Aires",
      beds: 3,
      baths: 2,
    };

    const submitResult = await result.current.onSubmit(testData);

    await waitFor(() => {
      // Verifica que fetch fue llamado correctamente
      expect(mockFetch).toHaveBeenCalledWith("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testData),
      });

      // Verifica que mostró el toast de éxito
      expect(toast.success).toHaveBeenCalledWith(
        "Propiedad guardada correctamente 🏡"
      );

      // Verifica que llamó al callback onSuccess
      expect(onSuccess).toHaveBeenCalled();

      // Verifica que devolvió true
      expect(submitResult).toBe(true);

      // Verifica que loading volvió a false
      expect(result.current.loading).toBe(false);
    });
  });

  it("debería resetear el formulario después de un submit exitoso", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: "123" }),
    });
    global.fetch = mockFetch;

    const { result } = renderHook(() => useCreateProperty());

    // Primero enviamos datos
    await result.current.onSubmit({
      title: "Casa Test",
      description: "Descripción",
      price: 100000,
      address: "Calle 123",
      city: "Buenos Aires",
      beds: 3,
      baths: 2,
    });

    // Verificamos que el form se resetea a los valores por defecto
    await waitFor(() => {
      expect(result.current.form.getValues()).toEqual({
        title: "",
        description: "",
        price: 0,
        address: "",
        city: "",
        beds: 0,
        baths: 0,
      });
    });
  });

  it("debería manejar errores cuando fetch devuelve ok: false", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
    });
    global.fetch = mockFetch;

    const onSuccess = vi.fn();
    const { result } = renderHook(() => useCreateProperty(onSuccess));

    const submitResult = await result.current.onSubmit({
      title: "Test",
      description: "Test",
      price: 100,
      address: "Test",
      city: "Test",
      beds: 1,
      baths: 1,
    });

    await waitFor(() => {
      // Verifica que mostró el toast de error
      expect(toast.error).toHaveBeenCalledWith(
        "No se pudo guardar la propiedad"
      );

      // Verifica que NO llamó al callback onSuccess
      expect(onSuccess).not.toHaveBeenCalled();

      // Verifica que devolvió false
      expect(submitResult).toBe(false);

      // Verifica que loading volvió a false
      expect(result.current.loading).toBe(false);
    });
  });

  it("debería manejar errores cuando fetch lanza una excepción", async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error("Network error"));
    global.fetch = mockFetch;

    const { result } = renderHook(() => useCreateProperty());

    const submitResult = await result.current.onSubmit({
      title: "Test",
      description: "Test",
      price: 100,
      address: "Test",
      city: "Test",
      beds: 1,
      baths: 1,
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "No se pudo guardar la propiedad"
      );
      expect(submitResult).toBe(false);
      expect(result.current.loading).toBe(false);
    });
  });

  it("debería funcionar sin el callback onSuccess", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: "123" }),
    });
    global.fetch = mockFetch;

    // Sin pasar onSuccess
    const { result } = renderHook(() => useCreateProperty());

    const submitResult = await result.current.onSubmit({
      title: "Casa Test",
      description: "Descripción",
      price: 100000,
      address: "Calle 123",
      city: "Buenos Aires",
      beds: 3,
      baths: 2,
    });

    await waitFor(() => {
      expect(submitResult).toBe(true);
      expect(toast.success).toHaveBeenCalled();
      expect(result.current.loading).toBe(false);
    });
  });
});
