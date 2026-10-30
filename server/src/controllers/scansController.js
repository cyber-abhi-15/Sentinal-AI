// server/src/controllers/scansController.js
import { getSupabaseClient } from '../config/database.js';
import { memoryScans } from './firewallController.js';

export async function getScans(req, res) {
  const userId = req.user?.userId;
  const supabase = getSupabaseClient();

  if (supabase && userId) {
    try {
      const { data, error } = await supabase
        .from('scans')
        .select('*, threat_findings(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(100);

      if (!error && data && data.length > 0) {
        return res.json({ success: true, data });
      }
    } catch (err) {
      console.warn('[Scans] Supabase error, using fallback:', err.message);
    }
  }

  const scans = userId ? memoryScans.filter(s => s.user_id === userId) : memoryScans;
  return res.json({ success: true, data: scans });
}

export async function getScanById(req, res) {
  const { id } = req.params;
  const userId = req.user?.userId;
  const supabase = getSupabaseClient();

  if (supabase && userId) {
    try {
      const { data, error } = await supabase
        .from('scans')
        .select('*, threat_findings(*)')
        .eq('id', id)
        .eq('user_id', userId)
        .maybeSingle();

      if (!error && data) {
        return res.json({ success: true, data });
      }
    } catch (err) {
      console.warn('[Scans] Supabase error:', err.message);
    }
  }

  const found = memoryScans.find(s => s.id === id && (!userId || s.user_id === userId));
  if (!found) {
    return res.status(404).json({ success: false, message: 'Scan record not found.' });
  }

  return res.json({ success: true, data: found });
}

export async function deleteScan(req, res) {
  const { id } = req.params;
  const userId = req.user?.userId;
  const supabase = getSupabaseClient();

  if (supabase && userId) {
    try {
      const { error } = await supabase
        .from('scans')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (!error) {
        return res.json({ success: true, message: 'Scan deleted successfully' });
      }
    } catch (err) {
      console.warn('[Scans] Supabase delete error:', err.message);
    }
  }

  const index = memoryScans.findIndex(s => s.id === id && (!userId || s.user_id === userId));
  if (index !== -1) {
    memoryScans.splice(index, 1);
    return res.json({ success: true, message: 'Scan deleted successfully' });
  }

  return res.status(404).json({ success: false, message: 'Scan record not found.' });
}

export async function clearScans(req, res) {
  const userId = req.user?.userId;
  const supabase = getSupabaseClient();

  if (supabase && userId) {
    try {
      await supabase.from('scans').delete().eq('user_id', userId);
    } catch (err) {
      console.warn('[Scans] Supabase clear error:', err.message);
    }
  }

  if (userId) {
    const remaining = memoryScans.filter(s => s.user_id !== userId);
    memoryScans.length = 0;
    memoryScans.push(...remaining);
  } else {
    memoryScans.length = 0;
  }

  return res.json({ success: true, message: 'Scan history cleared successfully.' });
}
