"use client";

import { useGetProperties } from "@src/modules/properties/hook/useGetProperties";
import { useCreateProperty } from "@src/modules/properties/hook/useCreateProperty";
import { CreatePropertyDialog } from "@src/modules/properties/components/CreatePropertyDialog";

export function PropertiesClient() {
  const { properties, loading, refetch } = useGetProperties();
  const { form, onSubmit, loading: creating } = useCreateProperty(refetch);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Propiedades</h1>
        <CreatePropertyDialog
          form={form}
          onSubmit={onSubmit}
          loading={creating}
        />
      </div>

      {loading ? (
        <p>Cargando propiedades...</p>
      ) : (
        <ul className="space-y-2">
          {properties.map((prop) => (
            <li key={prop.id} className="border p-2 rounded">
              <strong>{prop.title}</strong> - ${prop.price}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
