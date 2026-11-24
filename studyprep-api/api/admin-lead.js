import { setCors, verifyFirebaseToken } from './_lib/auth.js';
import { sbRest } from './_lib/supabase.js';

export default async function handler(req, res) {
  if (setCors(req, res)) return;
  try {
    const authUser = await verifyFirebaseToken(req);
    if (!authUser.isAdmin) {
      return res.status(403).json({ ok: false, error: 'Faqat admin ruxsatiga ega' });
    }

    if (req.method === 'GET') {
      const q = String(req.query?.q || '').trim();
      let path;
      if (q) {
        // PostgREST or= qidiruv (maxsus belgilarni tozalash)
        const safe = q.replace(/[(),.*"\\]/g, '').slice(0, 50);
        path = `users?select=uid,display_name,email,photo_url,faculty_code,cohort_year,group_code,is_ambassador,lead_badge&or=(display_name.ilike.*${encodeURIComponent(safe)}*,email.ilike.*${encodeURIComponent(safe)}*,group_code.ilike.*${encodeURIComponent(safe)}*)&order=display_name.asc&limit=25`;
      } else {
        path = `users?select=uid,display_name,email,photo_url,faculty_code,cohort_year,group_code,is_ambassador,lead_badge&or=(is_ambassador.eq.true,lead_badge.not.is.null)&order=lead_badge.asc,display_name.asc&limit=50`;
      }
      const rows = await sbRest(path);
      res.setHeader('Cache-Control', 'private, no-store');
      return res.status(200).json({ ok: true, users: rows || [] });
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ ok: false, error: 'Method not allowed' });
    }

    const { uid, leadBadge } = req.body || {};
    if (!uid || typeof uid !== 'string' || uid.length > 128) {
      return res.status(400).json({ ok: false, error: 'Talaba UID noto\'g\'ri' });
    }

    let cleanBadge = null;
    if (leadBadge && String(leadBadge).trim()) {
      const upper = String(leadBadge).trim().toUpperCase();
      if (!/^[A-Z]{2,5}\d{2}$/.test(upper)) {
        return res.status(400).json({ ok: false, error: 'Badge formati noto\'g\'ri (masalan: CEN26, SWE26)' });
      }
      cleanBadge = upper;
    }

    const updated = await sbRest(`users?uid=eq.${encodeURIComponent(uid)}`, {
      method: 'PATCH',
      prefer: 'return=representation',
      body: {
        is_ambassador: Boolean(cleanBadge),
        lead_badge: cleanBadge,
        updated_at: new Date().toISOString()
      }
    });

    if (!updated || !updated.length) {
      return res.status(404).json({ ok: false, error: 'Talaba topilmadi' });
    }

    res.setHeader('Cache-Control', 'private, no-store');
    return res.status(200).json({ ok: true, user: updated[0] });
  } catch (err) {
    res.status(err.status || 500).json({ ok: false, error: err.message });
  }
}
