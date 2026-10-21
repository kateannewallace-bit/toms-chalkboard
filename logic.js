/* ---------- Logic & puzzles ----------
   RSM-style reasoning puzzles (our own problems): odd one out, true or false, comparing sums,
   number rules, "I'm thinking of a number", sorting circles, two-number puzzles, number pyramids
   and shape puzzles. Uses helpers from app.js and thinking.js at the time a problem is made. */

// Rules a child might notice. A puzzle is fair only if every rule that singles out one number
// singles out the same number, so there is exactly one answer.
const ODD_RULES = [
  n => n % 2 === 0,      // even or odd
  n => n >= 10,          // one digit or two
  n => n % 5 === 0,      // in the 5s pattern
  n => n % 10 === 0,     // a whole ten
  n => n % 3 === 0,      // in the 3s pattern
  n => isSq(n),          // a square number
];
function singledOut(items) {
  const out = new Set();
  for (const rule of ODD_RULES) {
    const yes = items.filter(rule);
    if (yes.length === 1) out.add(yes[0]);
    if (yes.length === items.length - 1) out.add(items.find(n => !rule(n)));
  }
  return out;
}
function oddOneOut(L) {
  const kinds = [
    () => { const ev = shuffle([2, 4, 6, 8, 10, 12, 14, 16, 18, 20]).slice(0, 3), o = pick([3, 5, 7, 9, 11, 13, 15, 17, 19]); return { items: [...ev, o], odd: o, why: `${o} is the only odd number. The others are even.` }; },
    () => { const f = shuffle([5, 10, 15, 20, 25, 30, 35, 40]).slice(0, 3); let o; do { o = rand(6, 39); } while (o % 5 === 0); return { items: [...f, o], odd: o, why: `${o} is not in the counting-by-5s pattern. The others are.` }; },
    () => { const sm = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3), big = rand(11, 30); return { items: [...sm, big], odd: big, why: `${big} has two digits. The others have one.` }; },
    () => { const t = shuffle([10, 20, 30, 40, 50, 60, 70, 80, 90]).slice(0, 3); let o; do { o = rand(11, 95); } while (o % 10 === 0); return { items: [...t, o], odd: o, why: `${o} is not a whole ten. The others end in 0.` }; },
    () => { const sq = shuffle([1, 4, 9, 16, 25, 36]).slice(0, 3); let o; do { o = rand(2, 35); } while (isSq(o)); return { items: [...sq, o], odd: o, why: `${o} is not a square number. The others are.` }; },
  ];
  const pool = L >= 2 ? kinds : kinds.slice(0, 4);
  for (let tries = 0; tries < 200; tries++) {
    const o = pick(pool)();
    const s = singledOut(o.items);
    if (s.size === 1 && s.has(o.odd)) return o;
  }
  return { items: [2, 4, 6, 7], odd: 7, why: '7 is the only odd number. The others are even.' };
}

// two overlapping sorting circles with dots in each region
function vennSvg(labelA, labelB, onlyA, both, onlyB) {
  const W = 360, H = 230;
  const dots = (n, cx, cy) => { let s = ''; for (let i = 0; i < n; i++) { const col = i % 2, row = Math.floor(i / 2); s += `<circle cx="${cx + (col ? 11 : -11)}" cy="${cy - 22 + row * 22}" r="8" class="venn-dot"/>`; } return s; };
  return `<svg class="venn" viewBox="0 0 ${W} ${H}" width="${Math.round(W * 1.2)}" role="img" aria-label="two sorting circles">
    <circle cx="135" cy="125" r="92" class="venn-a"/><circle cx="225" cy="125" r="92" class="venn-b"/>
    <text x="95" y="22" text-anchor="middle" class="venn-l a">${esc(labelA)}</text><text x="265" y="22" text-anchor="middle" class="venn-l b">${esc(labelB)}</text>
    ${dots(onlyA, 92, 125)}${dots(both, 180, 125)}${dots(onlyB, 268, 125)}</svg>`;
}
const VENN_SETS = [
  { who: 'knights', A: 'sword', B: 'shield', has: x => `have a ${x}` },
  { who: 'dragons', A: 'wings', B: 'horns', has: x => `have ${x}` },
  { who: 'pixies', A: 'red hat', B: 'lantern', has: x => `have a ${x}` },
  { who: 'monsters', A: 'fangs', B: 'claws', has: x => `have ${x}` },
];

