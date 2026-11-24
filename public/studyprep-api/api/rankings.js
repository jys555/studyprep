import { setCors, verifyFirebaseToken, getIsoWeekId } from './_lib/auth.js';
import { sbRpc } from './_lib/supabase.js';

export default async function handler(req, res) {
  if (setCors(req, res)) return;
  try {
    const weekId = req.query?.weekId || getIsoWeekId();
    const scope = req.query?.scope || 'snapshot';

    if (scope === 'me') {
      const authUser = await verifyFirebaseToken(req);
      const me = await sbRpc('get_user_ranks', { p_uid: authUser.uid, p_week_id: weekId });
      res.setHeader('Cache-Control', 'private, no-store');
      return res.status(200).json({ ok: true, weekId, me });
    }

    // 30 soniyalik Vercel Edge CDN kesh
    const snapshot = await sbRpc('get_rankings_snapshot', { p_week_id: weekId });
    res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60');
    res.status(200).json({ ok: true, ...snapshot });
  } catch (err) {
    res.status(err.status || 500).json({ ok: false, error: err.message });
  }
}
