// src/types/property.interface.ts

// Usaremos 'string' para los UUIDs, ya que así vienen en JavaScript/TypeScript.

/**
 * Define la estructura esperada para el BODY de la petición POST /api/properties
 * para crear una nueva propiedad.
 */
export interface IPropertyCreationData {
  // --- CAMPOS DE LA TABLA PROPERTIES (Obligatorios) ---
  title: string;
  price: number;
  
  // Claves Foráneas (FKs) que el Controller debe procesar antes de guardar
  // NOTA: El Controller ya obtiene el OWNER_ID del req.user.id
  client_id: string; // ID del Dueño Real (de la tabla clients)
  address_id: string; // ID de la dirección (pre-creada)
  status_id: string; // ID del estado (de la tabla property_status)
  property_type_id: string; // ID del tipo (de la tabla property_types)
  operation_type_id: string; // ID de la operación (de la tabla operation_types)

  // --- CAMPOS OPCIONALES ---
  description?: string;
  bedrooms?: number;
  bathrooms?: number;
  
  // --- RELACIONES MANY-TO-MANY (Vienen como arrays de IDs) ---
  services?: string[]; // Array de UUIDs para la tabla 'services'
  amenities?: string[]; // Array de UUIDs para la tabla 'amenities'

  // --- El archivo NO viene aquí, viene en req.file ---
  // file: Multer.File; 
}