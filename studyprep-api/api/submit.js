import { setCors, verifyFirebaseToken, getIsoWeekId, getUzDateStr } from './_lib/auth.js';
import { sbRest } from './_lib/supabase.js';

export default async function handler(req, res) {
  if (setCors(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  try {
    const authUser = await verifyFirebaseToken(req);
    const { topicId, correctCount, answeredCount, answeredIds = [], wrongIds = [] } = req.body || {};

    if (!topicId || typeof correctCount !== 'number' || typeof answeredCount !== 'number') {
      return res.status(400).json({ ok: false, error: 'Sessiya ma\'lumotlari to\'liq emas' });
    }
    if (answeredCount < 1 || answeredCount > 60 || correctCount < 0 || correctCount > answeredCount) {
      return res.status(400).json({ ok: false, error: 'Ball chegaradan tashqarida' });
    }

    const uRows = await sbRest(`users?uid=eq.${encodeURIComponent(authUser.uid)}&select=*`);
    const user = uRows[0];
    if (!user || user.profile_v < 2 || !user.group_code) {
      return res.status(400).json({ ok: false, error: 'Avval yo\'nalish va guruhingizni tanlang' });
    }

    // 10 soniyalik anti-spam cooldown
    if (user.last_submit_at && (Date.now() - new Date(user.last_submit_at).getTime()) < 10000) {
      return res.status(429).json({ ok: false, error: 'Juda tez so\'rov yuborildi, biroz kuting' });
    }

    // Mavzu progressini yangilash (best_score oshgan farqni total_correct ga qo'shamiz)
    const pRows = await sbRest(
      `topic_progress?uid=eq.${encodeURIComponent(authUser.uid)}&topic_id=eq.${encodeURIComponent(topicId)}&select=*`
    );
    const prev = pRows[0];
    const prevBest = prev?.best_score || 0;
    const newBest = Math.max(prevBest, correctCount);
    const scoreDelta = Math.max(0, newBest - prevBest);

    const mergedAnswered = Array.from(new Set([...(prev?.answered_ids || []), ...answeredIds.slice(0, 60)])).slice(0, 120);
    const cleanWrong = Array.from(new Set(wrongIds.slice(0, 60)));

    await sbRest('topic_progress', {
      method: 'POST',
      prefer: 'resolution=merge-duplicates',
      body: {
        uid: authUser.uid,
        topic_id: topicId,
        best_score: newBest,
        sessions_done: (prev?.sessions_done || 0) + 1,
        answered_ids: mergedAnswered,
        wrong_ids: cleanWrong,
        updated_at: new Date().toISOString()
      }
    });

    // Kunlik Streak hisobi (O'zbekiston sanasi bo'yicha)
    const today = getUzDateStr();
    const yesterday = getUzDateStr(new Date(Date.now() - 86400 * 1000));
    let newStreak = user.streak_days || 0;
    let dailyToday = user.daily_sessions_today || 0;

    if (user.last_active_day === today) {
      dailyToday += 1;
    } else if (user.last_active_day === yesterday) {
      newStreak += 1;
      dailyToday = 1;
    } else {
      newStreak = 1;
      dailyToday = 1;
    }

    const updatedUser = await sbRest(`users?uid=eq.${encodeURIComponent(authUser.uid)}`, {
      method: 'PATCH',
      prefer: 'return=representation',
      body: {
        total_correct: (user.total_correct || 0) + scoreDelta,
        lifetime_correct: (user.lifetime_correct || 0) + correctCount,
        lifetime_answered: (user.lifetime_answered || 0) + answeredCount,
        streak_days: newStreak,
        best_streak: Math.max(user.best_streak || 0, newStreak),
        last_active_day: today,
        daily_sessions_today: dailyToday,
        last_submit_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    });

    // Haftalik kubok ballari (admin qatnashmaydi)
    const weekId = getIsoWeekId();
    if (!user.is_admin && correctCount > 0) {
      const wRows = await sbRest(
        `weekly_scores?week_id=eq.${encodeURIComponent(weekId)}&uid=eq.${encodeURIComponent(authUser.uid)}&select=*`
      );
      const prevW = wRows[0];
      await sbRest('weekly_scores', {
        method: 'POST',
        prefer: 'resolution=merge-duplicates',
        body: {
          week_id: weekId,
          uid: authUser.uid,
          faculty_code: user.faculty_code,
          group_code: user.group_code,
          points: (prevW?.points || 0) + correctCount,
          sessions_count: (prevW?.sessions_count || 0) + 1,
          updated_at: new Date().toISOString()
        }
      });
    }

    res.status(200).json({
      ok: true,
      weekId,
      scoreDelta,
      streakDays: newStreak,
      dailySessionsToday: dailyToday,
      user: updatedUser[0]
    });
  } catch (err) {
    res.status(err.status || 500).json({ ok: false, error: err.message });
  }
}
