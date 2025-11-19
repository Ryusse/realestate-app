import { Request, Response } from 'express'; 
import { propertyService } from '../../services/Property.service';
import { StorageService } from '../../services/Storage.service'; 
import { IPropertyCreationData } from '../../types/property.interface';

// Nota: Asumiendo que PrismaService ya está inicializado y listo.

export class PropertyController {
    
  private readonly storageService: StorageService;
  
  constructor() {
    this.storageService = new StorageService();
  }

  // Función de utilidad para validar campos (HU-19)
  private validateRequiredFields(data: IPropertyCreationData): string[] {
      const requiredFields: (keyof IPropertyCreationData)[] = [
          'title', 'price', 'client_id', 'address_id', 'status_id',
          'property_type_id', 'operation_type_id'
      ];
      const missingFields: string[] = [];

      for (const field of requiredFields) {
          if (!data[field] || (typeof data[field] === 'string' && (data[field] as string).trim() === '')) {
              missingFields.push(field);
          }
      }
      if (data.price <= 0) {
          missingFields.push('price (Debe ser mayor a 0)');
      }
      return missingFields;
  }
  
  // --- GET - LISTAR PROPIEDADES PÚBLICAS (Método de Clase) ---
  public listProperties = async (req: Request, res: Response) => {
    try {
      // Obtener parámetros de paginación, filtros y ordenamiento
      const { 
        page = 1, 
        limit = 10, 
        search = '',
        sortBy = 'created_at',
        order = 'DESC'
      } = req.query;
      
      // Validar que los parámetros sean válidos
      const pageNum = Math.max(1, Number(page));
      const limitNum = Math.min(100, Math.max(1, Number(limit)));
      const validOrder = ['ASC', 'DESC'].includes(String(order).toUpperCase()) ? String(order).toUpperCase() : 'DESC';

      // Llamar al servicio con los parámetros validados
      const result = await propertyService.listPublicProperties({
        page: pageNum,
        limit: limitNum,
        search: String(search),
        sortBy: String(sortBy),
        order: validOrder as 'ASC' | 'DESC'
      });

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          pages: result.pages
        }
      });
    } catch (error) {
      const errorMessage = (error as Error).message;
      res.status(500).json({ 
        success: false,
        error: 'Error al listar propiedades',
        details: errorMessage 
      });
    }
  };


  // --- POST - CREAR PROPIEDAD (Método de Clase Corregido) ---
  public createProperty = async (req: Request, res: Response) => {
    
    const file = req.file; 
    const propertyData: IPropertyCreationData = req.body; 
    
    // 1. Validaciones
    if (!file) {
      return res.status(400).json({ error: 'Debe adjuntar una imagen principal.' });
    }
    const missingFields = this.validateRequiredFields(propertyData);
    if (missingFields.length > 0) {
        return res.status(400).json({ 
            error: 'Faltan campos obligatorios', 
            details: `Los siguientes campos son requeridos: ${missingFields.join(', ')}` 
        });
    }

    try {
      // Usamos (req as any) para resolver el error TS2339:
      const agentId = (req as any).user?.id as string; 
      if (!agentId) return res.status(401).json({ error: 'Usuario no identificado.' });
      
      // 2. Orquestación: Subir el archivo
      const imageUrl = await this.storageService.uploadFile(
        file.buffer, 
        file.mimetype, 
        file.originalname
      );

      // 3. Orquestación: Inserción en la base de datos
      const newProperty = await propertyService.createProperty(
        propertyData, 
        agentId, 
        imageUrl
      );

      res.status(201).json(newProperty);

    } catch (error) {
      res.status(400).json({ 
        error: 'Fallo al publicar propiedad.',
        details: (error as Error).message 
      });
    }
  };
}

// Exportamos la instancia para el router
export const propertyController = new PropertyController();