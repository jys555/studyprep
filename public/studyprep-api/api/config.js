import { setCors } from './_lib/auth.js';
import { sbRest } from './_lib/supabase.js';

export default async function handler(req, res) {
  if (setCors(req, res)) return;
  try {
    const [faculties, cohorts, groups] = await Promise.all([
      sbRest('faculties?select=code,name,sort_order&is_active=eq.true&order=sort_order.asc'),
      sbRest('cohorts?select=year_code,label,course_num&is_active=eq.true&order=year_code.desc'),
      sbRest('groups?select=code,faculty_code,cohort_year,group_num&is_active=eq.true&order=group_num.asc')
    ]);
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    res.status(200).json({ ok: true, faculties, cohorts, groups });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
}
