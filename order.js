/* ---------- Order of operations (PEMDAS) ----------
   Parentheses, Exponents (squares), Multiply & Divide (left to right), Add & Subtract (left to right).
   Every problem is a real expression run through a small parser, so the answer, the step-by-step
   working and the "wrong order" traps all come from the same arithmetic.
   Uses helpers from app.js at the time a problem is made. */

const OP_TOKENS = /\d+|[()+−×÷²]/g;
const BIN = { '+': (a, b) => a + b, '−': (a, b) => a - b, '×': (a, b) => a * b, '÷': (a, b) => a / b };

// parse with the real rules: ( ) first, then ², then × ÷, then + −, each left to right
function orderParse(s) {
  const t = s.match(OP_TOKENS); let i = 0;
  const atom = () => {
    if (t[i] === '(') { i++; const e = expr(); i++; e.paren = true; return e; }
    return { n: +t[i++] };
  };
  const power = () => { let a = atom(); while (t[i] === '²') { i++; a = { op: '²', l: a }; } return a; };
  const term = () => { let a = power(); while (t[i] === '×' || t[i] === '÷') { const op = t[i++]; a = { op, l: a, r: power() }; } return a; };
  const expr = () => { let a = term(); while (t[i] === '+' || t[i] === '−') { const op = t[i++]; a = { op, l: a, r: term() }; } return a; };
  return expr();
}
const orderShow = n => {
  if (n.n != null) return String(n.n);
  const s = n.op === '²' ? `${orderShow(n.l)}²` : `${orderShow(n.l)} ${n.op} ${orderShow(n.r)}`;
  return n.paren ? `(${s})` : s;
};
const leaf = n => n && n.n != null;
// do the one step that comes first; returns the new tree and what was done
function orderStep(n) {
  if (leaf(n)) return null;
  if (leaf(n.l) && (n.op === '²' || leaf(n.r))) {
    const v = n.op === '²' ? n.l.n * n.l.n : BIN[n.op](n.l.n, n.r.n);
    return { node: { n: v }, did: { op: n.op, a: n.l.n, b: n.r && n.r.n, v, inParen: !!n.paren } };
  }
  const L = orderStep(n.l);
  if (L) return { node: { ...n, l: L.node }, did: L.did };
  const R = orderStep(n.r);
  return { node: { ...n, r: R.node }, did: R.did };
}
// every step as written, e.g. ["3 + 4 × 2", "3 + 8", "11"]; null if any step is negative or not whole
function orderSteps(s) {
  let n = orderParse(s); const lines = [orderShow(n)], dids = [];
  while (!leaf(n)) {
    const st = orderStep(n);
    if (!Number.isInteger(st.did.v) || st.did.v < 0) return null;
    // the step happened inside parentheses if the parenthesized group still had work in it
    n = st.node; dids.push(st.did); lines.push(orderShow(n));
  }
  return { lines, dids, ans: n.n };
}
const orderValue = s => { const r = orderSteps(s); return r ? r.ans : NaN; };

// the classic mistake: plow straight through left to right (parentheses kept, ² squares the running total)
function orderLeftToRight(s) {
  const t = s.match(OP_TOKENS); let i = 0;
  const run = () => {
    let v = null, op = null;
    while (i < t.length && t[i] !== ')') {
      const k = t[i++];
      if (k === '(') { const g = run(); i++; v = op ? BIN[op](v, g) : g; op = null; }
      else if (k === '²') v = v * v;
      else if (BIN[k] && v != null) op = k;
      else { v = op ? BIN[op](v, +k) : +k; op = null; }
    }
    return v;
  };
  return run();
}
// right to left (only used on expressions with no parentheses or squares)
function orderRightToLeft(s) {
  const t = s.match(OP_TOKENS);
  let v = +t[t.length - 1];
  for (let i = t.length - 2; i > 0; i -= 2) v = BIN[t[i]](+t[i - 1], v);
  return v;
}
const orderNoParens = s => orderValue(s.replace(/[()]/g, ''));
const orderDoubled = s => orderValue(s.replace(/²/g, ' × 2'));
const orderSay = s => spoken(String(s).replace(/\(/g, ' open parenthesis ').replace(/\)/g, ' close parenthesis ').replace(/²/g, ' squared ').replace(/÷/g, ' divided by ')).replace(/\s+/g, ' ').trim();

