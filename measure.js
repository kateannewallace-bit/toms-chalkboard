/* ---------- Measuring: how long, how tall, and how far around ----------
   Loaded before app.js (it provides genMeasure). Things to measure are drawn as simple shapes:
   long things lie on a ruler, tall things stand next to a standing ruler, and round things get a
   string wrapped around them, which is then laid straight along the ruler. */

const MEASURE_LONG = [
  { n: 'hot dog', s: 'hotdog', u: 'small' }, { n: 'garter snake', s: 'snake', u: 'small' }, { n: 'worm', s: 'worm', u: 'small' },
  { n: 'pencil', s: 'pencil', u: 'small' }, { n: "wizard's wand", s: 'wand', u: 'small' }, { n: 'carrot', s: 'carrot', u: 'small' },
  { n: 'dirigible', s: 'blimp', u: 'big' }, { n: 'sea serpent', s: 'snake', u: 'big' }, { n: 'spear of Athena', s: 'spear', u: 'big' },
  { n: "knight's sword", s: 'sword', u: 'big' }, { n: "dragon's tail", s: 'tail', u: 'big' },
  { n: "demon's wings", s: 'wings', u: 'big', q: "How wide are the demon's wings, from tip to tip?", cmp: 'wider' },
];
const MEASURE_TALL = [
  { n: 'robot', s: 'robot', u: 'small' }, { n: 'cactus', s: 'cactus', u: 'small' }, { n: 'candle', s: 'candle', u: 'small' },
  { n: 'mummy', s: 'mummy', u: 'big' }, { n: 'castle tower', s: 'tower', u: 'big' }, { n: 'Cyclops', s: 'cyclops', u: 'big' },
];
const MEASURE_ROUND = [
  { n: 'pumpkin', c: 'var(--orange)' }, { n: 'crystal ball', c: 'var(--blue)' }, { n: "dragon's egg", c: 'var(--green)' },
  { n: "witch's cauldron", c: 'var(--chalk-dim)' }, { n: "troll's belly", c: 'var(--pink)' },
];
const UNIT_SETS = { small: [['cm', 13], ['inches', 10]], big: [['feet', 12], ['meters', 10]] };
const unitWord = (u, v) => u === 'cm' ? 'cm' : u === 'inches' ? (v === 1 ? 'inch' : 'inches') : u === 'feet' ? (v === 1 ? 'foot' : 'feet') : (v === 1 ? 'meter' : 'meters');
const the = n => /^[A-Z]/.test(n) ? `the ${n}` : `the ${n}`;

