// StudyPrep 2.0 — 3D Studio WebP Reward Library & Cyber Unvon
(function () {
  const BASE = 'assets/rewards/';
  const VALID_TIER = (t) => (['gold', 'silver', 'bronze'].includes(t) ? t : 'gold');

  function imgTag(file, size = 32, alt = 'Mukofot') {
    return `<img src="${BASE}${file}" width="${size}" height="${size}" style="width:${size}px;height:${size}px" class="sp-trophy-img" alt="${alt}" loading="lazy">`;
  }

  function svgStar(tier = 'gold', size = 24) {
    return imgTag(`star-${VALID_TIER(tier)}.webp`, size, 'Kristall Yulduz');
  }
  function svgMedal(tier = 'gold', size = 26) {
    return imgTag(`medal-${VALID_TIER(tier)}.webp`, size, 'Metall Lenta-Medal');
  }
  function svgCrown(tier = 'gold', size = 28) {
    return imgTag(`crown-${VALID_TIER(tier)}.webp`, size, 'Imperator Toji');
  }
  function svgGroupCup(size = 28) {
    return imgTag('cup-group.webp', size, 'Hafta Guruhi Kubogi');
  }
  function svgFacultyCup(size = 28) {
    return imgTag('cup-faculty.webp', size, 'Hafta Yo‘nalishi Kubogi');
  }

  function getCyberRank(power = 0) {
    const p = Number(power || 0);
    if (p >= 120) return { label: 'Cyber Legend', cls: 'bg-amber-400/20 text-amber-300 border border-amber-400/50', nextAt: 120, pct: 100 };
    if (p >= 60)  return { label: 'Grandmaster',  cls: 'bg-amber-400/15 text-amber-200 border border-amber-300/40', nextAt: 120, pct: Math.round(((p - 60) / 60) * 100) };
    if (p >= 25)  return { label: 'Master',       cls: 'bg-violet-400/20 text-violet-200 border border-violet-300/40', nextAt: 60, pct: Math.round(((p - 25) / 35) * 100) };
    if (p >= 10)  return { label: 'Intiluvchan',  cls: 'bg-sky-400/20 text-sky-200 border border-sky-300/40', nextAt: 25, pct: Math.round(((p - 10) / 15) * 100) };
    if (p >= 3)   return { label: 'Faol',         cls: 'bg-emerald-400/20 text-emerald-200 border border-emerald-300/40', nextAt: 10, pct: Math.round(((p - 3) / 7) * 100) };
    return { label: 'Yangi', cls: 'bg-white/15 text-violet-100 border border-white/20', nextAt: 3, pct: Math.round((p / 3) * 100) };
  }

  function renderCompactBadges(u) {
    if (!u) return '';
    const out = [];
    const ug = u.gold_medals ?? u.gold ?? 0;
    const us = u.silver_medals ?? u.silver ?? 0;
    const ub = u.bronze_medals ?? u.bronze ?? 0;
    const fg = u.faculty_medals_gold ?? u.facGold ?? 0;
    const fs = u.faculty_medals_silver ?? u.facSilver ?? 0;
    const fb = u.faculty_medals_bronze ?? u.facBronze ?? 0;
    const fTot = (fg + fs + fb) || (u.faculty_medals ?? u.faculty ?? 0);
    const sg = u.group_stars_gold ?? u.starGold ?? 0;
    const ss = u.group_stars_silver ?? u.starSilver ?? 0;
    const sb = u.group_stars_bronze ?? u.starBronze ?? 0;
    const sTot = sg + ss + sb;

    if (ug > 0) out.push(`<span title="Universitet #1 (${ug})" class="inline-flex items-center gap-0.5 text-[11px] font-extrabold text-amber-500 dark:text-amber-300">${svgCrown('gold', 20)}${ug > 1 ? '×' + ug : ''}</span>`);
    if (us > 0) out.push(`<span title="Universitet #2 (${us})" class="inline-flex items-center gap-0.5 text-[11px] font-extrabold text-slate-400 dark:text-slate-200">${svgCrown('silver', 20)}${us > 1 ? '×' + us : ''}</span>`);
    if (ub > 0) out.push(`<span title="Universitet #3 (${ub})" class="inline-flex items-center gap-0.5 text-[11px] font-extrabold text-orange-400">${svgCrown('bronze', 20)}${ub > 1 ? '×' + ub : ''}</span>`);
    if (fTot > 0) {
      const mTier = fg > 0 ? 'gold' : (fs > 0 ? 'silver' : 'bronze');
      out.push(`<span title="Yo‘nalish medali (${fTot})" class="inline-flex items-center gap-0.5 text-[11px] font-extrabold text-violet-500 dark:text-violet-300">${svgMedal(mTier, 20)}${fTot > 1 ? '×' + fTot : ''}</span>`);
    }
    if (sTot > 0) {
      const sTier = sg > 0 ? 'gold' : (ss > 0 ? 'silver' : 'bronze');
      out.push(`<span title="Guruh yulduzi (${sTot})" class="inline-flex items-center gap-0.5 text-[11px] font-extrabold text-amber-500 dark:text-amber-300">${svgStar(sTier, 19)}${sTot > 1 ? '×' + sTot : ''}</span>`);
    }
    return out.join(' ');
  }

  function wrapAvatarWithAura(innerAvatarHtml, aura) {
    if (!aura || !['gold', 'silver', 'bronze'].includes(aura)) return innerAvatarHtml;
    const pip = aura === 'gold'
      ? `<span class="sp-aura-crown-pip">${svgCrown('gold', 20)}</span>`
      : '';
    return `<span class="sp-aura-wrap sp-aura-${aura}">${pip}${innerAvatarHtml}</span>`;
  }

  window.SPRewards = {
    svgStar, svgMedal, svgCrown, svgGroupCup, svgFacultyCup,
    getCyberRank, renderCompactBadges, wrapAvatarWithAura
  };
})();