// the order ladder: only the rungs the child has met so far
function orderLadder(L) {
  const rungs = [];
  if (L >= 4) rungs.push({ t: '( )', s: 'inside first' });
  if (L >= 8) rungs.push({ t: 'x²', s: 'squares' });
  rungs.push({ t: '× ÷', s: L >= 6 ? 'left to right' : 'times, divide' });
  rungs.push({ t: '+ −', s: 'left to right' });
  const bw = 92, gap = 26, W = rungs.length * bw + (rungs.length - 1) * gap + 8, cls = ['c2', 'c3', 'c0', 'c1'].slice(4 - rungs.length);
  let s = '';
  rungs.forEach((r, i) => {
    const x = 4 + i * (bw + gap);
    s += `<rect x="${x}" y="4" width="${bw}" height="50" rx="10" class="ol-box ${cls[i]}"/><text x="${x + bw / 2}" y="38" text-anchor="middle" class="ol-t">${r.t}</text>`;
    s += `<text x="${x + bw / 2}" y="74" text-anchor="middle" class="ol-s">${r.s}</text>`;
    if (i < rungs.length - 1) s += `<path d="M${x + bw + 5} 29h${gap - 10}m-6 -6l6 6l-6 6" class="ol-arrow"/>`;
  });
  return `<svg class="order-ladder" viewBox="0 0 ${W} 82" width="${Math.min(W * 1.05, 520)}" role="img" aria-label="the order: ${rungs.map(r => r.t).join(', then ')}">${s}</svg>`;
}

function orderExplain(st, src) {
  const d = st.dids[0];
  // left to right is the reason only when nothing else outranks the step
  const why = /[()]/.test(src) && d.inParen ? 'Parentheses first.' : d.op === '²' ? 'Squares come before × ÷ + −.'
    : (d.op === '×' || d.op === '÷') && /[+−]/.test(src.replace(/\([^)]*\)/g, '')) ? '× and ÷ come before + and −.' : 'Go left to right.';
  return `${why}\n${st.lines.join('\n= ')}`;
}

