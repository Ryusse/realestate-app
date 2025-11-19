import 'dotenv/config';
import { get } from 'env-var';


export const envs = {

  
  PORT: get('PORT').required().asPortNumber(),
  

  // Claves de Supabase (Para el Cliente Admin)
  DATABASE_URL: get('DATABASE_URL').required().asString(),
  SUPABASE_SERVICE_KEY: get('SUPABASE_SERVICE_KEY').required().asString(), 
  SUPABASE_ANON_KEY: get('SUPABASE_ANON_KEY').asString(),


}