// number pyramid: each block is the sum of the two blocks under it
function pyramidSvg(rows) {
  const bw = 64, bh = 44, W = rows[rows.length - 1].length * bw + 20;
  let s = '';
  rows.forEach((row, r) => {
    const y = 10 + r * (bh + 4), x0 = (W - row.length * bw) / 2;
    row.forEach((v, i) => { const q = v === '?'; s += `<rect x="${x0 + i * bw + 2}" y="${y}" width="${bw - 4}" height="${bh}" rx="5" class="pyr ${q ? 'q' : ''}"/><text x="${x0 + i * bw + bw / 2}" y="${y + bh / 2 + 7}" text-anchor="middle" class="bm-t ${q ? 'qt' : 'dark'}">${v}</text>`; });
  });
  return `<svg class="pyramid" viewBox="0 0 ${W} ${10 + rows.length * (bh + 4) + 6}" width="${Math.round(W * 1.3)}" role="img" aria-label="number pyramid">${s}</svg>`;
}
// drawn shapes, all the same size (font symbols for these vary a lot in size)
const shapeSvg = (cls, inner) => `<svg class="shp ${cls}" viewBox="0 0 20 20" aria-hidden="true">${inner}</svg>`;
const SHAPES = {
  circle: shapeSvg('c', '<circle cx="10" cy="10" r="9"/>') + '<span class="sr">circle</span>',
  square: shapeSvg('s', '<rect x="1.5" y="1.5" width="17" height="17" rx="2"/>') + '<span class="sr">square</span>',
  triangle: shapeSvg('t', '<path d="M10 1.5L19 18.5H1z"/>') + '<span class="sr">triangle</span>',
};