// templates per level; each returns an expression string. Return the first one that is fair.
const R = (a, b) => rand(a, b);
const ORDER_TPL = {
  1: [ // + and − only: left to right
    () => { const a = R(10, 20), b = R(2, a - 3), c = R(1, a - b - 1); return `${a} − ${b} + ${c}`; },
    () => { const a = R(12, 20), b = R(2, 9), c = R(1, b - 1); return `${a} − ${b} − ${c}`; },
    () => { const a = R(3, 9), b = R(2, 9), c = R(2, 8), d = R(1, 6); return `${a} + ${b} − ${c} + ${d}`; },
  ],
  2: [ // times before plus
    () => `${R(1, 9)} + ${R(2, 6)} × ${R(2, 5)}`,
    () => `${R(2, 6)} × ${R(2, 5)} + ${R(1, 9)}`,
    () => `${R(1, 9)} + ${R(2, 9)} × ${R(2, 9)}`,
  ],
  3: [ // × and ÷ before −
    () => { const b = R(2, 5), c = R(2, 5); return `${b * c + R(1, 15)} − ${b} × ${c}`; },
    () => { const c = R(2, 5), q = R(2, 5); return `${R(c * q, 25)} − ${c * q} ÷ ${c}`; },
    () => { const c = R(2, 5), q = R(2, 6); return `${c * q} ÷ ${c} + ${R(1, 9)}`; },
    () => { const c = R(2, 5), q = R(2, 6); return `${R(1, 9)} + ${c * q} ÷ ${c}`; },
  ],
  4: [ // parentheses first
    () => `(${R(1, 6)} + ${R(1, 4)}) × ${R(2, 5)}`,
    () => `${R(2, 5)} × (${R(1, 5)} + ${R(1, 5)})`,
    () => { const a = R(5, 12); return `(${a} − ${R(1, a - 2)}) × ${R(2, 4)}`; },
    () => { const b = R(4, 9); return `${R(b + 2, 20)} − (${b} − ${R(1, b - 1)})`; },
    () => { const c = R(2, 5), s = c * R(2, 4), a = R(1, s - 1); return `(${a} + ${s - a}) ÷ ${c}`; },
  ],
  5: [ // which part first (choices are sub-expressions)
    () => `${R(1, 9)} + ${R(2, 5)} × ${R(2, 5)} − ${R(1, 5)}`,
    () => `${R(10, 20)} − ${R(1, 5)} + ${R(2, 4)} × ${R(2, 4)}`,
    () => `(${R(1, 6)} + ${R(1, 6)}) × ${R(2, 4)} − ${R(1, 6)}`,
    () => `${R(2, 5)} × (${R(1, 5)} + ${R(1, 5)}) + ${R(1, 9)}`,
    () => { const c = R(2, 4), q = R(2, 5); return `${R(1, 9)} + ${c * q} ÷ ${c} + ${R(1, 9)}`; },
  ],
  6: [ // × and ÷ left to right (the wrong way, right to left, gives a different answer)
    () => { const b = R(2, 5), q = R(2, 6); return `${b * q} ÷ ${b} × ${R(2, 5)}`; },
    () => { const b = R(2, 3), c = R(2, 3), q = R(2, 5); return `${b * c * q} ÷ ${b} ÷ ${c}`; },
    () => { const b = R(2, 4), c = R(2, 4), q = R(1, 4); return `${b * c * q} ÷ ${b * c} × ${R(2, 4)}`; },
    () => { const b = R(2, 4), q = R(2, 5); return `${R(1, 9)} + ${b * q} ÷ ${b} × ${R(2, 4)}`; },
    () => { const b = R(2, 5), q = R(2, 5); return `${b * q} ÷ ${b} × ${R(2, 4)} − ${R(1, 5)}`; },
  ],
  7: [ // three steps
    () => `${R(2, 5)} × ${R(2, 5)} + ${R(2, 5)} × ${R(2, 5)}`,
    () => `${R(1, 9)} + ${R(2, 6)} × ${R(2, 5)} − ${R(1, 9)}`,
    () => { const c = R(2, 4), q = R(2, 5), a = R(3, 6), b = R(3, 6); return `${a} × ${b} − ${c * q} ÷ ${c}`; },
    () => `(${R(1, 6)} + ${R(1, 6)}) × ${R(2, 4)} − ${R(1, 9)}`,
    () => `${R(20, 40)} − ${R(2, 4)} × (${R(1, 4)} + ${R(1, 4)})`,
  ],
  8: [ // squares come early
    () => `${R(1, 9)} + ${R(2, 6)}²`,
    () => `${R(2, 4)} × ${R(2, 5)}²`,
    () => `(${R(1, 4)} + ${R(1, 4)})²`,
    () => { const b = R(2, 6); return `${b}² − ${R(1, 3)} × ${R(2, 4)}`; },
    () => `${R(2, 5)}² + ${R(2, 5)}²`,
  ],
  9: [ // where do the parentheses go? (plain expression; the parentheses are chosen)
    () => `${R(1, 6)} + ${R(2, 5)} × ${R(2, 5)}`,
    () => `${R(2, 5)} × ${R(1, 5)} + ${R(1, 5)}`,
    () => `${R(10, 20)} − ${R(2, 5)} + ${R(1, 5)}`,
    () => `${R(2, 4)} × ${R(1, 4)} + ${R(1, 4)} × ${R(2, 4)}`,
    () => `${R(10, 20)} − ${R(1, 4)} × ${R(1, 3)} + ${R(1, 4)}`,
  ],
  10: [ // letters, written the way the app's letter problems write them (× always shown)
    () => `${R(2, 5)} × a + ${R(1, 9)}`,
    () => `${R(1, 9)} + ${R(2, 5)} × a`,
    () => `${R(20, 40)} − ${R(2, 4)} × a`,
    () => `${R(2, 4)} × (a + ${R(1, 5)})`,
    () => `2 × a + b`,
    () => `a + ${R(2, 4)} × b`,
    () => `a × b − ${R(1, 6)}`,
  ],
};

// every way to wrap one group of 2 or 3 numbers in parentheses (that leaves something outside)
function placements(s) {
  const t = s.match(OP_TOKENS), nums = (t.length + 1) / 2, out = [];
  for (let i = 0; i < nums; i++) for (let j = i + 1; j < nums; j++) {
    if (i === 0 && j === nums - 1) continue;
    out.push(t.map((k, x) => (x === 2 * i ? '(' + k : x === 2 * j ? k + ')' : k)).join(' '));
  }
  return out;
}

