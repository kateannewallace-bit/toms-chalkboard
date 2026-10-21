/* ---------- Thinking problems ----------
   Reasoning-first problems inspired by the Russian School of Mathematics approach (our own problems):
   bar models for parts and wholes, comparing, a balance scale for equations, letters for numbers,
   and "why does it work?" questions. Twelve levels; the numbers grow from 10 to 100 along the way.
   Runs only when a problem is made, so it can use rand/pick/shuffle/N/state from the other files. */

const THINK_THINGS = ['acorns', 'gold coins', 'dragon scales', 'silver arrows', 'cucumbers', 'saffron buns', 'scrolls', 'seashells', 'marbles', 'glowing mushrooms'];
const shortName = n => n.replace(/^the /i, '').split(/,| the /)[0].trim();
// for sentences: drop descriptions ("Kappa the friendly yokai" → "Kappa") but keep a leading "the" ("the Tommyknocker")
const sentName = n => (/^the /i.test(n) ? 'the ' : '') + shortName(n);
function thinkPeople() {
  const list = String(state.cast.friends || '').split(',').map(x => x.trim()).filter(Boolean);
  const f = shuffle(list.length >= 2 ? list : ['Fu Dog', 'Kappa the friendly yokai', 'Anansi']);
  return { me: N(), A: f[0], B: f[1], a: sentName(f[0]), b: sentName(f[1]), t: pick(THINK_THINGS) };
}

