import { supabaseAdmin } from '../config/supabase';
import { v4 as uuidv4 } from 'uuid'; // Necesitas esta librería para nombres únicos

// Instalar UUID: yarn add uuid && yarn add @types/uuid -D

export class StorageService {
  private readonly supabase = supabaseAdmin;
  // Bucket de imágenes que configuraste
  private readonly BUCKET_NAME = 'property-images'; 

  /**
   * Sube un archivo a Supabase Storage.
   * @param fileBuffer - El archivo en formato Buffer.
   * @param mimeType - El tipo MIME del archivo (ej. 'image/jpeg').
   * @param originalFileName - El nombre original para obtener la extensión.
   * @returns La URL pública del archivo.
   */
  async uploadFile(fileBuffer: Buffer, mimeType: string, originalFileName: string): Promise<string> {
    
    // Generar un nombre de archivo único
    const fileExtension = originalFileName.split('.').pop();
    const newFileName = `${uuidv4()}.${fileExtension}`;
    
    const { data, error: uploadError } = await this.supabase.storage
      .from(this.BUCKET_NAME)
      .upload(newFileName, fileBuffer, {
        cacheControl: '3600', // Caching por 1 hora
        upsert: false,
        contentType: mimeType,
      });

    if (uploadError) {
      console.error('Storage Upload Error:', uploadError);
      throw new Error(`Fallo al subir el archivo: ${uploadError.message}`);
    }

    // Obtener y devolver la URL pública (la que se guarda en la base de datos)
    const { data: publicUrlData } = this.supabase.storage
      .from(this.BUCKET_NAME)
      .getPublicUrl(newFileName);
    
    // Si tienes que hacer un cambio de dominio por CDN o algo, iría aquí.
    return publicUrlData.publicUrl;
  }
}