import { Router } from 'express';
import multer from 'multer';
import { checkAuth } from '../../middleware/checkAuth';
import { propertyController } from './controller';

// Configuración de Multer
const upload = multer({ storage: multer.memoryStorage() }); 

export class PropertyRoutes {
  static get routes(): Router {
    const router = Router();

    // GET /api/properties (Público - Listar)
    router.get('/properties', propertyController.listProperties); 

    // POST /api/properties (Protegido - Publicar propiedad)
    router.post(
      '/properties', 
      checkAuth,
      upload.single('imageFile'),
      propertyController.createProperty
    );

    return router;
  }
}