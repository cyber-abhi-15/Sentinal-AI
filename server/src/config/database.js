// server/src/config/database.js
import { createClient } from '@supabase/supabase-js';

let supabase = null;

export function getSupabaseClient() {
  if (supabase) return supabase;

  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return null;
  }

  try {
    supabase = createClient(url, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    return supabase;
  } catch (err) {
    console.error('[Supabase] Initialization error:', err.message);
    return null;
  }
}

export async function testConnection() {
  const client = getSupabaseClient();
  if (!client) {
    return { connected: false, reason: 'SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing' };
  }

  try {
    const { data, error } = await client.from('users').select('id').limit(1);
    if (error) {
      return { connected: false, reason: error.message };
    }
    return { connected: true };
  } catch (err) {
    return { connected: false, reason: err.message };
  }
}

