import { Router } from 'express';
import { checkAuth } from '../../middleware/checkAuth'; 
import { clientController } from './controller';

export class ClientRoutes {
  static get routes(): Router {
    const router = Router();

    // 1. Proteger todas las rutas de este router
    router.use(checkAuth); 
    
    // HU-16: Listar clientes (GET /clients)
    router.get('/clients', clientController.listClients);
    
    // HU-12: Crear nuevo cliente (POST /clients)
    router.post('/clients', clientController.createClient);

    // HU-14: Editar cliente (PATCH /clients/:id)
    router.patch('/clients/:id', clientController.updateClient); 
    
    // HU-15: Eliminar cliente (Borrado Lógico) (DELETE /clients/:id)
    router.delete('/clients/:id', clientController.softDeleteClient);

    return router;
  }
}