// one long thing lying from x to x + w, centered on y
function drawLong(s, x, y, w) {
  const h = 22, cy = y + h / 2, R = v => f1(v);
  switch (s) {
    case 'hotdog': return `<rect x="${R(x + w * 0.07)}" y="${y}" width="${R(w * 0.86)}" height="${h}" rx="${h / 2}" fill="#d9a35a"/><rect x="${x}" y="${cy - 5}" width="${R(w)}" height="10" rx="5" fill="#c65a4a"/><path d="M${R(x + w * 0.2)} ${cy}q${R(w * 0.05)} -4 ${R(w * 0.1)} 0t${R(w * 0.1)} 0t${R(w * 0.1)} 0" stroke="#f3d77a" stroke-width="2" fill="none"/>`;
    case 'snake': case 'worm': {
      const col = s === 'worm' ? '#e7a5a0' : 'var(--green)', segs = Math.max(2, Math.round(w / 40)), sw = (w - 8) / segs;
      let d = `M${R(x + 4)} ${cy}`; for (let i = 0; i < segs; i++) d += `q${R(sw / 2)} ${i % 2 ? 7 : -7} ${R(sw)} 0`;
      return `<path d="${d}" stroke="${col}" stroke-width="9" stroke-linecap="round" fill="none"/>${s === 'snake' ? `<circle cx="${R(x + w - 6)}" cy="${cy}" r="6" fill="${col}"/><circle cx="${R(x + w - 5)}" cy="${cy - 2}" r="1.6" fill="#222"/>` : ''}`;
    }
    case 'pencil': { const tip = Math.min(14, w / 3); return `<rect x="${x}" y="${y}" width="${R(w - tip)}" height="${h}" rx="3" fill="var(--yellow)"/><path d="M${R(x + w - tip)} ${y}L${R(x + w)} ${cy}L${R(x + w - tip)} ${y + h}Z" fill="#e8c9a0"/>`; }
    case 'wand': return `<rect x="${x}" y="${cy - 3}" width="${R(w - 6)}" height="6" rx="3" fill="#8a6240"/><circle cx="${R(x + w - 5)}" cy="${cy}" r="5" fill="var(--yellow)"/>`;
    case 'carrot': return `<path d="M${x} ${y + 2}L${R(x + w)} ${cy}L${x} ${y + h - 2}Z" fill="var(--orange)"/><path d="M${x + 2} ${y + 2}l6 -8M${x + 6} ${y + 3}l9 -6" stroke="var(--green)" stroke-width="3" stroke-linecap="round"/>`;
    case 'blimp': return `<ellipse cx="${R(x + w / 2)}" cy="${cy}" rx="${R(w / 2)}" ry="${h / 2 + 1}" fill="#c9ced0"/><path d="M${x + 6} ${cy}l10 -10v20z" fill="#8f979b"/><rect x="${R(x + w * 0.42)}" y="${y + h - 2}" width="${R(w * 0.16)}" height="7" rx="2" fill="#8f979b"/>`;
    case 'spear': return `<line x1="${x}" y1="${cy}" x2="${R(x + w - 16)}" y2="${cy}" stroke="#8a6240" stroke-width="4"/><path d="M${R(x + w - 18)} ${cy - 7}L${R(x + w)} ${cy}L${R(x + w - 18)} ${cy + 7}Z" fill="var(--yellow)"/>`;
    case 'sword': return `<rect x="${x}" y="${cy - 3}" width="16" height="6" rx="2" fill="#8a6240"/><rect x="${x + 15}" y="${cy - 10}" width="5" height="20" rx="2" fill="var(--yellow)"/><path d="M${x + 20} ${cy - 4}H${R(x + w - 10)}L${R(x + w)} ${cy}L${R(x + w - 10)} ${cy + 4}H${x + 20}Z" fill="#d7dde0"/>`;
    case 'tail': { let spikes = ''; for (let i = 1; i < 5; i++) { const sx = x + w * i / 6; spikes += `<path d="M${R(sx - 5)} ${R(cy - 7 + i)}l5 -8l5 8z" fill="var(--orange)"/>`; } return `<path d="M${x} ${y}L${R(x + w)} ${cy}L${x} ${y + h}Z" fill="var(--green)"/>${spikes}`; }
    case 'wings': { const m = x + w / 2; return `<path d="M${x} ${cy - 4}L${R(x + w * 0.3)} ${y - 4}L${R(m - 6)} ${cy - 2}L${R(m + 6)} ${cy - 2}L${R(x + w * 0.7)} ${y - 4}L${R(x + w)} ${cy - 4}Q${R(x + w * 0.86)} ${cy + 2} ${R(x + w * 0.78)} ${cy + 8}Q${R(x + w * 0.68)} ${cy + 2} ${R(m + 6)} ${cy + 6}L${R(m - 6)} ${cy + 6}Q${R(x + w * 0.32)} ${cy + 2} ${R(x + w * 0.22)} ${cy + 8}Q${R(x + w * 0.14)} ${cy + 2} ${x} ${cy - 4}Z" fill="#6b4d8a"/><circle cx="${R(m)}" cy="${cy}" r="7" fill="#4a3460"/><path d="M${R(m - 5)} ${cy - 6}l-2 -7M${R(m + 5)} ${cy - 6}l2 -7" stroke="var(--pink)" stroke-width="2.5" stroke-linecap="round"/>`; }
    default: return `<rect x="${x}" y="${y}" width="${R(w)}" height="${h}" rx="3" fill="var(--pink)"/>`;
  }
}
// one tall thing standing on the floor (base) and reaching up to top
function drawTall(s, x, top, w, base) {
  const H = base - top, R = v => f1(v), cx = x + w / 2;
  switch (s) {
    case 'robot': return `<rect x="${R(cx - w * 0.28)}" y="${R(top + H * 0.75)}" width="${R(w * 0.2)}" height="${R(H * 0.25)}" fill="#8f979b"/><rect x="${R(cx + w * 0.08)}" y="${R(top + H * 0.75)}" width="${R(w * 0.2)}" height="${R(H * 0.25)}" fill="#8f979b"/><rect x="${R(cx - w * 0.36)}" y="${R(top + H * 0.3)}" width="${R(w * 0.72)}" height="${R(H * 0.46)}" rx="4" fill="#c9ced0"/><rect x="${R(cx - w * 0.24)}" y="${R(top)}" width="${R(w * 0.48)}" height="${R(H * 0.28)}" rx="4" fill="#c9ced0"/><circle cx="${R(cx - w * 0.1)}" cy="${R(top + H * 0.13)}" r="${R(Math.max(2, w * 0.05))}" fill="var(--blue)"/><circle cx="${R(cx + w * 0.1)}" cy="${R(top + H * 0.13)}" r="${R(Math.max(2, w * 0.05))}" fill="var(--blue)"/>`;
    case 'mummy': { let st = ''; for (let i = 1; i < 8; i++) st += `<line x1="${R(cx - w * 0.3)}" y1="${R(top + H * i / 8)}" x2="${R(cx + w * 0.3)}" y2="${R(top + H * i / 8 + 4)}" stroke="#b9b29a" stroke-width="2"/>`; return `<rect x="${R(cx - w * 0.3)}" y="${R(top)}" width="${R(w * 0.6)}" height="${R(H)}" rx="${R(w * 0.25)}" fill="#e6dfc6"/>${st}<circle cx="${R(cx - w * 0.1)}" cy="${R(top + H * 0.1)}" r="3" fill="#c0392b"/><circle cx="${R(cx + w * 0.1)}" cy="${R(top + H * 0.1)}" r="3" fill="#c0392b"/>`; }
    case 'cactus': return `<rect x="${R(cx - w * 0.15)}" y="${R(top)}" width="${R(w * 0.3)}" height="${R(H)}" rx="${R(w * 0.15)}" fill="var(--green)"/><path d="M${R(cx - w * 0.15)} ${R(top + H * 0.55)}h${R(-w * 0.18)}v${R(-H * 0.25)}" stroke="var(--green)" stroke-width="${R(w * 0.14)}" fill="none" stroke-linecap="round"/><path d="M${R(cx + w * 0.15)} ${R(top + H * 0.45)}h${R(w * 0.18)}v${R(-H * 0.2)}" stroke="var(--green)" stroke-width="${R(w * 0.14)}" fill="none" stroke-linecap="round"/>`;
    case 'candle': return `<rect x="${R(cx - w * 0.17)}" y="${R(top)}" width="${R(w * 0.34)}" height="${R(H)}" rx="3" fill="#efe6cf"/><line x1="${R(cx)}" y1="${R(top)}" x2="${R(cx)}" y2="${R(top + 6)}" stroke="#3a3220" stroke-width="2"/>`;  // unlit, so the top of the wax is clearly the top
    case 'tower': { const roof = Math.min(30, H * 0.22); return `<rect x="${R(cx - w * 0.3)}" y="${R(top + roof)}" width="${R(w * 0.6)}" height="${R(H - roof)}" fill="#a39b8b"/><path d="M${R(cx - w * 0.38)} ${R(top + roof)}L${R(cx)} ${R(top)}L${R(cx + w * 0.38)} ${R(top + roof)}Z" fill="var(--pink)"/><rect x="${R(cx - 5)}" y="${R(top + roof + (H - roof) * 0.2)}" width="10" height="14" rx="5" fill="#3a3220"/>`; }
    case 'cyclops': { const hr = Math.min(w * 0.3, H * 0.16); return `<rect x="${R(cx - w * 0.32)}" y="${R(top + hr * 1.8)}" width="${R(w * 0.64)}" height="${R(H - hr * 1.8)}" rx="${R(w * 0.2)}" fill="#c98e5e"/><circle cx="${R(cx)}" cy="${R(top + hr)}" r="${R(hr)}" fill="#d9a37a"/><circle cx="${R(cx)}" cy="${R(top + hr)}" r="${R(hr * 0.4)}" fill="#fff"/><circle cx="${R(cx)}" cy="${R(top + hr)}" r="${R(hr * 0.18)}" fill="#222"/>`; }
    default: return `<rect x="${x}" y="${top}" width="${w}" height="${H}" fill="var(--pink)"/>`;
  }
}
function longSvg(max, objs) {
  const U = Math.min(34, Math.floor(440 / max)), x0 = 18, W = x0 * 2 + max * U, rowH = 34;
  const ry = 14 + objs.length * rowH + 6, RH = 46;
  let s = '';
  objs.forEach((o, i) => {
    const y = 10 + i * rowH, x = x0 + o.start * U, w = o.len * U;
    s += drawLong(o.thing.s, x, y, w);
    s += `<line x1="${x}" y1="${y + 24}" x2="${x}" y2="${ry}" class="guide"/><line x1="${x + w}" y1="${y + 24}" x2="${x + w}" y2="${ry}" class="guide"/>`;
    if (objs.length > 1) s += `<text x="${x + w + 8}" y="${y + 16}" class="r-label">${esc(o.thing.n)}</text>`;
  });
  s += `<rect x="4" y="${ry}" width="${W - 8}" height="${RH}" rx="4" class="ruler"/>`;
  for (let i = 0; i <= max; i++) { const x = x0 + i * U; s += `<line x1="${x}" y1="${ry}" x2="${x}" y2="${ry + 16}" class="r-tick"/><text x="${x}" y="${ry + 36}" text-anchor="middle" class="r-num">${i}</text>`; }
  const Wt = W + (objs.length > 1 ? 120 : 0);
  return `<svg class="rulerv" viewBox="0 0 ${Wt} ${ry + RH + 2}" width="${Math.round(Wt * 1.3)}" role="img" aria-label="ruler">${s}</svg>`;
}
function tallSvg(max, objs) {
  const U = Math.min(30, Math.floor(330 / max)), base = 20 + max * U, rx = 18, rw = 46, W = rx + rw + 30 + objs.length * 120;
  let s = `<rect x="${rx}" y="${base - max * U - 8}" width="${rw}" height="${max * U + 16}" rx="4" class="ruler"/>`;
  for (let i = 0; i <= max; i++) { const y = base - i * U; s += `<line x1="${rx + rw - 16}" y1="${y}" x2="${rx + rw}" y2="${y}" class="r-tick"/><text x="${rx + 16}" y="${y + 5}" text-anchor="middle" class="r-num">${i}</text>`; }
  s += `<line x1="${rx + rw}" y1="${base}" x2="${W - 6}" y2="${base}" class="floor"/>`;
  objs.forEach((o, i) => {
    const x = rx + rw + 30 + i * 120, top = base - o.len * U;
    s += drawTall(o.thing.s, x, top, 90, base);
    s += `<line x1="${rx + rw}" y1="${top}" x2="${x + 45}" y2="${top}" class="guide"/>`;
    s += `<text x="${x + 45}" y="${base + 20}" text-anchor="middle" class="r-label">${esc(o.thing.n)}</text>`;
  });
  return `<svg class="rulerv" viewBox="0 0 ${W} ${base + 28}" width="${Math.round(W * 1.3)}" role="img" aria-label="standing ruler">${s}</svg>`;
}
function aroundSvg(max, len, thing) {
  const U = Math.min(34, Math.floor(440 / max)), x0 = 18, W = x0 * 2 + max * U, r = Math.max(22, len * U / (2 * Math.PI)), cy = r + 14;
  const ry = cy + r + 40, RH = 46;
  let s = `<circle cx="${x0 + r + 10}" cy="${cy}" r="${f1(r)}" fill="${thing.c}" opacity=".9"/><circle cx="${x0 + r + 10}" cy="${cy}" r="${f1(r + 3)}" class="string-loop"/>`;
  s += `<text x="${x0 + 2 * r + 30}" y="${cy - 6}" class="r-label">string wrapped around</text><text x="${x0 + 2 * r + 30}" y="${cy + 14}" class="r-label dim">then laid straight ↓</text>`;
  s += `<line x1="${x0}" y1="${ry - 10}" x2="${x0 + len * U}" y2="${ry - 10}" class="string-line"/>`;
  s += `<rect x="4" y="${ry}" width="${W - 8}" height="${RH}" rx="4" class="ruler"/>`;
  for (let i = 0; i <= max; i++) { const x = x0 + i * U; s += `<line x1="${x}" y1="${ry}" x2="${x}" y2="${ry + 16}" class="r-tick"/><text x="${x}" y="${ry + 36}" text-anchor="middle" class="r-num">${i}</text>`; }
  return `<svg class="rulerv" viewBox="0 0 ${W} ${ry + RH + 2}" width="${Math.round(W * 1.3)}" role="img" aria-label="string around a round thing, laid on a ruler">${s}</svg>`;
}