// One bar split into parts, with a bracket over the whole. parts: [{ v, show, q }]
function barSvg(parts, whole, w = 320) {
  const H = 92, x0 = 8, y = 46, h = 38, tot = parts.reduce((t, p) => t + p.v, 0);
  const drawn = parts.map(p => Math.max(p.v, tot * 0.14)), dTot = drawn.reduce((t, v) => t + v, 0);
  let x = x0, s = '';
  parts.forEach((p, i) => {
    const pw = (w - 2 * x0) * drawn[i] / dTot;
    s += `<rect x="${f1(x)}" y="${y}" width="${f1(pw)}" height="${h}" class="bm ${p.q ? 'q' : 'c' + (i % 3)}"/><text x="${f1(x + pw / 2)}" y="${y + h / 2 + 7}" text-anchor="middle" class="bm-t">${p.show}</text>`;
    x += pw;
  });
  s += `<path d="M${x0} ${y - 6}v-8h${w - 2 * x0}v8" class="bm-brace"/><text x="${w / 2}" y="${y - 20}" text-anchor="middle" class="bm-t ${whole.q ? 'qt' : ''}">${whole.show}</text>`;
  return `<svg class="bar-model" viewBox="0 0 ${w} ${H}" width="${Math.round(w * 1.3)}" role="img" aria-label="bar model">${s}</svg>`;
}
// Two bars, bigger on top. A row can be split ({ split, splitShow, restShow }); diff shades the gap; total adds a bracket.
function compareSvg(top, bottom, diff, total, w = 340) {
  // name column sized to the longer name (about 8.5px per letter at this font size)
  const longest = Math.max(String(top.name).length, String(bottom.name).length);
  w += Math.max(0, longest * 8.5 + 16 - 84);
  const x0 = Math.max(84, Math.round(longest * 8.5 + 16)), h = 34, y1 = 12, y2 = 58, room = total ? 58 : 10, scale = (w - x0 - room) / top.v;
  const bar = (x, y, v, show, cls) => `<rect x="${f1(x)}" y="${y}" width="${f1(v * scale)}" height="${h}" class="bm ${cls}"/><text x="${f1(x + v * scale / 2)}" y="${y + h / 2 + 7}" text-anchor="middle" class="bm-t">${show}</text>`;
  const row = (r, y, cls) => `<text x="${x0 - 8}" y="${y + h / 2 + 6}" text-anchor="end" class="bm-name">${esc(r.name)}</text>` +
    (r.split ? bar(x0, y, r.split, r.splitShow, 'q') + bar(x0 + r.split * scale, y, r.v - r.split, r.restShow, 'gap') : bar(x0, y, r.v, r.show, r.q ? 'q' : cls));
  let s = row(top, y1, 'c0') + row(bottom, y2, 'c1');
  if (diff) s += bar(x0 + bottom.v * scale, y2, top.v - bottom.v, diff.show, diff.q ? 'q gap' : 'gap');
  if (total) { const xr = x0 + top.v * scale + 8; s += `<path d="M${f1(xr)} ${y1}h8v${y2 + h - y1}h-8" class="bm-brace"/><text x="${f1(xr + 13)}" y="${(y1 + y2 + h) / 2 + 6}" class="bm-t ${total.q ? 'qt' : ''}">${total.show}</text>`; }
  return `<svg class="bar-model" viewBox="0 0 ${w} ${y2 + h + 8}" width="${Math.round(w * 1.3)}" role="img" aria-label="two bars compared">${s}</svg>`;
}
// A level pan balance. items: [{ show, q }], at most three a side.
function balanceSvg(left, right) {
  const W = 340, beamY = 40, plateY = 116;
  const side = (items, cx) => {
    const bw = 40, gap = 6, tw = items.length * bw + (items.length - 1) * gap;
    let x = cx - tw / 2, s = `<line x1="${cx}" y1="${beamY}" x2="${cx - 62}" y2="${plateY}" class="bal-string"/><line x1="${cx}" y1="${beamY}" x2="${cx + 62}" y2="${plateY}" class="bal-string"/>`;
    for (const it of items) { s += `<rect x="${x}" y="${plateY - 38}" width="${bw}" height="36" rx="6" class="wt ${it.q ? 'q' : ''}"/><text x="${x + bw / 2}" y="${plateY - 13}" text-anchor="middle" class="bm-t">${it.show}</text>`; x += bw + gap; }
    return s + `<path d="M${cx - 68} ${plateY}h136l-12 9h-112z" class="bal-pan"/>`;
  };
  const s = `<line x1="80" y1="${beamY}" x2="260" y2="${beamY}" class="bal-beam"/><path d="M170 ${beamY}l-18 ${plateY - beamY + 14}h36z" class="bal-stand"/><circle cx="170" cy="${beamY}" r="6" class="bal-pin"/>` + side(left, 80) + side(right, 260);
  return `<svg class="balance" viewBox="0 0 ${W} ${plateY + 16}" width="${Math.round(W * 1.3)}" role="img" aria-label="a balanced scale">${s}</svg>`;
}
const VAR = v => `<em class="var">${v}</em>`;