function genOrder(L) {
  const base = { skill: 'order' };
  const tpls = ORDER_TPL[L];
  if (L >= 10) return orderLetters(L);
  for (let tries = 0; tries < 300; tries++) {
    const k = rand(0, tpls.length - 1), src = tpls[k](), st = orderSteps(src);
    if (!st || st.ans > 150) continue;
    const sub = `t${k}`, ladder = L >= 2 ? orderLadder(L) : '';

    if (L === 5) { // which part do you do first?
      const t = src.match(OP_TOKENS).filter(x => x !== '(' && x !== ')');
      const pairs = [];
      for (let i = 0; i + 2 < t.length; i += 2) pairs.push(`${t[i]} ${t[i + 1]} ${t[i + 2]}`);
      // a part is a fair "first" only if doing it first still gives the right answer
      const fair = pairs.filter(p => {
        const once = src.replace(p, String(BIN[p.split(' ')[1]](+p.split(' ')[0], +p.split(' ')[2])));
        return once !== src && orderValue(once.replace(/\((\d+)\)/g, '$1')) === st.ans;
      });
      if (fair.length !== 1 || pairs.length < 3) continue;
      const ok = fair[0];
      return { ...base, sub, q: src, qClass: 'small', visual: ladder, ask: 'Which part do you do first?', speak: `${orderSay(src)}. Which part do you do first?`, sayChoices: true,
        ans: ok, choices: pairs.map(p => ({ v: p, ok: p === ok, tag: 'did the wrong part first', say: orderSay(p) })),
        explain: `${orderExplain(st, src)}` };
    }

    if (L === 9) { // put in the parentheses to make the target
      const opts = placements(src).map(p => ({ p, v: orderValue(p) }));
      const goodish = opts.filter(o => Number.isInteger(o.v) && o.v >= 0 && o.v !== st.ans);
      if (!goodish.length) continue;
      const target = pick(goodish), same = opts.filter(o => o.v === target.v);
      if (same.length !== 1) continue;
      const wrong = shuffle(opts.filter(o => o.v !== target.v && o.p !== target.p)).slice(0, 3);
      if (wrong.length < 2) continue;
      const tst = orderSteps(target.p);
      return { ...base, sub, q: `${src} = ${target.v}`, qClass: 'small', visual: ladder, ask: `Where do the parentheses go to make ${target.v}?`,
        speak: `${orderSay(src)}. Where do the parentheses go to make ${target.v}?`, sayChoices: true, wordy: true,
        ans: target.p, choices: [{ v: target.p, ok: true, say: orderSay(target.p) }, ...wrong.map(o => ({ v: o.p, tag: 'put the parentheses in the wrong place', say: orderSay(o.p) }))],
        explain: `Without parentheses it is ${st.ans}.\n${tst.lines.join('\n= ')}` };
    }

    // the wrong ways to do it, which become the wrong choices
    const traps = [[orderLeftToRight(src), 'went left to right instead of following the order']];
    if (/[()]/.test(src)) traps.push([orderNoParens(src), 'skipped the parentheses']);
    if (/²/.test(src)) traps.push([orderDoubled(src), 'doubled instead of squaring']);
    if (!/[()²]/.test(src)) traps.push([orderRightToLeft(src), 'went right to left']);
    const real = traps.filter(([v]) => Number.isInteger(v) && v >= 0 && v !== st.ans);
    // each level is about a trap: make sure the order really matters here
    if (L !== 8 && L !== 10 && !real.length) continue;
    if ((L === 1 || L === 6) && !Number.isInteger(orderRightToLeft(src)) && !real.length) continue;
    const asks = { 1: 'Go left to right, one step at a time.', 2: 'Times comes before plus!', 3: '× and ÷ come before + and −.', 4: 'Do the parentheses first.', 6: '× and ÷ are a team: go left to right.', 7: 'One step at a time.', 8: 'Squares come before × ÷ + −.', 10: 'One step at a time.' };
    return { ...base, sub, q: src, qClass: src.length > 14 ? 'small' : '', visual: ladder, ask: asks[L], speak: `${orderSay(src)}. ${asks[L] ? orderSay(asks[L]) : ''}`.trim(),
      ans: st.ans, distract: [...real, [st.dids[0].v, 'stopped after one step'], [st.ans + 1, 'counting slip'], [st.ans - 1, 'counting slip']].filter(d => Number.isInteger(d[0]) && d[0] !== st.ans),
      explain: orderExplain(st, src) };
  }
  return { ...base, q: '3 + 4 × 2', visual: orderLadder(Math.max(L, 2)), ask: 'Times comes before plus!', speak: '3 plus 4 times 2. Times comes before plus!', ans: 11,
    distract: [[14, 'went left to right instead of following the order'], [12, 'counting slip'], [10, 'counting slip']], explain: '× and ÷ come before + and −.\n3 + 4 × 2\n= 3 + 8\n= 11' };
}

