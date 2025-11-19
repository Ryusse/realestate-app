import { prisma } from '../services/Prisma.service';
import { StorageService } from './Storage.service'; 
import { IPropertyCreationData } from '../types/property.interface';

export class PropertyService {
  private readonly prisma = prisma; 
  private readonly storageService: StorageService;

  constructor() {
    this.storageService = new StorageService(); 
  }

  /**
   * HU-4: Publicar una nueva propiedad.
   */
  async createProperty(data: IPropertyCreationData, agentId: string, imageUrl: string) { 
    try {
      const newProperty = await this.prisma.properties.create({
        data: {
          // 1. CAMPOS PRINCIPALES
          title: data.title,
          price: data.price,
          description: data.description,
          bedrooms: data.bedrooms, 
          bathrooms: data.bathrooms, 
          
          // 2. CLAVES FORÁNEAS (FKs)
          owner_id: agentId, 
          client_id: data.client_id, 
          address_id: data.address_id,
          status_id: data.status_id,
          property_type_id: data.property_type_id,
          operation_type_id: data.operation_type_id,

          // 3. RELACIÓN 1:N (Imágenes)
          property_images: {
            create: {
              image_url: imageUrl, 
              is_primary: true
            }
          },
        },
      });

      return newProperty;

    } catch (error: any) {
      const code = error?.code ?? error?.meta?.code;
      if (code === 'P2003') {
        throw new Error(`Error de clave foránea: Uno de los IDs proporcionados no existe.`);
      }
      const errCode = code ?? 'UNKNOWN';
      const errMsg = error?.message ?? String(error);
      throw new Error(`Error de DB: ${errCode} - ${errMsg}`);
    }
  }


  /**
   * HU-26 & HU-28: Listar y filtrar propiedades para el catálogo público.
   * @param params - Parámetros con paginación, búsqueda y ordenamiento
   */
  async listPublicProperties(params: {
    page: number;
    limit: number;
    search: string;
    sortBy: string;
    order: 'ASC' | 'DESC';
  }) {
    const { page, limit, search, sortBy, order } = params;

    try {
      // Mock data para testing
      const mockProperties = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          title: 'Casa moderna en el centro',
          price: 350000,
          description: 'Hermosa casa con 3 habitaciones y piscina',
          bedrooms: 3,
          bathrooms: 2,
          created_at: new Date('2025-11-19T10:30:00Z'),
          owner_id: 'agent-1',
          client_id: null,
          address_id: 'addr-1',
          status_id: 'status-1',
          property_type_id: 'type-1',
          operation_type_id: 'op-1',
          updated_at: new Date('2025-11-19T10:30:00Z'),
        },
        {
          id: '223e4567-e89b-12d3-a456-426614174001',
          title: 'Apartamento de lujo',
          price: 250000,
          description: 'Apartamento con vista al mar',
          bedrooms: 2,
          bathrooms: 2,
          created_at: new Date('2025-11-18T15:45:00Z'),
          owner_id: 'agent-2',
          client_id: null,
          address_id: 'addr-2',
          status_id: 'status-1',
          property_type_id: 'type-2',
          operation_type_id: 'op-1',
          updated_at: new Date('2025-11-18T15:45:00Z'),
        },
        {
          id: '323e4567-e89b-12d3-a456-426614174002',
          title: 'Terreno en zona residencial',
          price: 150000,
          description: 'Terreno sin construir, ideal para proyecto',
          bedrooms: 0,
          bathrooms: 0,
          created_at: new Date('2025-11-17T09:20:00Z'),
          owner_id: 'agent-1',
          client_id: null,
          address_id: 'addr-3',
          status_id: 'status-1',
          property_type_id: 'type-3',
          operation_type_id: 'op-1',
          updated_at: new Date('2025-11-17T09:20:00Z'),
        }
      ];

      // Aplicar búsqueda
      let filtered = mockProperties;
      if (search && search.trim()) {
        const searchLower = search.toLowerCase();
        filtered = mockProperties.filter(p => 
          p.title.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower)
        );
      }

      // Aplicar ordenamiento
      if (sortBy === 'price') {
        filtered.sort((a, b) => {
          const priceA = a.price;
          const priceB = b.price;
          return order === 'ASC' ? priceA - priceB : priceB - priceA;
        });
      } else {
        filtered.sort((a, b) => {
          const timeA = new Date(a.created_at).getTime();
          const timeB = new Date(b.created_at).getTime();
          return order === 'ASC' ? timeA - timeB : timeB - timeA;
        });
      }

      // Aplicar paginación
      const skip = (page - 1) * limit;
      const paginatedData = filtered.slice(skip, skip + limit);

      return {
        data: paginatedData,
        total: filtered.length,
        page,
        limit,
        pages: Math.ceil(filtered.length / limit),
      };

    } catch (error) {
      console.error("Fallo al procesar propiedades:", error);
      throw new Error(`Fallo al listar propiedades: ${(error as Error).message}`);
    }
  }
}

export const propertyService = new PropertyService();