import { setCors, verifyCronOrAdmin, getPrevIsoWeekId } from './_lib/auth.js';
import { sbRpc, sbRest } from './_lib/supabase.js';

function escHtml(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export default async function handler(req, res) {
  if (setCors(req, res)) return;
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    await verifyCronOrAdmin(req);

    const requestedWeek = req.query?.weekId || req.body?.weekId || '';
    const weekId = /^\d{4}-W\d{2}$/.test(requestedWeek) ? requestedWeek : getPrevIsoWeekId();

    const data = await sbRpc('finalize_weekly_cup', { p_week_id: weekId });
    if (data?.alreadyFinalized) {
      return res.status(200).json({ ok: true, weekId, alreadyFinalized: true });
    }

    let telegramSent = 0;
    const botToken = process.env.BOT_TOKEN;
    const cohortsObj = data?.cohorts || {};
    const cohortKeys = Object.keys(cohortsObj).sort((a, b) => Number(b) - Number(a));

    if (botToken && cohortKeys.length > 0 && req.query?.notify !== 'false') {
      const medals = ['🥇', '🥈', '🥉'];
      const lines = [`<b>🏆 Haftalik Kubok (${escHtml(weekId)}) yakunlandi!</b>`];

      for (const ck of cohortKeys) {
        const cData = cohortsObj[ck] || {};
        const uniTop = cData.universityTop3 || [];
        const grpTop = cData.groupsTop3 || [];
        if (!uniTop.length) continue;
        lines.push('', `<b>🎓 ${escHtml(ck)}-qabul Top-3 talabalari:</b>`);
        uniTop.forEach((u, i) => {
          lines.push(`${medals[i] || '🏅'} <b>${escHtml(u.display_name)}</b> (${escHtml(u.group_code || u.faculty_code || '')}) — ${u.points} ball`);
        });
        if (grpTop.length > 0) {
          lines.push(`👑 <b>Hafta guruhi:</b> ${escHtml(grpTop[0].group_code)} (o'rtacha ${grpTop[0].points} · ${grpTop[0].active_users} faol)`);
        }
      }

      lines.push('', `Yangi hafta 0 dan boshlandi — bu hafta sizning navbatingiz! 🚀`);
      const text = lines.join('\n');

      const recipients = await sbRest('users?select=tg_chat_id&tg_chat_id=not.is.null');
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
                text,
                parse_mode: 'HTML',
                disable_web_page_preview: true
              })
            });
            const j = await r.json();
            if (j.ok) telegramSent += 1;
          } catch (_) {}
        }));
        if (i + CHUNK < recipients.length) await new Promise((r) => setTimeout(r, 1100));
      }
    }

    res.status(200).json({ ok: true, weekId, alreadyFinalized: false, telegramSent, cohorts: cohortsObj });
  } catch (err) {
    res.status(err.status || 500).json({ ok: false, error: err.message });
  }
}
