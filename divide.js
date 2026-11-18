/* ---------- Division ----------
   Sharing and grouping with pictures first, then the ÷ sign, times facts used backwards,
   fact families, the ÷ facts, mystery numbers, leftovers and remainders, stories, and
   splitting a big number to divide it. Uses helpers from app.js at the time a problem is made.
   Also holds pickChoices and groupsSvg, which other new topics use. */

// explicit choices from a right answer and [value, tag] traps: no repeats, at most four
function pickChoices(ok, wrongs, extra = {}) {
  const seen = new Set([String(ok)]), out = [{ v: ok, ok: true, ...(extra[ok] || {}) }];
  for (const [v, tag] of wrongs) {
    if (out.length >= 4 || v == null || seen.has(String(v))) continue;
    seen.add(String(v)); out.push({ v, tag, ...(extra[v] || {}) });
  }
  return out;
}

const DIV_THINGS = [['acorn', 'acorns'], ['chestnut', 'chestnuts'], ['gold coin', 'gold coins'], ['dragon egg', 'dragon eggs'], ['shell', 'shells'], ['berry', 'berries'], ['pebble', 'pebbles'], ['apple', 'apples']];

// n groups (plates or bags) with `each` dots in every group, plus `left` dots outside any group.
// hi: how many groups to light up (fractions of a set)
function groupsSvg(n, each, left = 0, shape = 'plate', hi = 0) {
  const cols = each <= 3 ? each : each <= 6 ? 3 : each <= 8 ? 4 : 5, rows = Math.ceil(each / cols), D = 20;
  const gw = Math.max(cols * D + 16, 44), gh = rows * D + 16, gap = 14, perRow = n <= 5 ? n : Math.ceil(n / 2), nRows = Math.ceil(n / perRow);
  let s = '';
  for (let g = 0; g < n; g++) {
    const x = 4 + (g % perRow) * (gw + gap), y = 4 + Math.floor(g / perRow) * (gh + gap), on = g < hi ? ' on' : '';
    s += `<rect x="${x}" y="${y}" width="${gw}" height="${gh}" rx="${shape === 'plate' ? gh / 2 : 10}" class="dv-${shape}${on}"/>`;
    for (let i = 0; i < each; i++) {
      const cx = x + (gw - cols * D) / 2 + (i % cols) * D + D / 2, cy = y + 8 + Math.floor(i / cols) * D + D / 2;
      s += `<circle cx="${cx}" cy="${cy}" r="7" class="dv-dot${on}"/>`;
    }
  }
  const lastCount = n - (nRows - 1) * perRow, lx = 4 + lastCount * (gw + gap), ly = 4 + (nRows - 1) * (gh + gap);
  for (let i = 0; i < left; i++) s += `<circle cx="${lx + (i % 2) * D + D / 2}" cy="${ly + 8 + Math.floor(i / 2) * D + D / 2}" r="7" class="dv-dot dv-left"/>`;
  const W = 8 + Math.max(perRow * (gw + gap) - gap, left ? lx - 4 + 2 * D : 0);
  const H = Math.max(8 + nRows * (gh + gap) - gap, left ? ly + Math.ceil(left / 2) * D + 20 : 0);
  return `<svg class="groups" viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="${n} ${shape === 'plate' ? 'plates' : 'bags'} with ${each} in each${left ? `, and ${left} left over` : ''}">${s}</svg>`;
}

const divFacts = (d, q) => { const t = d * q; return [[t - d, 'took away instead of dividing'], [d, 'gave the number you divide by'], [t, 'copied the total'], [q + 1, 'next fact over'], [q - 1, 'next fact over'], [q + 2, 'counting slip']]; };
const DIV_STORIES = {
  share: [
    (t, g) => `The dragon guards ${t} gold coins and shares them equally among its ${g} babies. How many coins does each baby dragon get?`,
    (t, g) => `${t} roasted chestnuts are shared equally among ${g} lantern walkers at Martinmas. How many chestnuts does each walker get?`,
    (t, g) => `Odysseus shares ${t} barrels of water equally among his ${g} ships. How many barrels go on each ship?`,
  ],
  groups: [
    (t, s) => `The Cornish pixies pack ${t} berries into baskets, ${s} berries in each basket. How many baskets do they fill?`,
    (t, s) => `The blacksmith made ${t} horseshoes. Each horse needs ${s}. How many horses can get new shoes?`,
    (t, s) => `${t} scarab beetles march into the pharaoh's tomb in lines of ${s}. How many lines are there?`,
  ],
  roundUp: [
    (t, s) => `${t} children are riding to the harvest festival. Each wagon holds ${s} children. How many wagons are needed so nobody is left behind?`,
    (t, s) => `${t} knights must cross the river. The boat carries ${s} knights at a time. How many trips does the boat make to get every knight across?`,
  ],
  leftover: [
    (t, g) => `${t} pebbles are shared equally among ${g} trolls, as many as each troll can get. How many pebbles are left over?`,
    (t, g) => `The witch shares ${t} toadstools equally among ${g} cauldrons, as many as each cauldron can get. How many toadstools are left over?`,
  ],
};