/* "Why does it work?" — the reasons are the choices */
function whyProblem() {
  const kinds = [
    () => { const a = rand(6, 9), b = rand(3, 9), k = 10 - a; return { q: `${a} + ${b} = 10 + ${b - k}`, ok: `I moved ${k} from the ${b} to the ${a} to make 10`, wrong: [`I added ${k} to both numbers`, `${a} and 10 are almost the same`, `I took ${k} away from both numbers`], explain: `${a} needs ${k} more to make 10, so take ${k} from the ${b}. The total stays the same.` }; },
    () => { const a = rand(3, 9), b = rand(3, 9); return { q: `${a} + ${b} = ${b} + ${a}`, ok: 'Adding in any order gives the same total', wrong: ['Both sides have the same first number', `${Math.max(a, b)} is the bigger number`, 'The bigger number always goes first'], explain: `${a} and ${b} make ${a + b} whichever comes first.` }; },
    () => { const a = rand(12, 19), b = rand(6, 9), k = 10 - b; return { q: `${a} − ${b} = ${a + k} − 10`, ok: `I added ${k} to both numbers, so the difference stays the same`, wrong: [`I moved ${k} from one number to the other`, `I added ${k} to just one number`, 'Taking away always gives 10'], explain: `If both numbers grow by ${k}, the gap between them doesn't change.` }; },
    () => { const a = rand(3, 9); return { q: `${a} + ${a + 1} = ${a} + ${a} + 1`, ok: `${a + 1} is one more than ${a}`, wrong: [`${a} is one more than ${a + 1}`, 'Doubles are always even', `I added 1 to both numbers`], explain: `${a} + ${a + 1} is the double ${a} + ${a}, plus 1 more.` }; },
    () => { const a = rand(2, 5), b = rand(3, 6); return { q: `${a} × ${b} = ${b} × ${a}`, ok: `${a} rows of ${b} has the same dots as ${b} rows of ${a}`, wrong: ['Multiplying makes numbers bigger', `${a} and ${b} add up to the same`, 'The first number is always the rows'], explain: `Turn the array sideways: ${a} rows of ${b} becomes ${b} rows of ${a}. Still ${a * b} dots.` }; },
    () => { const a = rand(2, 9) * 10 + rand(1, 8), b = 9; return { q: `${a} + 9 = ${a} + 10 − 1`, ok: 'Adding 9 is like adding 10 and taking 1 back', wrong: ['9 and 10 are the same', 'I took 1 away from both numbers', 'Adding 10 is always easier than 1'], explain: `${a} + 10 = ${a + 10}, then 1 back: ${a + 9}.` }; },
  ];
  const w = pick(kinds)();
  return {
    q: w.q, qClass: 'small', ask: 'Why is this true?', speak: `${spoken(w.q)}. Why is this true?`, ans: w.ok, wordy: true, sayChoices: true,
    choices: [{ v: w.ok, ok: true }, ...w.wrong.map(v => ({ v, tag: 'picked a reason that does not fit' }))],
    explain: w.explain,
  };
}

