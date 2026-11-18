/* ---------- Fractions ----------
   Parts of a shape, then parts of a group (½ of 12), fractions on a number line, comparing,
   equal fractions, wholes, adding and taking away with the same bottom number, and stories.
   Every fraction is shown as a picture before it is only numbers. Uses helpers from app.js
   and divide.js at the time a problem is made. */

const frHtml = (n, d) => `<span class="frac"${typeof n === 'number' ? ` aria-label="${n} over ${d}"` : ''}><span>${n}</span><span>${d}</span></span>`;
const FR_NAMES = { 2: ['half', 'halves'], 3: ['third', 'thirds'], 4: ['fourth', 'fourths'], 5: ['fifth', 'fifths'], 6: ['sixth', 'sixths'], 7: ['seventh', 'sevenths'], 8: ['eighth', 'eighths'], 9: ['ninth', 'ninths'], 10: ['tenth', 'tenths'], 12: ['twelfth', 'twelfths'] };
const frWords = (n, d) => FR_NAMES[d] ? `${n === 1 ? 'one' : ONES_W[n] || n} ${n === 1 ? FR_NAMES[d][0] : FR_NAMES[d][1]}` : `${n} over ${d}`;
// a fraction choice: v is the plain key, html is the stacked fraction, say is the words
const frChoice = (n, d) => ({ html: frHtml(n, d), say: frWords(n, d) });
function frChoices(ok, wrongs) {
  const key = ([n, d]) => `${n}/${d}`, extra = {};
  for (const [n, d] of [ok, ...wrongs.map(w => w[0])]) extra[key([n, d])] = frChoice(n, d);
  return pickChoices(key(ok), wrongs.filter(([[n, d]]) => n >= 0 && d > 0).map(([f, tag]) => [key(f), tag]), extra);
}
const frSame = (a, b) => a[0] * b[1] === b[0] * a[1];

// a bar cut into d equal parts with the first k shaded
function fracBar(d, k, w = 300, label) {
  const h = 46, pw = w / d;
  let s = '';
  for (let i = 0; i < d; i++) s += `<rect x="${f1(2 + i * pw)}" y="2" width="${f1(pw)}" height="${h}" class="${i < k ? 'part-on' : 'part-off'}"/>`;
  s += `<rect x="2" y="2" width="${w}" height="${h}" class="part-edge"/>`;
  return `<svg class="frac-bar" viewBox="0 0 ${w + 4} ${h + 4}" width="${w + 4}" role="img" aria-label="${label || `a bar in ${d} equal parts, ${k} shaded`}">${s}</svg>`;
}
// a round pie cut into d slices with the first k shaded
function fracPie(d, k) {
  const c = 80, r = 66, pt = i => [f1(c + r * Math.sin(i * 2 * Math.PI / d)), f1(c - r * Math.cos(i * 2 * Math.PI / d))];
  let s = '';
  for (let i = 0; i < d; i++) { const [x1, y1] = pt(i), [x2, y2] = pt(i + 1); s += `<path d="M${c} ${c}L${x1} ${y1}A${r} ${r} 0 0 1 ${x2} ${y2}Z" class="${i < k ? 'part-on' : 'part-off'}"/>`; }
  for (let i = 0; i < d; i++) { const [x, y] = pt(i); s += `<line x1="${c}" y1="${c}" x2="${x}" y2="${y}" class="part-line"/>`; }
  s += `<circle cx="${c}" cy="${c}" r="${r}" class="part-edge"/>`;
  return `<svg class="shape" viewBox="0 0 160 160" width="170" role="img" aria-label="a circle in ${d} equal slices, ${k} shaded">${s}</svg>`;
}
const fracPic = (d, k) => d <= 8 && rng() < 0.5 ? fracPie(d, k) : fracBar(d, k);
// a number line from 0 to `wholes`, cut into d parts per whole, with an arrow at k parts
function fracLine(d, k, wholes = 1) {
  const W = 340, x0 = 20, len = W - 40, n = d * wholes, step = len / n;
  let s = `<line x1="${x0}" y1="40" x2="${x0 + len}" y2="40" class="nl-axis"/>`;
  for (let i = 0; i <= n; i++) {
    const x = f1(x0 + i * step), whole = i % d === 0;
    s += `<line x1="${x}" y1="${whole ? 28 : 32}" x2="${x}" y2="${whole ? 52 : 48}" class="nl-tick ${whole ? 'big' : ''}"/>`;
    if (whole) s += `<text x="${x}" y="74" text-anchor="middle" class="nl-num">${i / d}</text>`;
  }
  if (k != null) { const x = f1(x0 + k * step); s += `<path d="M${x} 24L${+x - 7} 10L${+x + 7} 10Z" class="nl-arrow"/>`; }
  return `<svg class="numline" viewBox="0 0 ${W} 84" width="${W}" role="img" aria-label="a number line from 0 to ${wholes}">${s}</svg>`;
}

