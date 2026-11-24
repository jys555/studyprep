// StudyPrep 2.0 — Custom Smooth Metallic/Crystal SVG Reward Library & Cyber Unvon
(function () {
  const PAL = {
    gold:   { a: '#FEF08A', b: '#F59E0B', c: '#B45309', rim: '#FFFBEB', glow: 'rgba(245,158,11,.45)' },
    silver: { a: '#F8FAFC', b: '#CBD5E1', c: '#64748B', rim: '#FFFFFF', glow: 'rgba(148,163,184,.45)' },
    bronze: { a: '#FED7AA', b: '#EA8C55', c: '#9A3412', rim: '#FFEDD5', glow: 'rgba(234,140,85,.45)' }
  };

  let uidSeq = 0;
  const gid = (p) => `spg_${p}_${++uidSeq}`;

  // 1. Guruh Top-3: Faceted Crystal Star SVG
  function svgStar(tier = 'gold', size = 18) {
    const p = PAL[tier] || PAL.gold;
    const g1 = gid('st');
    return `<svg class="sp-badge-svg" width="${size}" height="${size}" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="${g1}" x1="4" y1="2" x2="28" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="${p.a}"/>
          <stop offset="52%" stop-color="${p.b}"/>
          <stop offset="100%" stop-color="${p.c}"/>
        </linearGradient>
      </defs>
      <path d="M16 2.5L19.8 11.1L29 12.1L22.1 18.3L24 27.5L16 22.8L8 27.5L9.9 18.3L3 12.1L12.2 11.1L16 2.5Z" fill="url(#${g1})" stroke="${p.rim}" stroke-width="1.1" stroke-linejoin="round"/>
      <path d="M16 2.5L19.8 11.1L16 15.8L12.2 11.1L16 2.5Z" fill="#FFFFFF" fill-opacity="0.38"/>
      <path d="M16 15.8L29 12.1L22.1 18.3L16 15.8Z" fill="#FFFFFF" fill-opacity="0.18"/>
    </svg>`;
  }

  // 2. Yo'nalish Top-3: Sculpted Brushed Metal Medal + Violet Silk Ribbon SVG
  function svgMedal(tier = 'gold', size = 19) {
    const p = PAL[tier] || PAL.gold;
    const g1 = gid('md');
    const g2 = gid('rb');
    return `<svg class="sp-badge-svg" width="${size}" height="${size}" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="${g1}" x1="7" y1="10" x2="25" y2="29" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="${p.a}"/>
          <stop offset="55%" stop-color="${p.b}"/>
          <stop offset="100%" stop-color="${p.c}"/>
        </linearGradient>
        <linearGradient id="${g2}" x1="9" y1="2" x2="23" y2="14" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#A78BFA"/>
          <stop offset="100%" stop-color="#5B21B6"/>
        </linearGradient>
      </defs>
      <path d="M10 3H15L17.5 11.5H13.5L10 3Z" fill="url(#${g2})"/>
      <path d="M22 3H17L14.5 11.5H18.5L22 3Z" fill="#7C3AED"/>
      <circle cx="16" cy="20" r="9.2" fill="url(#${g1})" stroke="${p.rim}" stroke-width="1.2"/>
      <circle cx="16" cy="20" r="6.3" fill="none" stroke="${p.c}" stroke-opacity="0.55" stroke-width="1.1"/>
      <path d="M16 15.2L17.5 18.4L21 18.8L18.4 21.1L19.1 24.5L16 22.8L12.9 24.5L13.6 21.1L11 18.8L14.5 18.4L16 15.2Z" fill="#FFFFFF" fill-opacity="0.72"/>
    </svg>`;
  }

  // 3. Universitet Top-3: Imperial Diamond-Amethyst Crown Crest SVG
  function svgCrown(tier = 'gold', size = 20) {
    const p = PAL[tier] || PAL.gold;
    const g1 = gid('cr');
    const g2 = gid('gm');
    return `<svg class="sp-badge-svg" width="${size}" height="${size}" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="${g1}" x1="3" y1="6" x2="29" y2="27" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="${p.a}"/>
          <stop offset="50%" stop-color="${p.b}"/>
          <stop offset="100%" stop-color="${p.c}"/>
        </linearGradient>
        <linearGradient id="${g2}" x1="16" y1="11" x2="16" y2="21" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#EDE9FE"/>
          <stop offset="100%" stop-color="#8B5CF6"/>
        </linearGradient>
      </defs>
      <path d="M4.5 23.5L3 10.5L10.5 15.5L16 6.5L21.5 15.5L29 10.5L27.5 23.5H4.5Z" fill="url(#${g1})" stroke="${p.rim}" stroke-width="1.15" stroke-linejoin="round"/>
      <rect x="5.5" y="24.2" width="21" height="3.2" rx="1.6" fill="url(#${g1})" stroke="${p.rim}" stroke-width="0.9"/>
      <path d="M16 12L19 16.5L16 21L13 16.5L16 12Z" fill="url(#${g2})" stroke="#FFFFFF" stroke-width="0.8"/>
      <circle cx="16" cy="5.5" r="1.5" fill="#FFFFFF"/>
    </svg>`;
  }

  // 4A. Hafta Guruhi #1: Emerald-Gold Group Cup SVG
  function svgGroupCup(size = 20) {
    const g1 = gid('gc');
    const g2 = gid('ge');
    return `<svg class="sp-badge-svg" width="${size}" height="${size}" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="${g1}" x1="6" y1="4" x2="26" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#FEF08A"/>
          <stop offset="55%" stop-color="#F59E0B"/>
          <stop offset="100%" stop-color="#B45309"/>
        </linearGradient>
        <linearGradient id="${g2}" x1="10" y1="6" x2="22" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#6EE7B7"/>
          <stop offset="100%" stop-color="#059669"/>
        </linearGradient>
      </defs>
      <path d="M9 6H23V14C23 18.2 19.9 21.3 16 21.3C12.1 21.3 9 18.2 9 14V6Z" fill="url(#${g1})" stroke="#FFFBEB" stroke-width="1.1"/>
      <path d="M12.2 8.2H19.8V13.6C19.8 16 18.1 17.8 16 17.8C13.9 17.8 12.2 16 12.2 13.6V8.2Z" fill="url(#${g2})"/>
      <path d="M9 8.5H5.5C5.5 13 7 15.2 9.4 15.6M23 8.5H26.5C26.5 13 25 15.2 22.6 15.6" stroke="#FBBF24" stroke-width="1.6" stroke-linecap="round"/>
      <rect x="14.2" y="21.2" width="3.6" height="4.2" fill="url(#${g1})"/>
      <rect x="10" y="25.2" width="12" height="3" rx="1.5" fill="url(#${g1})" stroke="#FFFBEB" stroke-width="0.9"/>
    </svg>`;
  }

  // 4B. Hafta Yo'nalishi #1: Royal Amethyst-Gold Faculty Chalice SVG
  function svgFacultyCup(size = 20) {
    const g1 = gid('fc');
    const g2 = gid('fv');
    return `<svg class="sp-badge-svg" width="${size}" height="${size}" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="${g1}" x1="8" y1="4" x2="24" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#FEF08A"/>
          <stop offset="55%" stop-color="#F59E0B"/>
          <stop offset="100%" stop-color="#B45309"/>
        </linearGradient>
        <linearGradient id="${g2}" x1="9" y1="5" x2="23" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#DDD6FE"/>
          <stop offset="55%" stop-color="#8B5CF6"/>
          <stop offset="100%" stop-color="#4C1D95"/>
        </linearGradient>
      </defs>
      <path d="M8.5 5.5H23.5L22.2 14.2C21.7 18.1 19.2 20.8 16 20.8C12.8 20.8 10.3 18.1 9.8 14.2L8.5 5.5Z" fill="url(#${g2})" stroke="#FDE68A" stroke-width="1.25"/>
      <path d="M11 8H15.5L14.5 16.5C12.8 16 11.8 14.4 11.4 12.2L11 8Z" fill="#FFFFFF" fill-opacity="0.25"/>
      <path d="M14 20.8H18L17.4 25.2H14.6L14 20.8Z" fill="url(#${g1})"/>
      <rect x="9.5" y="25.2" width="13" height="3" rx="1.5" fill="url(#${g1})" stroke="#FFFBEB" stroke-width="0.9"/>
    </svg>`;
  }

  // Shaxsiy Cyber Unvon (trophy_power asosida)
  function getCyberRank(power = 0) {
    const p = Number(power || 0);
    if (p >= 120) return { label: 'Cyber Legend', cls: 'bg-amber-400/20 text-amber-300 border border-amber-400/50', nextAt: 120, pct: 100 };
    if (p >= 60)  return { label: 'Grandmaster',  cls: 'bg-amber-400/15 text-amber-200 border border-amber-300/40', nextAt: 120, pct: Math.round(((p - 60) / 60) * 100) };
    if (p >= 25)  return { label: 'Master',       cls: 'bg-violet-400/20 text-violet-200 border border-violet-300/40', nextAt: 60, pct: Math.round(((p - 25) / 35) * 100) };
    if (p >= 10)  return { label: 'Intiluvchan',  cls: 'bg-sky-400/20 text-sky-200 border border-sky-300/40', nextAt: 25, pct: Math.round(((p - 10) / 15) * 100) };
    if (p >= 3)   return { label: 'Faol',         cls: 'bg-emerald-400/20 text-emerald-200 border border-emerald-300/40', nextAt: 10, pct: Math.round(((p - 3) / 7) * 100) };
    return { label: 'Yangi', cls: 'bg-white/15 text-violet-100 border border-white/20', nextAt: 3, pct: Math.round((p / 3) * 100) };
  }

  // Reyting qatoridagi ixcham mukofot nishonlari (silliq SVG)
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

    if (ug > 0) out.push(`<span title="Universitet #1 (${ug})" class="inline-flex items-center gap-0.5 text-[11px] font-extrabold text-amber-500 dark:text-amber-300">${svgCrown('gold', 16)}${ug > 1 ? '×' + ug : ''}</span>`);
    if (us > 0) out.push(`<span title="Universitet #2 (${us})" class="inline-flex items-center gap-0.5 text-[11px] font-extrabold text-slate-400 dark:text-slate-200">${svgCrown('silver', 16)}${us > 1 ? '×' + us : ''}</span>`);
    if (ub > 0) out.push(`<span title="Universitet #3 (${ub})" class="inline-flex items-center gap-0.5 text-[11px] font-extrabold text-orange-400">${svgCrown('bronze', 16)}${ub > 1 ? '×' + ub : ''}</span>`);
    if (fTot > 0) {
      const mTier = fg > 0 ? 'gold' : (fs > 0 ? 'silver' : 'bronze');
      out.push(`<span title="Yo‘nalish medali (${fTot})" class="inline-flex items-center gap-0.5 text-[11px] font-extrabold text-violet-500 dark:text-violet-300">${svgMedal(mTier, 16)}${fTot > 1 ? '×' + fTot : ''}</span>`);
    }
    if (sTot > 0) {
      const sTier = sg > 0 ? 'gold' : (ss > 0 ? 'silver' : 'bronze');
      out.push(`<span title="Guruh yulduzi (${sTot})" class="inline-flex items-center gap-0.5 text-[11px] font-extrabold text-amber-500 dark:text-amber-300">${svgStar(sTier, 15)}${sTot > 1 ? '×' + sTot : ''}</span>`);
    }
    return out.join(' ');
  }

  // Avatarni 7 kunlik Champion Aura halqasiga o'rash
  function wrapAvatarWithAura(innerAvatarHtml, aura) {
    if (!aura || !['gold', 'silver', 'bronze'].includes(aura)) return innerAvatarHtml;
    const pip = aura === 'gold'
      ? `<span class="sp-aura-crown-pip">${svgCrown('gold', 15)}</span>`
      : '';
    return `<span class="sp-aura-wrap sp-aura-${aura}">${pip}${innerAvatarHtml}</span>`;
  }

  window.SPRewards = {
    svgStar, svgMedal, svgCrown, svgGroupCup, svgFacultyCup,
    getCyberRank, renderCompactBadges, wrapAvatarWithAura
  };
})();
