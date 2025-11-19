import { Router } from 'express';
import { PropertyRoutes } from './properties/routes'; 
import { ClientRoutes } from './clients/routes';

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    // Ruta de salud (Health Check)
    router.get('/api/health', (req, res) => {
      res.json({ status: 'ok', message: 'API funcionando correctamente' });
    });

    // Rutas de API
    router.use('/api', [
      // MÓDULO: PROPIEDADES (Ej: /api/properties)
      PropertyRoutes.routes,
      
      // MÓDULO: CLIENTES (Ej: /api/clients)
      ClientRoutes.routes, 
    ]);
    
    // Manejo de Error 404 para API
    router.use((req, res) => {
      res.status(404).json({ error: 'Ruta no encontrada' });
    });
    
    return router;
  }
}