function genThinking(L) {
  const P = thinkPeople(), t = P.t, base = { skill: 'thinking' };
  const say = s => ({ story: s, speak: s });
  switch (L) {
    case 1: { // part + part = whole, to 10
      const a = rand(2, 7), b = rand(1, 10 - a);
      return { ...base, ...say(`${cap(P.A)} found ${a} ${t}, then ${b} more. How many ${t} is that in all?`), visual: barSvg([{ v: a, show: a }, { v: b, show: b }], { show: '?', q: true }), ask: 'The two parts make the whole.',
        ans: a + b, distract: [[Math.abs(a - b), 'took away instead of adding'], [a, 'gave just one part'], [a + b + 1, 'counting slip']], explain: `${a} + ${b} = ${a + b}. The parts make the whole.` };
    }
    case 2: { // missing part, to 20
      const W = rand(10, 20), a = rand(3, W - 2);
      return { ...base, ...say(`${cap(P.A)} and ${P.B} have ${W} ${t} together. ${cap(P.A)} has ${a}. How many does ${P.b} have?`), visual: barSvg([{ v: a, show: a }, { v: W - a, show: '?', q: true }], { show: W }), ask: 'Find the missing part.',
        ans: W - a, distract: [[W + a, 'added instead of finding the part'], [W, 'gave the whole'], [a, 'gave the other part']], explain: `Whole − part = the other part: ${W} − ${a} = ${W - a}.` };
    }
    case 3: { // which picture matches the story?
      const kind = pick(['join', 'part', 'compare']);
      let x, y, story;
      if (kind === 'join') { x = rand(3, 9); y = rand(2, 9); story = `${cap(P.A)} had ${x} ${t}, then found ${y} more. How many now?`; }
      else if (kind === 'part') { x = rand(10, 19); y = rand(2, x - 3); story = `${cap(P.A)} had ${x} ${t} and gave ${y} away. How many are left?`; }
      else { x = rand(9, 19); y = rand(3, x - 3); story = `${cap(P.A)} has ${x} ${t}. ${cap(P.B)} has ${y}. How many more does ${P.a} have?`; }
      const pics = {
        join: barSvg([{ v: x, show: x }, { v: y, show: y }], { show: '?', q: true }, 230),
        part: barSvg([{ v: y, show: y }, { v: Math.max(1, x - y), show: '?', q: true }], { show: x }, 230),
        compare: compareSvg({ name: P.a, v: Math.max(x, y + 1), show: Math.max(x, y + 1) }, { name: P.b, v: y, show: y }, { show: '?', q: true }, null, 240),
      };
      const names = { join: 'two parts make a whole', part: 'a part is missing from the whole', compare: 'two bars compared' };
      return { ...base, ...say(story), ask: 'Which picture matches the story?', ans: kind, pics: true, ansLabel: 'the picture with the green border',
        choices: Object.keys(pics).map(k => ({ v: k, ok: k === kind, html: pics[k], tag: `picked "${names[k]}"` })),
        explain: kind === 'join' ? `Two parts join into a whole: ${x} + ${y} = ${x + y}.` : kind === 'part' ? `The whole is ${x}. ${y} went away, so the missing part is ${x - y}.` : `Compare the two bars. The gap is ${x} − ${y} = ${x - y}.` };
    }
    case 4: { // comparing bars, to 50
      const a = rand(12, 50), b = rand(3, a - 3);
      if (rng() < 0.5) return { ...base, ...say(`${cap(P.A)} has ${a} ${t}. ${cap(P.B)} has ${b}. How many more does ${P.a} have?`),
        visual: compareSvg({ name: P.a, v: a, show: a }, { name: P.b, v: b, show: b }, { show: '?', q: true }), ask: 'How big is the gap?',
        ans: a - b, distract: [[a + b, 'added instead of comparing'], [a, 'gave just one bar'], [b, 'gave just one bar']], explain: `${a} − ${b} = ${a - b}.` };
      const d = a - b;
      return { ...base, ...say(`${cap(P.B)} has ${b} ${t}. ${cap(P.A)} has ${d} more. How many does ${P.a} have?`),
        visual: compareSvg({ name: P.a, v: a, show: '?', q: true }, { name: P.b, v: b, show: b }, { show: d }), ask: 'How long is the top bar?',
        ans: a, distract: [[Math.abs(b - d), 'took away instead of adding'], [d, 'gave just the difference'], [a + 10, 'off by ten']], explain: `${b} + ${d} = ${a}.` };
    }
    case 5: { // balance scale, one mystery box
      const a = rand(2, 9), x = rand(1, 9);
      if (rng() < 0.5) return { ...base, visual: balanceSvg([{ show: a }, { show: '?', q: true }], [{ show: a + x }]), ask: 'What goes in the ? box to keep the scale level?',
        speak: `The scale is level. One side has ${a} and a mystery box. The other side has ${a + x}. What is in the mystery box?`,
        ans: x, distract: [[2 * a + x, 'added both sides'], [a + x, 'copied the other side'], [x + 1, 'counting slip']], explain: `${a} + ${x} = ${a + x}, so both sides weigh the same.` };
      const b = rand(2, 9), c = rand(1, a + b - 1), y = a + b - c;
      return { ...base, visual: balanceSvg([{ show: a }, { show: b }], [{ show: c }, { show: '?', q: true }]), ask: 'What goes in the ? box to keep the scale level?',
        speak: `The scale is level. One side has ${a} and ${b}. The other side has ${c} and a mystery box. What is in the mystery box?`,
        ans: y, distract: [[a + b + c, 'added everything'], [a + b, 'forgot the other weight'], [y + 1, 'counting slip']], explain: `${a} + ${b} = ${a + b}, and ${c} + ${y} = ${a + b} too.` };
    }
    case 6: { // letters for numbers
      const n = rand(3, 12), k = rand(2, 9);
      const forms = [
        [`${VAR('a')} + ${k}`, `a plus ${k}`, n + k, [[n, 'gave a itself'], [n - k, 'took away instead']]],
        [`${VAR('a')} − ${Math.min(k, n - 1)}`, `a minus ${Math.min(k, n - 1)}`, n - Math.min(k, n - 1), [[n + Math.min(k, n - 1), 'added instead'], [n, 'gave a itself']]],
        [`${k} + ${VAR('a')}`, `${k} plus a`, n + k, [[n * k, 'multiplied instead'], [n, 'gave a itself']]],
        [`${VAR('a')} + ${VAR('a')}`, 'a plus a', 2 * n, [[n, 'gave a itself'], [n + 1, 'added 1 instead of a']]],
      ];
      const [expr, said, ans, d] = pick(forms);
      return { ...base, q: `If ${VAR('a')} = ${n}, then ${expr} = ?`, qClass: 'small', ask: 'Put the number in place of the letter.', speak: `If a equals ${n}, what is ${said}?`,
        ans, distract: [...d, [ans + 1, 'counting slip'], [ans - 1, 'counting slip']], explain: `a is ${n}, so ${expr.replace(/<[^>]+>/g, '').replace(/a/g, n)} = ${ans}.` };
    }
    case 7: return { ...base, ...whyProblem() };
    case 8: { // two-step bars: total and difference
      const s = rand(3, 15), d = rand(1, 8), T = 2 * s + d;
      return { ...base, ...say(`${cap(P.A)} and ${P.B} have ${T} ${t} together. ${cap(P.A)} has ${d} more than ${P.b}. How many does ${P.b} have?`),
        visual: compareSvg({ name: P.a, v: s + d, split: s, splitShow: '?', restShow: d }, { name: P.b, v: s, show: '?', q: true }, null, { show: T }), ask: 'Take away the extra, then split it in half.',
        ans: s, distract: [[T - d, 'forgot to split in half'], [s + d, 'found the bigger one'], [Math.round(T / 2), 'split before taking away the extra']],
        explain: `Take away the extra ${d}: ${T} − ${d} = ${T - d}. Two equal parts: ${T - d} ÷ 2 = ${s}. So ${P.b} has ${s} and ${P.a} has ${s + d}.` };
    }
    case 9: { // balance with two (equal) mystery boxes
      const x = rand(2, 9);
      if (rng() < 0.5) return { ...base, visual: balanceSvg([{ show: '?', q: true }, { show: '?', q: true }], [{ show: 2 * x }]), ask: 'Both boxes weigh the same. What is in each box?',
        speak: `The scale is level. Two mystery boxes that weigh the same are on one side, and ${2 * x} is on the other. What is in each box?`,
        ans: x, distract: [[2 * x, 'forgot there are two boxes'], [x + 2, 'counting slip'], [4 * x, 'doubled instead of halving']], explain: `${x} + ${x} = ${2 * x}.` };
      const a = rand(1, 9), c = 2 * x + a;
      return { ...base, visual: balanceSvg([{ show: '?', q: true }, { show: '?', q: true }, { show: a }], [{ show: c }]), ask: 'Both boxes weigh the same. What is in each box?',
        speak: `The scale is level. Two mystery boxes that weigh the same and a ${a} are on one side, and ${c} is on the other. What is in each box?`,
        ans: x, distract: [[c - a, 'forgot there are two boxes'], [Math.round(c / 2), 'forgot the other weight'], [x + 1, 'counting slip']], explain: `Take away the ${a}: ${c} − ${a} = ${c - a}. Two equal boxes: ${x} each.` };
    }
    case 10: { // equal-parts bars: multiply and share
      const k = rand(2, 6), n = rand(2, 9), W = k * n;
      if (rng() < 0.5) return { ...base, ...say(`${cap(P.A)} has ${k} bags with ${n} ${t} in each bag. How many altogether?`),
        visual: barSvg(Array.from({ length: k }, () => ({ v: 1, show: n })), { show: '?', q: true }), ask: 'Equal parts: what is the whole?',
        ans: W, distract: [[k + n, 'added instead of multiplied'], [n, 'gave one part'], [k * (n + 1), 'next fact over']], explain: `${k} equal parts of ${n}: ${k} × ${n} = ${W}.` };
      return { ...base, ...say(`${cap(P.A)} puts ${W} ${t} into ${k} bags, the same number in each. How many go in each bag?`),
        visual: barSvg(Array.from({ length: k }, () => ({ v: 1, show: '?', q: true })), { show: W }), ask: 'Equal parts: how big is each part?',
        ans: n, distract: [[W - k, 'took away instead of sharing'], [k, 'gave the number of parts'], [n + 1, 'counting slip']], explain: `${k} × ${n} = ${W}, so each part is ${n}.` };
    }
    case 11: { // two letters
      const a = rand(2, 9), b = rand(2, 9);
      if (rng() < 0.3) {
        const k = rand(3, 9);
        const sets = [
          [`${VAR('a')} + ${k}`, `a plus ${k}`, `${k} + a`, [`a − ${k}`, `${k} × a`, `a + a + ${k}`]],
          [`3 × ${VAR('a')}`, 'three times a', 'a + a + a', ['a + 3', 'a × a × a', '3 + a + a']],
          [`${VAR('a')} + ${VAR('b')}`, 'a plus b', 'b + a', ['a × b', 'a − b', 'a + a']],
        ];
        const [q, said, ok, wrong] = pick(sets);
        return { ...base, q, qClass: 'small', ask: 'Which one is always the same, whatever the letters are?', speak: `Which one is always the same as ${said}, whatever the numbers are?`, ans: ok, sayChoices: true,
          choices: [{ v: ok, ok: true }, ...wrong.map(v => ({ v, tag: 'picked an expression that is not always equal' }))], explain: `${ok} is always equal to ${q.replace(/<[^>]+>/g, '')}. Try it with any numbers!` };
      }
      const forms = [
        [`${VAR('a')} + ${VAR('b')}`, 'a plus b', a + b, [[a * b, 'multiplied instead']]],
        [`${VAR('a')} × ${VAR('b')}`, 'a times b', a * b, [[a + b, 'added instead']]],
        [`${VAR('a')} + ${VAR('a')} + ${VAR('b')}`, 'a plus a plus b', 2 * a + b, [[a + b, 'used a only once']]],
        [`2 × ${VAR('a')} + ${VAR('b')}`, 'two times a, plus b', 2 * a + b, [[2 * (a + b), 'doubled both letters']]],
      ];
      const [expr, said, ans, d] = pick(forms);
      return { ...base, q: `${VAR('a')} = ${a} and ${VAR('b')} = ${b}<br>${expr} = ?`, qClass: 'small', ask: 'Put the numbers in place of the letters.', speak: `a is ${a} and b is ${b}. What is ${said}?`,
        ans, distract: [...d, [ans + 1, 'counting slip'], [ans - 1, 'counting slip'], [ans + 10, 'off by ten']], explain: `${expr.replace(/<[^>]+>/g, '').replace(/a/g, a).replace(/b/g, b)} = ${ans}` };
    }
    default: { // three-part bars to 100
      const W = rand(40, 100), a = rand(8, Math.floor(W / 3)), b = rand(8, Math.floor(W / 3)), c = W - a - b;
      return { ...base, ...say(`${cap(P.A)}, ${P.B} and ${P.me} collected ${W} ${t} together. ${cap(P.a)} found ${a} and ${P.b} found ${b}. How many did ${P.me} find?`),
        visual: barSvg([{ v: a, show: a }, { v: b, show: b }, { v: c, show: '?', q: true }], { show: W }), ask: 'Find the missing part.',
        ans: c, distract: [[W - a, 'took away only one part'], [a + b, 'added the parts you know'], [W + a + b, 'added everything']], explain: `${a} + ${b} = ${a + b}, then ${W} − ${a + b} = ${c}.` };
    }
  }
}
