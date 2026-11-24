import { sbRest } from './_lib/supabase.js';

export default async function handler(req, res) {
  try {
    const facs = await sbRest('faculties?select=code&limit=1');
    res.status(200).json({ ok: true, db: 'alive', sample: facs?.length || 0, ts: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
}
