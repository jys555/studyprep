import { setCors, verifyFirebaseToken } from './_lib/auth.js';
import { sbRest } from './_lib/supabase.js';

export default async function handler(req, res) {
  if (setCors(req, res)) return;
  try {
    const authUser = await verifyFirebaseToken(req);

    if (req.method === 'GET') {
      const rows = await sbRest(`users?uid=eq.${encodeURIComponent(authUser.uid)}&select=*`);
      return res.status(200).json({ ok: true, user: rows[0] || null });
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ ok: false, error: 'Method not allowed' });
    }

    const { displayName, groupCode, tgChatId } = req.body || {};
    const existingRows = await sbRest(`users?uid=eq.${encodeURIComponent(authUser.uid)}&select=*`);
    const existing = existingRows[0] || null;

    // Guruh kodi rasmiy jadvalda borligini tekshirish
    let groupRow = null;
    if (groupCode) {
      const gRows = await sbRest(`groups?code=eq.${encodeURIComponent(groupCode)}&is_active=eq.true&select=code,faculty_code,cohort_year`);
      groupRow = gRows[0] || null;
      if (!groupRow) {
        return res.status(400).json({ ok: false, error: 'Bunday standart guruh topilmadi' });
      }
      // 30 kunlik almashtirish qulfi
      if (existing && existing.profile_v === 2 && existing.group_code !== groupRow.code) {
        if (existing.group_locked_until && new Date(existing.group_locked_until) > new Date() && !authUser.isAdmin) {
          return res.status(403).json({
            ok: false,
            error: 'Guruhni 30 kunda faqat 1 marta o\'zgartirish mumkin'
          });
        }
      }
    }

    const lockUntil = new Date(Date.now() + 30 * 86400 * 1000).toISOString();
    const payload = {
      uid: authUser.uid,
      display_name: (displayName || existing?.display_name || authUser.name || 'Talaba').trim().slice(0, 60),
      email: authUser.email || existing?.email || null,
      photo_url: authUser.picture || existing?.photo_url || null,
      is_admin: authUser.isAdmin,
      tg_chat_id: tgChatId ? String(tgChatId) : (existing?.tg_chat_id || null),
      updated_at: new Date().toISOString()
    };

    if (groupRow) {
      payload.faculty_code = groupRow.faculty_code;
      payload.cohort_year = groupRow.cohort_year;
      payload.group_code = groupRow.code;
      payload.profile_v = 2;
      if (!existing || existing.group_code !== groupRow.code) {
        payload.group_locked_until = lockUntil;
      }
    }

    const saved = await sbRest('users', {
      method: 'POST',
      prefer: 'resolution=merge-duplicates,return=representation',
      body: payload
    });

    res.status(200).json({ ok: true, user: saved[0] });
  } catch (err) {
    res.status(err.status || 500).json({ ok: false, error: err.message });
  }
}
