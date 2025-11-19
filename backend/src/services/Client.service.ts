import { prisma } from '../services/Prisma.service';

// DTO para la creación de un cliente
interface IClientCreationData {
    first_name: string;
    last_name: string;
    email?: string;
    phone?: string;
    dni?: string;
}

export class ClientService {

  private readonly prisma = prisma; 

  async createClient(data: IClientCreationData, agentId: string) {
    try {
      // Nota: Si el DNI ya existe, Prisma lanzará un error único que
      // el Controller debería capturar y devolver como 400.
      const newClient = await this.prisma.clients.create({
        data: {
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone: data.phone,
          dni: data.dni,
        },
      });
      return newClient;

    } catch (error: any) {
      // Evitamos depender de la exportación de tipos runtime de Prisma
      const code = error?.code ?? error?.meta?.code;
      if (code === 'P2002') {
        throw new Error(`Ya existe un cliente con este valor duplicado (DNI/Email).`);
      }
      throw new Error(`Error de DB: ${code ?? String(error)}`);
    }
  }
  
  async softDeleteClient(clientId: string, agentId: string) {
      // Para Supabase, eliminamos directamente (soft delete no existe en schema)
      const result = await this.prisma.clients.delete({
          where: { id: clientId },
      });
      
      return result;
  }
  
  // HU-16: Listar clientes con paginación y búsqueda
  async listClients(params: { agentId: string; page: number; limit: number; search: string }) {
    const { agentId, page, limit, search } = params;
    
    try {
      // Construir el filtro WHERE
      const where: any = {};

      // Si hay búsqueda, filtrar por nombre, email o DNI
      if (search && search.trim()) {
        where.OR = [
          { first_name: { contains: search, mode: 'insensitive' } },
          { last_name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { dni: { contains: search, mode: 'insensitive' } },
        ];
      }

      // Calcular skip para paginación
      const skip = (page - 1) * limit;

      // Consultar la base de datos
      const [clients, total] = await Promise.all([
        this.prisma.clients.findMany({
          where,
          skip,
          take: limit,
          orderBy: { created_at: 'desc' } as any,
        }),
        this.prisma.clients.count({ where }),
      ]);

      return {
        data: clients,
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new Error(`Error al listar clientes: ${(error as Error).message}`);
    }
  }

  async updateClient(clientId: string, updateData: Partial<IClientCreationData>, agentId: string) {
    try {
      const updated = await this.prisma.clients.update({
        where: { id: clientId },
        data: { ...updateData }
      });
      return updated;
    } catch (error: any) {
      const code = error?.code ?? error?.meta?.code;
      if (code === 'P2002') {
        throw new Error('Valor duplicado al actualizar cliente.');
      }
      throw new Error(`Error al actualizar cliente: ${code ?? String(error)}`);
    }
  }
}

export const clientService = new ClientService();