const FR_DS = [2, 3, 4, 5, 6, 8];
function genFractions(L) {
  const base = { skill: 'fractions' };
  switch (L) {
    case 1: { // one part shaded
      const d = pick(FR_DS);
      return { ...base, visual: fracPic(d, 1), ask: 'What fraction is shaded?', speak: 'What fraction of the shape is shaded?', ans: `1/${d}`, ansLabel: `1/${d}`,
        choices: frChoices([1, d], [[[d, 1], 'flipped the top and bottom'], [[1, d + 1], 'miscounted the parts'], [[1, d - 1], 'counted the unshaded parts'], [[1, d * 2], 'miscounted the parts']].filter(([[n, dd]]) => dd > 1 && !(n === 1 && dd === d))),
        explain: `The whole is cut into ${d} equal parts and 1 is shaded: ${frWords(1, d)}. The bottom number counts the parts; the top counts the shaded ones.` };
    }
    case 2: { // several parts shaded
      const d = pick(FR_DS.filter(x => x > 2)), k = rand(2, d - 1);
      return { ...base, visual: fracPic(d, k), ask: 'What fraction is shaded?', speak: 'What fraction of the shape is shaded?', ans: `${k}/${d}`, ansLabel: `${k}/${d}`,
        choices: frChoices([k, d], [[[d, k], 'flipped the top and bottom'], [[d - k, d], 'counted the unshaded parts'], [[k, d - k], 'compared shaded to unshaded'], [[k, d + 1], 'miscounted the parts']].filter(([f]) => !frSame(f, [k, d]))),
        explain: `${d} equal parts, ${k} shaded: ${frWords(k, d)}.` };
    }
    case 3: case 4: { // a fraction of a group
      const d = pick([2, 3, 4, 5]), e = rand(2, 5), t = d * e, k = L === 3 ? 1 : rand(2, d - 1 || 1), [, many] = pick(DIV_THINGS);
      if (L === 4 && d === 2) return genFractions(4);
      const ans = k * e;
      return { ...base, q: `${frHtml(k, d)} of ${t}`, visual: groupsSvg(d, e, 0, 'plate', k), ask: `What is ${frWords(k, d)} of ${t} ${many}?`, speak: `What is ${frWords(k, d)} of ${t} ${many}? Share them into ${d} equal groups first.`, ans,
        distract: [[e, 'found only one part'], [t - ans, 'found the parts not taken'], [d, 'gave the bottom number'], [ans + 1, 'counting slip'], [ans - 1, 'counting slip'], [t, 'gave the whole group']],
        explain: `Share ${t} into ${d} equal groups: ${t} ÷ ${d} = ${e} in each.${k > 1 ? ` Take ${k} groups: ${k} × ${e} = ${ans}.` : ''} So ${frWords(k, d)} of ${t} is ${ans}.` };
    }
    case 5: { // number line
      const d = pick([2, 3, 4, 5, 6, 8]), wholes = rng() < 0.3 ? 2 : 1, k = rand(1, d * wholes - 1);
      if (k % d === 0) return genFractions(5);
      return { ...base, visual: fracLine(d, k, wholes), ask: 'What fraction is the arrow pointing to?', speak: `What fraction is the arrow pointing to? Count the jumps from zero.`, ans: `${k}/${d}`, ansLabel: `${k}/${d}`,
        choices: frChoices([k, d], [[[k, d + 1], 'counted the marks, not the jumps'], [[k + 1, d], 'counting slip'], [[k - 1, d], 'counting slip'], [[d, k], 'flipped the top and bottom']].filter(([f]) => f[0] > 0 && !frSame(f, [k, d]))),
        explain: `Each whole is cut into ${d} equal jumps. The arrow is ${pl(k, 'jump')} from zero: ${k}/${d}.` };
    }
    case 6: case 7: { // compare: same bottom, then same top
      let a, b;
      if (L === 6) { const d = pick([3, 4, 5, 6, 8]); let x, y; do { x = rand(1, d - 1); y = rand(1, d - 1); } while (x === y); a = [x, d]; b = [y, d]; }
      else { let x, y; do { x = pick(FR_DS); y = pick(FR_DS); } while (x === y); const n = rng() < 0.6 ? 1 : 2; if (n >= Math.min(x, y)) { a = [1, x]; b = [1, y]; } else { a = [n, x]; b = [n, y]; } }
      const va = a[0] / a[1], vb = b[0] / b[1], sym = va > vb ? '>' : '<';
      return { ...base, q: `${frHtml(...a)} ${BOX} ${frHtml(...b)}`, visual: `<div class="frac-pair">${fracBar(a[1], a[0], 260)}${fracBar(b[1], b[0], 260)}</div>`, ask: 'Which sign goes in the box?',
        speak: `Which sign goes between ${frWords(...a)} and ${frWords(...b)}? Greater than, less than, or equal?`, ans: sym,
        choices: [{ v: '>', ok: sym === '>', tag: L === 7 ? 'thought a bigger bottom number means a bigger fraction' : 'flipped the sign', say: 'greater than' }, { v: '<', ok: sym === '<', tag: L === 7 ? 'thought a bigger bottom number means a bigger fraction' : 'flipped the sign', say: 'less than' }, { v: '=', ok: false, tag: 'thought they were equal', say: 'equal' }],
        explain: L === 6 ? `Same size parts, so more parts is more: ${a[0]}/${a[1]} ${sym} ${b[0]}/${b[1]}.` : `Cutting into more parts makes each part smaller. ${a[1]} parts vs ${b[1]} parts: ${a[0]}/${a[1]} ${sym} ${b[0]}/${b[1]}.` };
    }
    case 8: { // equal fractions
      const d = pick([2, 3, 4, 5]), k = rand(1, d - 1), m = pick([2, 3, 4].filter(x => d * x <= 12)), D = d * m, ans = k * m;
      return { ...base, q: `${frHtml(k, d)} = ${frHtml(BOX, D)}`, visual: `<div class="frac-pair">${fracBar(d, k, 260)}${fracBar(D, ans, 260)}</div>`, ask: 'What number goes in the box?', speak: `${frWords(k, d)} is the same as how many ${FR_NAMES[D] ? FR_NAMES[D][1] : `parts out of ${D}`}?`, ans,
        distract: [[k, 'kept the top the same'], [k + (D - d), 'added instead of multiplying'], [ans + 1, 'counting slip'], [ans - 1, 'counting slip'], [D - ans, 'counted the unshaded parts']],
        explain: `Cut every part into ${m}: ${d} parts become ${D}, and ${k} shaded become ${ans}. ${k}/${d} = ${ans}/${D}.` };
    }
    case 9: { // wholes
      const d = pick([2, 3, 4, 5, 6]), w = rand(1, 4), n = d * w;
      return { ...base, q: `${frHtml(n, d)} = ${BOX}`, visual: Array.from({ length: w }, () => fracBar(d, d, 200)).join(''), ask: 'How many wholes?', speak: `${n} ${FR_NAMES[d][1]}. How many wholes is that?`, ans: w,
        distract: [[n, 'gave the top number'], [d, 'gave the bottom number'], [n - d || n + 1, 'took away instead'], [w + 1, 'counting slip'], [n + d, 'added the numbers']],
        explain: `${d} ${FR_NAMES[d][1]} make 1 whole. ${n} ÷ ${d} = ${w}, so ${n}/${d} = ${w}.` };
    }
    case 10: case 11: { // add and take away, same bottom
      const d = pick([4, 5, 6, 8, 10]), plus = L === 10;
      let a, b; do { a = rand(1, d - 1); b = rand(1, d - 1); } while (plus ? a + b > d : a <= b);
      const n = plus ? a + b : a - b, sign = plus ? '+' : '−';
      const wrong = plus ? [[[a + b, 2 * d], 'added the bottoms too'], [[a + b + 1, d], 'counting slip'], [[a * b, d], 'multiplied the tops'], [[a + b - 1, d], 'counting slip']]
        : [[[a - b, 0], 'took away the bottoms too'], [[a + b, d], 'added instead'], [[a - b + 1, d], 'counting slip'], [[a - b - 1, d], 'counting slip']];
      return { ...base, q: `${frHtml(a, d)} ${sign} ${frHtml(b, d)}`, visual: fracBar(d, a, 300), ask: plus ? 'Add the parts.' : 'Take away the parts.', speak: `${frWords(a, d)} ${plus ? 'plus' : 'minus'} ${frWords(b, d)}`, ans: `${n}/${d}`, ansLabel: `${n}/${d}`,
        choices: frChoices([n, d], wrong.filter(([f]) => f[1] > 0 && f[0] > 0 && !frSame(f, [n, d]))),
        explain: `The parts are all ${FR_NAMES[d][1]}, so only the tops change: ${a} ${sign} ${b} = ${n}. ${a}/${d} ${sign} ${b}/${d} = ${n}/${d}. The bottom stays ${d}.` };
    }
    default: { // stories
      const kind = rand(0, 2);
      if (kind === 0) {
        const d = pick([2, 3, 4]), e = rand(2, 6), t = d * e, k = d === 2 ? 1 : rand(1, d - 1), ans = k * e;
        return { ...base, sub: 'frac-of', story: `The dragon has ${t} gold coins. It gives ${frWords(k, d)} of them to the knight who freed it. How many coins does the knight get?`, ans,
          distract: [[e, 'found only one part'], [t - ans, 'found the coins the dragon kept'], [d, 'gave the bottom number'], [ans + 1, 'counting slip'], [t, 'gave all the coins']],
          explain: `${t} ÷ ${d} = ${e} in each ${FR_NAMES[d][0]}.${k > 1 ? ` ${k} × ${e} = ${ans}.` : ''} The knight gets ${ans}.` };
      }
      if (kind === 1) {
        const d = pick([4, 6, 8]); let a, b; do { a = rand(1, d - 1); b = rand(1, d - 1); } while (a + b >= d);
        const left = d - a - b;
        return { ...base, sub: 'frac-left', story: `The pixies baked a pie cut into ${d} equal slices. They ate ${a} slice${a > 1 ? 's' : ''} at lunch and ${b} at supper. What fraction of the pie is left?`, visual: fracPie(d, d), ans: `${left}/${d}`, ansLabel: `${left}/${d}`,
          choices: frChoices([left, d], [[[a + b, d], 'gave the part that was eaten'], [[left, a + b], 'compared what is left to what was eaten'], [[left + 1, d], 'counting slip'], [[left - 1, d], 'counting slip']].filter(([f]) => f[0] > 0 && !frSame(f, [left, d]))),
          explain: `${a} + ${b} = ${a + b} slices eaten. ${d} − ${a + b} = ${pl(left, 'slice')} left, out of ${d}: ${left}/${d}.` };
      }
      let x, y; do { x = pick([2, 3, 4, 5, 6, 8]); y = pick([2, 3, 4, 5, 6, 8]); } while (x === y);
      const big = x < y ? x : y, who = shuffle(['Hermes', 'Athena']);
      return { ...base, sub: 'frac-compare', story: `${who[0]} eats ${frWords(1, x)} of a honey cake. ${who[1]} eats ${frWords(1, y)} of the same size cake. Who eats more cake?`, ans: x < y ? who[0] : who[1],
        choices: [{ v: x < y ? who[0] : who[1], ok: true }, { v: x < y ? who[1] : who[0], tag: 'thought a bigger bottom number means more' }, { v: 'They eat the same', tag: 'thought they were equal' }],
        explain: `1/${big} is cut into fewer pieces, so each piece is bigger. 1/${x} ${x < y ? '>' : '<'} 1/${y}.` };
    }
  }
}
