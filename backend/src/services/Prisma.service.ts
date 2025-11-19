import { PrismaClient } from '@prisma/client';

/**
 * Servicio centralizado para interactuar con la base de datos.
 * Esta clase inicializa el cliente de Prisma.
 */
export class PrismaService extends PrismaClient {
  
  constructor() {
    // La superclase lee automáticamente la DATABASE_URL del archivo .env
    super(); 
    console.log('Prisma Client inicializado.');
  }

  // Puedes añadir aquí métodos de conexión o salud de la BD si es necesario
  async onModuleInit() {
    // Opción para forzar la conexión en Express al inicio:
    try {
      await this.$connect();
      console.log('Conexión con PostgreSQL (via Prisma) exitosa.');
    } catch (error) {
      console.error('Fallo al conectar con la base de datos:', error);
      // Es vital que el servidor se detenga si la BD no está disponible
      process.exit(1);
    }
  }

  // Método para cerrar la conexión al detener el servidor
  async close() {
    await this.$disconnect();
    console.log('Conexión con PostgreSQL cerrada.');
  }
}

// Nota: En Express, es mejor crear una instancia y exportarla para inyectarla
// en tus servicios (p.ej., PropertyService).
export const prisma = new PrismaService();