function genDivide(L) {
  const base = { skill: 'divide' }, [, many] = pick(DIV_THINGS);
  switch (L) {
    case 1: { // share, with pictures
      let g, e; do { g = rand(2, 4); e = rand(2, 5); } while (g === e);
      const t = g * e;
      return { ...base, story: `${t} ${many} are shared equally on ${g} plates. How many ${many} are on each plate?`, visual: groupsSvg(g, e, 0, 'plate'), ans: e,
        distract: [[g, 'gave the number of plates'], [t, 'gave the total'], [t - g, 'took away instead of sharing'], [e + 1, 'counting slip'], [e - 1, 'counting slip']],
        explain: `${t} shared onto ${g} plates gives ${e} on each, because ${g} × ${e} = ${t}.` };
    }
    case 2: { // how many groups, with pictures
      let s, k; do { s = rand(2, 5); k = rand(2, 5); } while (s === k);
      const t = s * k;
      return { ...base, story: `${t} ${many} are packed into bags, ${s} in each bag. How many bags are there?`, visual: groupsSvg(k, s, 0, 'bag'), ans: k,
        distract: [[s, 'gave how many are in each bag'], [t, 'gave the total'], [t - s, 'took away instead'], [k + 1, 'counting slip'], [k - 1, 'counting slip']],
        explain: `${k} bags of ${s} make ${t}: ${k} × ${s} = ${t}. So ${t} ÷ ${s} = ${k}.` };
    }
    case 3: { // the ÷ sign
      let g, e; do { g = rand(2, 6); e = rand(2, 8); } while (g === e);
      const t = g * e;
      return { ...base, q: `${t} ÷ ${g}`, visual: groupsSvg(g, e, 0, 'plate'), ask: '÷ means share equally. How many in each group?', speak: `${t} divided by ${g}. Share ${t} into ${g} equal groups. How many are in each group?`, ans: e,
        distract: divFacts(g, e), explain: `${t} ÷ ${g} = ${e}. ${t} shared into ${g} equal groups gives ${e} in each.` };
    }
    case 4: { // times helps divide
      const a = rand(2, 9), b = rand(2, 9), p = a * b;
      return { ...base, q: `<div class="q-lines"><div>${a} × ${b} = ${p}</div><div>${p} ÷ ${a} = ${BOX}</div></div>`, ask: 'Use the times fact to divide.', speak: `${a} times ${b} is ${p}. So ${p} divided by ${a} is what?`, ans: b,
        distract: divFacts(a, b), explain: `${a} groups of ${b} make ${p}, so ${p} shared into ${a} groups is ${b}.` };
    }
    case 5: { // fact families
      let a, b; do { a = rand(2, 9); b = rand(2, 9); } while (a === b);
      const p = a * b, flip = rng() < 0.5, ok = flip ? `${p} ÷ ${b} = ${a}` : `${p} ÷ ${a} = ${b}`;
      return { ...base, q: `${a} × ${b} = ${p}`, ask: 'Which division fact is in the same family?', speak: `${a} times ${b} is ${p}. Which division fact belongs to the same family?`, ans: ok, wordy: true,
        choices: pickChoices(ok, [[`${a} ÷ ${p} = ${b}`, 'divided the small number by the big one'], [`${p} ÷ ${a} = ${b + 1}`, 'next fact over'], [`${b} ÷ ${a} = ${p}`, 'mixed up the order'], [`${p} ÷ ${b} = ${a + 1}`, 'next fact over']]),
        explain: `${a} × ${b} = ${p}, ${b} × ${a} = ${p}, ${p} ÷ ${a} = ${b} and ${p} ÷ ${b} = ${a} are one family: the same three numbers.` };
    }
    case 6: case 7: case 8: { // the ÷ facts
      const d = L === 6 ? pick([2, 5, 10]) : L === 7 ? pick([3, 4]) : rand(2, 10), q = L === 8 ? rand(2, 10) : rand(1, 10), t = d * q;
      return { ...base, q: `${t} ÷ ${d}`, speak: `${t} divided by ${d}`, ans: q, distract: divFacts(d, q), explain: `${d} × ${q} = ${t}, so ${t} ÷ ${d} = ${q}.` };
    }
    case 9: { // mystery number
      const d = rand(2, 9), q = rand(2, 9), t = d * q;
      if (rng() < 0.5) return { ...base, q: `${BOX} ÷ ${d} = ${q}`, ask: 'What number goes in the box?', speak: `What number divided by ${d} makes ${q}?`, ans: t,
        distract: [[q, 'copied a number'], [d + q, 'added the numbers'], [t + d, 'next fact over'], [t - d, 'next fact over'], [t + 10, 'off by ten']],
        explain: `Undo the ÷ with ×: ${d} × ${q} = ${t}. Check: ${t} ÷ ${d} = ${q}.` };
      return { ...base, q: `${t} ÷ ${BOX} = ${q}`, ask: 'What number goes in the box?', speak: `${t} divided by what number makes ${q}?`, ans: d,
        distract: [[q, 'copied the answer'], [t - q, 'took away instead'], [t, 'copied the total'], [d + 1, 'next fact over'], [d - 1, 'next fact over']],
        explain: `Which number of groups gives ${q} in each? ${d} × ${q} = ${t}, so ${t} ÷ ${d} = ${q}.` };
    }
    case 10: { // leftovers with pictures
      const s = rand(3, 5), k = rand(2, 4), r = rand(1, s - 1), t = s * k + r, left = rng() < 0.55;
      const common = { ...base, story: `${t} ${many} go into bags of ${s}. Fill as many bags as you can.`, visual: groupsSvg(k, s, r, 'bag'),
        explain: `${k} full bags of ${s} use ${k * s}. ${t} − ${k * s} = ${r} left over.` };
      if (left) return { ...common, sub: 'left', ask: 'How many are left over?', ans: r,
        distract: [[k, 'gave the number of full bags'], [s, 'gave the bag size'], [s - r, 'counted the empty spaces'], [r + 1, 'counting slip'], [r + 2, 'counting slip']] };
      return { ...common, sub: 'full', ask: 'How many bags are full?', ans: k,
        distract: [[k + 1, 'counted the leftovers as a bag'], [r, 'gave the leftovers'], [s, 'gave the bag size'], [k + 2, 'counting slip']] };
    }
    case 11: { // remainders
      const d = rand(2, 9), q = rand(2, 9), r = rand(1, d - 1), t = d * q + r, ok = `${q} r ${r}`;
      const cand = [[q + 1, r, 'one group too many'], [q, r === 1 ? 2 : r - 1, 'miscounted the leftovers'], [q - 1, r, 'one group too few'], [r, q, 'swapped the numbers'], [q, 0, 'forgot the leftovers'], [q, r + 1, 'miscounted the leftovers']]
        .filter(([a, b]) => d * a + b !== t).map(([a, b, tag]) => [`${a} r ${b}`, tag]);
      const say = v => { const [a, b] = v.split(' r '); return { say: `${a} remainder ${b}` }; };
      const choices = pickChoices(ok, cand).map(c => ({ ...c, ...say(c.v) }));
      return { ...base, q: `${t} ÷ ${d}`, ask: 'How many groups, and how many left over? The leftovers go after the r.', speak: `${t} divided by ${d}. How many groups, and how many left over?`, ans: ok, choices,
        explain: `${d} × ${q} = ${d * q}. ${t} − ${d * q} = ${r} left over. So ${t} ÷ ${d} = ${q} r ${r}.` };
    }
    case 12: { // stories
      const kind = pick(['share', 'groups', 'roundUp', 'leftover']), tpl = pick(DIV_STORIES[kind]);
      if (kind === 'share' || kind === 'groups') {
        let g, e; do { g = rand(2, 6); e = rand(2, 9); } while (g === e);
        const t = g * e, story = tpl(t, g);
        return { ...base, sub: kind, story, ans: e, distract: [[g, kind === 'share' ? 'gave the number sharing' : 'gave the group size'], [t - g, 'took away instead of dividing'], [t, 'copied the total'], [e + 1, 'next fact over'], [e - 1, 'next fact over']],
          explain: `${t} ÷ ${g} = ${e}, because ${g} × ${e} = ${t}.` };
      }
      if (kind === 'roundUp') {
        const s = rand(3, 6), k = rand(2, 6), r = rand(1, s - 1), t = s * k + r;
        return { ...base, sub: kind, story: tpl(t, s), ans: k + 1, distract: [[k, 'forgot the ones left behind'], [r, 'gave the leftovers'], [k + 2, 'one too many'], [t - s, 'took away instead']],
          explain: `${t} ÷ ${s} = ${k} r ${r}. ${k} full loads carry ${k * s}, and ${r} are still waiting, so it takes one more: ${k + 1}.` };
      }
      const g = rand(3, 6), q = rand(2, 6), r = rand(1, g - 1), t = g * q + r;
      return { ...base, sub: kind, story: tpl(t, g), ans: r, distract: [[q, 'gave how many each one gets'], [g, 'gave the number sharing'], [g - r, 'counted what was missing'], [r + 1, 'counting slip'], [r + 2, 'counting slip']],
        explain: `Each gets ${q}, because ${g} × ${q} = ${g * q}. ${t} − ${g * q} = ${r} left over.` };
    }
    default: { // split to divide
      const d = rand(2, 6); let q; do { q = rand(12, 29); } while (q % 10 === 0);
      const t = d * q, p1 = d * 10 * Math.floor(q / 10), p2 = t - p1;
      return { ...base, q: `${t} ÷ ${d}`, ask: 'Split the number into parts that are easy to divide.', speak: `${t} divided by ${d}. Try splitting ${t} into ${p1} and ${p2}.`, ans: q,
        distract: [[q + 10, 'off by ten'], [q - 10, 'off by ten'], [t - d, 'took away instead'], [q + 1, 'counting slip'], [q - 1, 'counting slip']],
        explain: `${t} = ${p1} + ${p2}. ${p1} ÷ ${d} = ${p1 / d} and ${p2} ÷ ${d} = ${p2 / d}. ${p1 / d} + ${p2 / d} = ${q}.` };
    }
  }
}
