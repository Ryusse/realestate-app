import { Request, Response } from 'express';
import { clientService } from '../../services/Client.service';

// NOTA: Asumiendo que IClientUpdateData ya existe.

export class ClientController {

  // --- GET - LISTAR CLIENTES (HU-16) ---
  public async listClients(req: Request, res: Response) { 
    try {
      // Validar que el usuario esté autenticado
      const agentId = (req as any).user?.id as string; 
      if (!agentId) {
        return res.status(401).json({ error: 'Usuario no autenticado.' });
      }

      // Obtener parámetros de paginación y filtros
      const { page = 1, limit = 10, search = '' } = req.query;
      
      // Llamar al servicio con los parámetros validados
      const clients = await clientService.listClients({
        agentId,
        page: Number(page),
        limit: Number(limit),
        search: String(search)
      });

      res.status(200).json({
        success: true,
        data: clients,
        page: Number(page),
        limit: Number(limit)
      });
    } catch (error) {
      const errorMessage = (error as Error).message;
      res.status(500).json({ 
        success: false,
        error: 'Error al listar clientes',
        details: errorMessage 
      });
    }
  }

  // --- POST - CREAR CLIENTE (HU-12) ---
  // CORRECCIÓN: Ahora es un método de clase
  public async createClient(req: Request, res: Response) {
    try {
      // CORRECCIÓN: Aplicamos (req as any)
      const agentId = (req as any).user?.id as string; 
      const clientData = req.body;
      
      if (!agentId) return res.status(401).json({ error: 'Usuario no autenticado.' });

      // **NOTA:** Aquí se debe implementar la validación (HU-19)
      
      const newClient = await clientService.createClient(clientData, agentId);

      res.status(201).json(newClient);

    } catch (error) {
      // ... (Manejo de errores) ...
      res.status(400).json({ error: (error as Error).message });
    }
  }
  
  // --- PATCH - EDITAR CLIENTE (HU-14) ---
  // CORRECCIÓN: Ahora es un método de clase
  public async updateClient(req: Request, res: Response) {
    try {
        const clientId = req.params.id;
        // CORRECCIÓN: Aplicamos (req as any)
        const agentId = (req as any).user?.id as string; 
        const updateData = req.body;
        
        if (!agentId) return res.status(401).json({ error: 'Usuario no identificado.' });

        // **NOTA:** Aquí se debe implementar la validación de updateData (HU-19)

        const updatedClient = await clientService.updateClient(clientId, updateData, agentId);
        
        res.status(200).json(updatedClient);

    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
  }


  // --- DELETE - BORRADO LÓGICO (HU-15) ---
  // CORRECCIÓN: Ahora es un método de clase
  public async softDeleteClient(req: Request, res: Response) {
    try {
      const clientId = req.params.id;
      // CORRECCIÓN: Aplicamos (req as any)
      const agentId = (req as any).user?.id as string; 

      if (!agentId) return res.status(401).json({ error: 'Usuario no autorizado.' });

      // Llama al servicio para marcar 'isDeleted' como true
      const result = await clientService.softDeleteClient(clientId, agentId);

      res.status(200).json({ 
          message: `Cliente ${clientId} marcado como inactivo.`,
          client: result
      });

    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
}

export const clientController = new ClientController();