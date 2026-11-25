import { setCors, verifyFirebaseToken } from './_lib/auth.js';
import { sbRest } from './_lib/supabase.js';

export default async function handler(req, res) {
  if (setCors(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  try {
    const authUser = await verifyFirebaseToken(req);
    if (!authUser.isAdmin) {
      return res.status(403).json({ ok: false, error: 'Faqat admin ruxsatiga ega' });
    }

    const botToken = process.env.BOT_TOKEN;
    if (!botToken) return res.status(500).json({ ok: false, error: 'BOT_TOKEN sozlanmagan' });

    const { action = 'send', title = '', text = '', facultyCode = null, groupCode = null } = req.body || {};

    let query = 'users?select=uid,display_name,faculty_code,group_code,tg_chat_id&tg_chat_id=not.is.null';
    if (facultyCode) query += `&faculty_code=eq.${encodeURIComponent(facultyCode)}`;
    if (groupCode) query += `&group_code=eq.${encodeURIComponent(groupCode)}`;

    const userRows = await sbRest(query);
    const map = new Map();

    for (const u of (userRows || [])) {
      const cid = String(u.tg_chat_id || '').trim();
      if (!cid) continue;
      map.set(cid, {
        tg_chat_id: cid,
        display_name: u.display_name || 'Talaba',
        group_code: u.group_code || '-'
      });
    }

    // Agar "Barchasi" (filtrsiz) tanlangan bo'lsa, bot_subscribers jadvalidagi barcha eski/yangi /start bosganlarni ham qo'shamiz
    if (!facultyCode && !groupCode) {
      try {
        const subRows = await sbRest('bot_subscribers?select=chat_id,first_name,username&limit=5000');
        for (const s of (subRows || [])) {
          const cid = String(s.chat_id || '').trim();
          if (!cid || map.has(cid)) continue;
          map.set(cid, {
            tg_chat_id: cid,
            display_name: s.first_name || (s.username ? '@' + s.username : 'Obunachi'),
            group_code: s.username ? '@' + s.username : 'bot'
          });
        }
      } catch (_) {
        // bot_subscribers jadvali hali yaratilmagan bo'lsa ham users bilan ishlayveradi
      }
    }

    const recipients = Array.from(map.values());

    if (action === 'list') {
      return res.status(200).json({
        ok: true,
        stats: { reachable: recipients.length, facultyCode, groupCode }
      });
    }

    if (!text.trim()) return res.status(400).json({ ok: false, error: 'Xabar matni bo\'sh' });
    const fullMessage = title.trim() ? `<b>${title.trim()}</b>\n\n${text.trim()}` : text.trim();

    let sent = 0;
    const failed = [];
    const CHUNK = 25;

    for (let i = 0; i < recipients.length; i += CHUNK) {
      const slice = recipients.slice(i, i + CHUNK);
      await Promise.all(slice.map(async (u) => {
        try {
          const r = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: u.tg_chat_id,
              text: fullMessage,
              parse_mode: 'HTML',
              disable_web_page_preview: true
            })
          });
          const j = await r.json();
          if (j.ok) {
            sent += 1;
          } else {
            failed.push({
              name: u.display_name,
              group: u.group_code || '-',
              chatId: u.tg_chat_id,
              reason: j.description || `HTTP ${r.status}`
            });
          }
        } catch (e) {
          failed.push({ name: u.display_name, group: u.group_code || '-', chatId: u.tg_chat_id, reason: e.message });
        }
      }));
      if (i + CHUNK < recipients.length) {
        await new Promise((r) => setTimeout(r, 1100));
      }
    }

    res.status(200).json({ ok: true, total: recipients.length, sent, failedCount: failed.length, failed });
  } catch (err) {
    res.status(err.status || 500).json({ ok: false, error: err.message });
  }
}