function genMeasure(L) {
  const pickUnit = sz => pick(UNIT_SETS[sz]);
  const fmtFor = u => v => `${v} ${unitWord(u, v)}`;
  const spokenUnit = u => u === 'cm' ? 'centimeters' : u;
  if (L <= 2) {
    const roll = rng(), dim = L === 1 ? (roll < 0.55 ? 'long' : roll < 0.8 ? 'tall' : 'around') : (roll < 0.65 ? 'long' : roll < 0.85 ? 'tall' : 'around');
    if (dim === 'tall') {
      const t = pick(MEASURE_TALL), [u, max] = pickUnit(t.u), len = rand(2, max - (L === 1 ? 1 : 0));
      return { skill: 'measure', sub: 'tall', visual: tallSvg(max, [{ len, thing: t }]), ask: `How tall is ${the(t.n)}?`, speak: `How tall is ${the(t.n)}, in ${spokenUnit(u)}? Read the ruler at the very top.`, ans: len, fmt: fmtFor(u),
        distract: [[len + 1, 'counted the tick marks'], [len - 1, 'counting slip'], [len + 2, 'counting slip']], explain: `The top of ${the(t.n)} lines up with ${len}.` };
    }
    if (dim === 'around') {
      const t = pick(MEASURE_ROUND), [u, max] = pickUnit('small'), len = rand(5, max);
      return { skill: 'measure', sub: 'around', visual: aroundSvg(max, len, t), ask: `How far around is ${the(t.n)}?`, speak: `A string was wrapped around ${the(t.n)}, then laid straight on the ruler. How far around is it, in ${spokenUnit(u)}?`, ans: len, fmt: fmtFor(u),
        distract: [[Math.max(1, Math.round(len / 3.14)), 'measured across instead of around'], [len + 1, 'counted the tick marks'], [len - 1, 'counting slip']], explain: `The string that went around ${the(t.n)} reaches ${len} on the ruler.` };
    }
    const t = pick(MEASURE_LONG), [u, max] = pickUnit(t.u), len = rand(2, L === 1 ? max - 1 : max - 4), start = L === 1 ? 0 : rand(1, max - len);
    const d = [[len + 1, 'counted the tick marks'], [len - 1, 'counting slip']];
    if (start) d.unshift([start + len, 'read the end number without checking the start']);
    return { skill: 'measure', sub: start ? 'long-offset' : 'long', visual: longSvg(max, [{ start, len, thing: t }]), ask: t.q || `How long is ${the(t.n)}?`,
      speak: `${t.q || `How long is ${the(t.n)}?`} Measure in ${spokenUnit(u)}.${start ? ' Look where it starts.' : ''}`, ans: len, fmt: fmtFor(u), distract: d,
      explain: start ? `It starts at ${start} and ends at ${start + len}. ${start + len} − ${start} = ${len}` : `It starts at 0 and ends at ${len}.` };
  }
  if (L === 3) {
    const tall = rng() < 0.4, list = tall ? MEASURE_TALL : MEASURE_LONG.filter(t => t.s !== 'wings');
    const sz = pick(['small', 'big']), opts = shuffle(list.filter(t => t.u === sz));
    const [t1, t2] = opts.length >= 2 ? opts : shuffle(list);
    const [u, max] = pickUnit(t1.u), a = rand(5, max), b = rand(2, a - 1), word = tall ? 'taller' : 'longer';
    const visual = tall ? tallSvg(max, [{ len: a, thing: t1 }, { len: b, thing: t2 }]) : longSvg(max, [{ start: 0, len: a, thing: t1 }, { start: 0, len: b, thing: t2 }]);
    return { skill: 'measure', sub: tall ? 'compare-tall' : 'compare-long', visual, ask: `How much ${word} is ${the(t1.n)} than ${the(t2.n)}?`,
      speak: `How much ${word} is ${the(t1.n)} than ${the(t2.n)}?`, ans: a - b, fmt: fmtFor(u),
      distract: [[a, `gave the ${t1.n}'s length`], [a + b, 'added the lengths'], [b, `gave the ${t2.n}'s length`]], explain: `${a} − ${b} = ${a - b}` };
  }
  const st = [
    () => { const a = rand(25, 60), b = rand(11, a - 8); return { story: `${N()}'s paper boat floated ${a} feet down the stream. A friend's boat floated ${b} feet. How much farther did ${N()}'s boat float?`, ans: a - b, unit: 'feet', explain: `${a} − ${b} = ${a - b} feet`, distract: [[a + b, 'added instead of taking away']] }; },
    () => { const a = rand(12, 45), b = rand(12, 45); return { story: `A gnome walked ${a} meters to the mushroom ring, then ${b} meters to the stream. How far did the gnome walk?`, ans: a + b, unit: 'meters', explain: `${a} + ${b} = ${a + b} meters`, distract: [[Math.abs(a - b), 'took away instead of adding']] }; },
    () => { const a = rand(40, 90), b = rand(12, a - 15); return { story: `The ribbon was ${a} centimeters long. Mama cut off ${b} centimeters for a bookmark. How long is the ribbon now?`, ans: a - b, unit: 'cm', explain: `${a} − ${b} = ${a - b} cm`, distract: [[a + b, 'added instead of taking away']] }; },
    () => { const a = rand(30, 70), b = rand(12, 25); return { story: `A robot is ${a} inches tall. When it pops up its antenna, it gets ${b} inches taller. How tall is the robot with its antenna up?`, ans: a + b, unit: 'inches', explain: `${a} + ${b} = ${a + b} inches`, distract: [[a - b, 'took away instead of adding']] }; },
    () => { const a = rand(30, 60), b = rand(5, 6); return { story: `The Cyclops is ${a} feet tall. Odysseus is ${b} feet tall. How much taller is the Cyclops?`, ans: a - b, unit: 'feet', explain: `${a} − ${b} = ${a - b} feet`, distract: [[a + b, 'added instead of comparing']] }; },
    () => { const a = rand(40, 90), b = rand(11, a - 15); return { story: `A sea serpent is ${a} feet long. Its baby is ${b} feet long. How much longer is the parent?`, ans: a - b, unit: 'feet', explain: `${a} − ${b} = ${a - b} feet`, distract: [[a + b, 'added instead of comparing']] }; },
    () => { const a = rand(30, 70), b = rand(11, a - 10); return { story: `A dragon's wings stretch ${a} feet from tip to tip. A demon's wings stretch ${b} feet. How much wider are the dragon's wings?`, ans: a - b, unit: 'feet', explain: `${a} − ${b} = ${a - b} feet`, distract: [[a + b, 'added instead of comparing']] }; },
    () => { const a = rand(40, 70), b = rand(12, 25); return { story: `A troll measured ${a} inches around its belly. Then it gobbled three goats and got ${b} inches bigger around! How far around is the troll's belly now?`, ans: a + b, unit: 'inches', explain: `${a} + ${b} = ${a + b} inches`, distract: [[a - b, 'took away instead of adding']] }; },
    () => { const a = rand(40, 90), b = rand(12, a - 15); return { story: `The giant pumpkin is ${a} inches around. The little pumpkin is ${b} inches around. How much bigger around is the giant pumpkin?`, ans: a - b, unit: 'inches', explain: `${a} − ${b} = ${a - b} inches`, distract: [[a + b, 'added instead of comparing']] }; },
  ];
  const p = pick(st)();
  p.distract.push([p.ans + 1, 'counting slip'], [p.ans - 1, 'counting slip'], [p.ans + 10, 'off by ten']);
  return Object.assign({ skill: 'measure', sub: 'story', speak: p.story, fmt: v => `${v} ${p.unit}` }, p);
}