function genLogic(L) {
  const base = { skill: 'logic' };
  switch (L) {
    case 1: case 2: { // odd one out
      const o = oddOneOut(L - 1);
      return { ...base, ask: 'Which one does not belong?', speak: `Which one does not belong? ${listOr(o.items.map(String))}?`, ans: o.odd,
        choices: o.items.map(v => ({ v, ok: v === o.odd, tag: 'missed the rule' })), explain: o.why };
    }
    case 3: { // true or false, simple
      const a = rand(2, 9), b = rand(2, 9), sub = rng() < 0.4, real = sub ? Math.max(a, b) - Math.min(a, b) : a + b, truth = rng() < 0.5;
      const shown = truth ? real : real + pick([-2, -1, 1, 2, 10].filter(d => real + d >= 0));
      const q = sub ? `${Math.max(a, b)} − ${Math.min(a, b)} = ${shown}` : `${a} + ${b} = ${shown}`;
      return { ...base, q, ask: 'True or false?', speak: `${spoken(q)}. True or false?`, ans: truth ? 'True' : 'False',
        choices: [{ v: 'True', ok: truth, tag: 'checked the sum too fast' }, { v: 'False', ok: !truth, tag: 'checked the sum too fast' }],
        explain: truth ? `${q.split('=')[0].trim()} really is ${real}.` : `${q.split('=')[0].trim()} is ${real}, not ${shown}.` };
    }
    case 4: { // true or false with both sides: = means "the same amount"
      const a = rand(3, 9), b = rand(3, 9), k = rand(1, Math.min(a, b) - 1), truth = rng() < 0.5;
      let c = a + k, d = b - k;
      if (!truth) { if (rng() < 0.5) d = b; else d = d + pick([1, -1]); }
      const q = `${a} + ${b} = ${c} + ${d}`;
      return { ...base, q, ask: 'True or false? Are both sides the same amount?', speak: `${spoken(q)}. True or false?`, ans: truth ? 'True' : 'False',
        choices: [{ v: 'True', ok: truth, tag: 'did not check both sides' }, { v: 'False', ok: !truth, tag: 'did not check both sides' }],
        explain: `${a} + ${b} = ${a + b} and ${c} + ${d} = ${c + d}. ${a + b === c + d ? 'Both sides are the same, so it is true.' : 'They are different, so it is false.'}` };
    }
    case 5: { // compare two sums
      const a = rand(2, 12), b = rand(2, 9), left = a + b;
      let c = rand(2, 12), d = rand(2, 9);
      if (rng() < 0.25) { c = a + 1; d = b - 1; if (d < 1) { c = a - 1; d = b + 1; } }
      const right = c + d, sym = left > right ? '>' : left < right ? '<' : '=';
      return { ...base, q: `${a} + ${b} ${BOX} ${c} + ${d}`, ask: 'Which sign goes in the box?', speak: `Which sign goes between ${a} plus ${b} and ${c} plus ${d}? Greater than, less than, or equal?`, ans: sym,
        choices: [{ v: '>', ok: sym === '>', say: 'greater than', tag: 'flipped the sign' }, { v: '<', ok: sym === '<', say: 'less than', tag: 'flipped the sign' }, { v: '=', ok: sym === '=', say: 'equal', tag: 'thought they were equal' }],
        explain: `${a} + ${b} = ${left} and ${c} + ${d} = ${right}, so ${left} ${sym} ${right}.` };
    }
    case 6: { // what's the rule?
      const kind = rng() < 0.2 ? 'double' : rng() < 0.3 ? 'down' : 'up';
      let seq, ruleText;
      if (kind === 'double') { const s0 = rand(1, 5); seq = [s0, s0 * 2, s0 * 4, s0 * 8]; ruleText = 'Each number is double the one before'; }
      else { const k = rand(2, 10), s0 = kind === 'up' ? rand(1, 20) : rand(4 * 10 + 5, 60); seq = [0, 1, 2, 3].map(i => s0 + (kind === 'up' ? i * k : -i * k)); ruleText = `${kind === 'up' ? 'Add' : 'Take away'} ${k} each time`; }
      const next = kind === 'double' ? seq[3] * 2 : 2 * seq[3] - seq[2], step = seq[3] - seq[2];
      return { ...base, q: `${seq.join(', ')}, ${BOX}`, qClass: 'small', ask: 'What comes next? Find the rule.', speak: `${seq.join(', ')}. What comes next?`, ans: next,
        distract: [[seq[3] + step + 1, 'rule was a little off'], [seq[3] + step - 1, 'rule was a little off'], [seq[3] + 1, 'added 1 instead of using the rule'], [kind === 'double' ? seq[3] + seq[0] : seq[3] + 2 * step, 'skipped a step']],
        explain: `${ruleText}: ${[...seq, next].join(', ')}.` };
    }
    case 7: { // I'm thinking of a number
      // three numbers sit between the clues, so the odd/even clue always matters
      const t = rand(5, 30), lo = t - 2, hi = t + 2, odd = t % 2 === 1;
      const clues = `I'm thinking of a number. It is bigger than ${lo}. It is smaller than ${hi}. It is ${odd ? 'odd' : 'even'}.`;
      return { ...base, story: clues, speak: `${clues} What is my number?`, ask: 'Which number fits every clue?', ans: t,
        choices: shuffle([{ v: t, ok: true }, { v: t - 2, tag: 'missed the "bigger than" clue' }, { v: t + 2, tag: 'missed the "smaller than" clue' }, { v: t + (rng() < 0.5 ? 1 : -1), tag: 'missed the odd or even clue' }]),
        explain: `Between ${lo} and ${hi} are ${Array.from({ length: hi - lo - 1 }, (_, i) => lo + 1 + i).join(' and ')}. Only ${t} is ${odd ? 'odd' : 'even'}.` };
    }
    case 8: { // sorting circles
      const set = pick(VENN_SETS), x = rand(1, 5), y = rand(1, 4), z = rand(1, 5);
      const qs = [
        [`How many ${set.who} ${set.has(set.A)} and ${set.has(set.B).replace(/^have /, '')}?`, y, `The middle, where the circles overlap, has ${y}.`],
        [`How many ${set.who} ${set.has(set.A)} but no ${set.B}?`, x, `Only the left part, outside the overlap: ${x}.`],
        [`How many ${set.who} ${set.has(set.A)}?`, x + y, `The whole left circle: ${x} + ${y} = ${x + y}.`],
        [`How many ${set.who} are there in all?`, x + y + z, `${x} + ${y} + ${z} = ${x + y + z}.`],
      ];
      const [ask, ans, explain] = pick(qs);
      return { ...base, visual: vennSvg(cap(set.A), cap(set.B), x, y, z), ask, speak: `Each dot is one of the ${set.who}. ${ask}`, ans,
        distract: [[x, 'counted the wrong part'], [y, 'counted only the middle'], [z, 'counted the wrong circle'], [x + y + z, 'counted everything'], [x + z, 'left out the middle']], explain };
    }
    case 9: { // find the two numbers
      const b = rand(1, 12), d = rand(1, 8), a = b + d, S = a + b;
      const opts = [`${a} and ${b}`, `${a + 1} and ${b - 1}`, `${a + 1} and ${b + 1}`, `${S} and ${d}`, `${Math.ceil(S / 2)} and ${Math.floor(S / 2)}`];
      const wrong = [...new Set(opts.slice(1))].filter(o => o !== opts[0] && !o.includes('-') && !/ and 0$/.test(o)).slice(0, 3);
      return { ...base, story: `Two numbers add up to ${S}. One of them is ${d} more than the other. What are the two numbers?`, speak: `Two numbers add up to ${S}. One of them is ${d} more than the other. What are the two numbers?`,
        ask: 'Check both clues!', ans: opts[0], sayChoices: true,
        choices: [{ v: opts[0], ok: true }, ...wrong.map(v => ({ v, tag: 'checked only one clue' }))],
        explain: `${a} + ${b} = ${S}, and ${a} is ${d} more than ${b}. Both clues fit.` };
    }
    case 10: { // number pyramids
      const a = rand(1, 9), b = rand(1, 9), c = rand(1, 9), m1 = a + b, m2 = b + c, top = m1 + m2, kind = rand(0, 2);
      const rows = kind === 0 ? [['?'], [m1, m2], [a, b, c]] : kind === 1 ? [[top], ['?', m2], [a, b, c]] : [[top], [m1, m2], [a, '?', c]];
      const ans = kind === 0 ? top : kind === 1 ? m1 : b;
      return { ...base, visual: pyramidSvg(rows), ask: 'Each block is the two blocks under it added together. What goes in the ? block?', speak: 'Each block is the two blocks under it added together. What goes in the mystery block?', ans,
        distract: [[ans + 1, 'counting slip'], [ans - 1, 'counting slip'], [kind === 2 ? m1 + b : m1 * 2, 'added the wrong blocks'], [ans + 10, 'off by ten']],
        explain: kind === 0 ? `${m1} + ${m2} = ${top}` : kind === 1 ? `${a} + ${b} = ${m1} (and ${m1} + ${m2} = ${top})` : `${a} + ? = ${m1}, so ? = ${b}. Check: ${b} + ${c} = ${m2}.` };
    }
    default: { // shape puzzles (substitution)
      const sq = rand(2, 9);
      if (rng() < 0.5) {
        const extra = rng() < 0.5 ? 0 : rand(1, 9), circle = 2 * sq + extra;
        const line2 = extra ? `${SHAPES.circle} = ${SHAPES.square} + ${SHAPES.square} + ${extra}` : `${SHAPES.circle} = ${SHAPES.square} + ${SHAPES.square}`;
        return { ...base, q: `${SHAPES.square} = ${sq}<br>${line2}<br>${SHAPES.circle} = ?`, qClass: 'small', ask: 'Swap each shape for its number.',
          speak: `A square is ${sq}. A circle is a square plus a square${extra ? ` plus ${extra}` : ''}. What is a circle?`, ans: circle,
          distract: [[sq + extra, 'used only one square'], [circle + 1, 'counting slip'], [2 * sq, 'forgot the extra'], [sq * sq, 'multiplied instead']].filter(d => d[0] !== circle),
          explain: `${sq} + ${sq}${extra ? ` + ${extra}` : ''} = ${circle}` };
      }
      const ci = rand(2, 9), tri = sq + ci;
      return { ...base, q: `${SHAPES.square} = ${sq}<br>${SHAPES.circle} = ${ci}<br>${SHAPES.triangle} = ${SHAPES.square} + ${SHAPES.circle}<br>${SHAPES.triangle} + ${SHAPES.square} = ?`, qClass: 'small', ask: 'Find the triangle first.',
        speak: `A square is ${sq}. A circle is ${ci}. A triangle is a square plus a circle. What is a triangle plus a square?`, ans: tri + sq,
        distract: [[tri, 'stopped at the triangle'], [sq + ci, 'stopped at the triangle'], [tri + ci, 'added the circle instead'], [tri + sq + 1, 'counting slip']],
        explain: `Triangle = ${sq} + ${ci} = ${tri}. Then ${tri} + ${sq} = ${tri + sq}.` };
    }
  }
}
