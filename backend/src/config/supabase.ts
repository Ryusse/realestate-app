import { createClient, SupabaseClient } from '@supabase/supabase-js';
import 'dotenv/config';

const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY ?? process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  // Aviso en tiempo de ejecución; la aplicación puede seguir arrancando pero Storage fallará si se usa.
  console.warn('Warning: SUPABASE_URL or SUPABASE_SERVICE_KEY not set in env. Storage operations will fail at runtime.');
}

export const supabaseAdmin: SupabaseClient = createClient(
  SUPABASE_URL ?? '',
  SUPABASE_SERVICE_KEY ?? ''
);