/* ---------- the bridge to the app's letter and mystery-box problems ----------
   Level 10: put numbers in for letters, then follow the order (like Thinking problems: 2 × a + b).
   Level 11: undo a two-step mystery box in reverse order, one step at a time (like Mystery number: 2 × ☐ + 1 = 9).
   Level 12: the same with letters, including parentheses (like Mystery number: n + 7 = 15, but two steps). */
const showLetters = s => s.replace(/\b([abn])\b/g, (m, v) => VAR(v));
function orderLetters(L) {
  const base = { skill: 'order' };
  if (L === 10) {
    for (let tries = 0; tries < 300; tries++) {
      const k = rand(0, ORDER_TPL[10].length - 1), src = ORDER_TPL[10][k](), a = rand(2, 9), b = rand(2, 9);
      const two = /b/.test(src), num = src.replace(/\ba\b/g, a).replace(/\bb\b/g, b), st = orderSteps(num);
      if (!st || st.ans > 120) continue;
      const traps = [[orderLeftToRight(num), 'went left to right instead of following the order']];
      if (/[()]/.test(num)) traps.push([orderNoParens(num), 'skipped the parentheses']);
      const real = traps.filter(([v]) => Number.isInteger(v) && v >= 0 && v !== st.ans);
      if (!real.length && !two) continue;
      const given = two ? `${VAR('a')} = ${a} and ${VAR('b')} = ${b}` : `If ${VAR('a')} = ${a}`;
      return { ...base, sub: `t${k}`, q: `${given}<br>${showLetters(src)} = ?`, qClass: 'small', visual: orderLadder(9),
        ask: 'Put the numbers in place of the letters. Then follow the order.',
        speak: `${two ? `a is ${a} and b is ${b}` : `If a equals ${a}`}. What is ${orderSay(src)}? Put the numbers in, then follow the order.`,
        ans: st.ans, distract: [...real, [st.ans + 1, 'counting slip'], [st.ans - 1, 'counting slip'], [st.ans + 10, 'off by ten']].filter(d => d[0] !== st.ans),
        explain: `${src} becomes ${num}.\n${orderExplain(st, num)}` };
    }
  }
  // two-step mystery: m × x + k = t, m × x − k = t, or m × (x + k) = t
  const m = rand(2, 5), x = rand(2, 9), shape = rand(0, L === 12 ? 2 : 1), k = shape === 1 ? rand(1, Math.min(12, m * x - 1)) : rand(1, 9);
  const t = shape === 0 ? m * x + k : shape === 1 ? m * x - k : m * (x + k);
  const hole = L === 11 ? BOX : VAR('n'), holeSay = L === 11 ? 'what number' : 'n';
  const lhs = shape === 0 ? `${m} × ${hole} + ${k}` : shape === 1 ? `${m} × ${hole} − ${k}` : `${m} × (${hole} + ${k})`;
  const plain = shape === 0 ? `${m} × n + ${k}` : shape === 1 ? `${m} × n − ${k}` : `${m} × (n + ${k})`;
  const said = `${orderSay(plain).replace(/\bn\b/, holeSay)} equals ${t}`;
  const check = shape === 2 ? `${m} × (${x} + ${k}) = ${m} × ${x + k} = ${t}` : `${m} × ${x} ${shape ? '−' : '+'} ${k} = ${m * x} ${shape ? '−' : '+'} ${k} = ${t}`;
  const undo = shape === 0 ? `Undo the + ${k} first: ${t} − ${k} = ${m * x}. Then undo the × ${m}: ${m * x} ÷ ${m} = ${x}.`
    : shape === 1 ? `Undo the − ${k} first: ${t} + ${k} = ${m * x}. Then undo the × ${m}: ${m * x} ÷ ${m} = ${x}.`
    : `Undo the × ${m} first: ${t} ÷ ${m} = ${x + k}. Then undo the + ${k}: ${x + k} − ${k} = ${x}.`;
  const first = shape === 2 ? x + k : m * x;
  // level 11 half the time asks only for the first undo step, so the method is built one piece at a time
  if (L === 11 && rng() < 0.5) {
    return { ...base, sub: `half${shape}`, q: `${lhs} = ${t}`, qClass: 'small', visual: undoSvg(shape, m, k, t),
      ask: `Undo the last step first. What does ${shape === 2 ? `☐ + ${k}` : `${m} × ☐`} make?`,
      speak: `${said}. Undo the last step first. What is ${shape === 2 ? `the mystery number plus ${k}` : `${m} times the mystery number`}?`,
      ans: first, distract: [[shape === 2 ? t - k : t + (shape ? -k : k), 'undid it the wrong way'], [x, 'jumped to the end'], [t, 'copied the total'], [first + 1, 'counting slip']].filter(d => d[0] !== first && d[0] >= 0),
      explain: `${undo.split('.')[0]}. So ${shape === 2 ? `☐ + ${k}` : `${m} × ☐`} = ${first}.` };
  }
  // undoing in the wrong order: for m × x + k, divide first then take away; for m × (x + k), take away first then divide
  const wrongOrder = shape === 2 ? (t - k) / m : t / m - (shape ? -k : k);
  return { ...base, sub: `full${shape}`, q: `${lhs} = ${t}`, qClass: 'small', visual: undoSvg(shape, m, k, t),
    ask: L === 11 ? 'Undo the steps in reverse order.' : 'What number is n? Undo the steps in reverse order.',
    speak: `${said}. ${L === 11 ? 'What is the mystery number?' : 'What number is n?'} Undo the steps in reverse order.`,
    ans: x, distract: [[first, 'stopped after one step'], [Number.isInteger(wrongOrder) ? wrongOrder : -1, 'undid the steps in the wrong order'], [shape === 2 ? t - k : t - (shape ? -k : k), 'stopped after one step'], [x + 1, 'counting slip'], [x - 1, 'counting slip']].filter(d => d[0] !== x && d[0] >= 0),
    explain: `${undo}\nCheck: ${check}.` };
}
// a little "do it / undo it" chain: forward steps on top, the undo steps underneath in reverse
function undoSvg(shape, m, k, t) {
  const steps = shape === 2 ? [`+ ${k}`, `× ${m}`] : [`× ${m}`, `${shape ? '−' : '+'} ${k}`];
  const undo = steps.map(s => s[0] === '+' ? `− ${s.slice(2)}` : s[0] === '−' ? `+ ${s.slice(2)}` : `÷ ${s.slice(2)}`);
  const node = (x, label, cls) => `<circle cx="${x}" cy="40" r="20" class="ud-node ${cls}"/><text x="${x}" y="47" text-anchor="middle" class="ud-n">${label}</text>`;
  const arrow = (x1, x2, y, label) => `<path d="M${x1} ${y}H${x2}M${x2 - 7} ${y - 6}L${x2} ${y}L${x2 - 7} ${y + 6}" class="ud-arrow fwd"/><text x="${(x1 + x2) / 2}" y="${y - 10}" text-anchor="middle" class="ud-l fwd">${label}</text>`;
  let s = node(30, '?', 'q') + node(170, '', 'mid') + node(310, t, 'end');
  s += arrow(52, 148, 28, steps[0]) + arrow(192, 288, 28, steps[1]);
  s += `<path d="M288 54H192" class="ud-arrow back"/><path d="M199 48L192 54L199 60" class="ud-arrow back"/><text x="240" y="80" text-anchor="middle" class="ud-l back">first ${undo[1]}</text>`;
  s += `<path d="M148 54H52" class="ud-arrow back"/><path d="M59 48L52 54L59 60" class="ud-arrow back"/><text x="100" y="80" text-anchor="middle" class="ud-l back">then ${undo[0]}</text>`;
  return `<svg class="undo-chain" viewBox="0 0 340 90" width="380" role="img" aria-label="do the steps forward, undo them backward">${s}</svg>`;
}

/* Minus flip: a little button above each minus sign turns "5 − 7" into "5 + −7" (adding a negative)
   and back again. It only changes how the problem is written, never the answer. */
function flipHtml(p) {
  let i = 0;
  return p.q.replace(/− ?/g, () => {
    const k = i++, on = (p.flips || []).includes(k);
    return `<span class="flip-wrap"><button class="flip-btn" data-act="flip" data-i="${k}" aria-pressed="${on}" aria-label="${on ? 'Change back to minus' : 'Change to plus a negative'}">${on ? '↩' : '+ −'}</button>${on ? '+ <span class="neg">−</span></span>' : '−</span> '}`;
  });
}
function toggleFlip(p, k) { const f = p.flips || []; p.flips = f.includes(k) ? f.filter(x => x !== k) : [...f, k]; }
