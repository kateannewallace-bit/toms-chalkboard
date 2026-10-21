/* ---------- Number bonds (Singapore approach) ----------
   Part-whole number bonds, make-10 and subtract-from-10 strategies, bonds with tens, breaking
   numbers apart by place value, bridging to the next ten, and Singapore's unit bar models.
   Concrete → pictorial → abstract: ten frames and bonds first, then the strategy in numbers.
   Uses helpers from app.js, stories.js and thinking.js at the time a problem is made. */

// whole on top, two parts below, joined by lines
function bondSvg(whole, a, b, w = 330) {
  const node = (x, y, v, top) => { const q = v === '?'; return `<circle cx="${x}" cy="${y}" r="${top ? 34 : 30}" class="bond ${q ? 'q' : top ? 'whole' : 'part'}"/><text x="${x}" y="${y + 8}" text-anchor="middle" class="bond-t ${q ? 'qt' : ''}">${v}</text>`; };
  const s = `<line x1="130" y1="62" x2="72" y2="118" class="bond-line"/><line x1="130" y1="62" x2="188" y2="118" class="bond-line"/>` + node(130, 40, whole, true) + node(68, 140, a) + node(192, 140, b);
  return `<svg class="bonds" viewBox="0 0 260 180" width="${w}" role="img" aria-label="number bond">${s}</svg>`;
}
const twoBonds = (l, r) => `<div class="bond-pair">${l}${r}</div>`;

// Singapore unit bars: one bar of m units, one bar of 1 unit, bracket for the total
function unitBarsSvg(nameA, m, nameB, total) {
  const x0 = Math.max(84, Math.round(Math.max(nameA.length, nameB.length) * 8.5 + 16)), u = 44, h = 34, y1 = 12, y2 = 58, W = x0 + 5 * u + 70;
  let s = `<text x="${x0 - 8}" y="${y1 + h / 2 + 6}" text-anchor="end" class="bm-name">${esc(nameA)}</text><text x="${x0 - 8}" y="${y2 + h / 2 + 6}" text-anchor="end" class="bm-name">${esc(nameB)}</text>`;
  for (let i = 0; i < m; i++) s += `<rect x="${x0 + i * u}" y="${y1}" width="${u}" height="${h}" class="bm c0"/>`;
  s += `<rect x="${x0}" y="${y2}" width="${u}" height="${h}" class="bm q"/><text x="${x0 + u / 2}" y="${y2 + h / 2 + 7}" text-anchor="middle" class="bm-t qt">?</text>`;
  const xr = x0 + m * u + 8;
  s += `<path d="M${xr} ${y1}h8v${y2 + h - y1}h-8" class="bm-brace"/><text x="${xr + 13}" y="${(y1 + y2 + h) / 2 + 6}" class="bm-t">${total}</text>`;
  return `<svg class="bar-model" viewBox="0 0 ${W} ${y2 + h + 8}" width="${Math.round(W * 1.3)}" role="img" aria-label="unit bars">${s}</svg>`;
}

function genBonds(L) {
  const base = { skill: 'bonds' };
  switch (L) {
    case 1: case 2: { // number bonds to 10, then to 20
      const W = L === 1 ? rand(5, 10) : rand(11, 20);
      const a = L === 2 && rng() < 0.5 ? 10 : rand(1, W - 1), b = W - a;
      if (rng() < 0.3) return { ...base, visual: bondSvg('?', a, b), ask: 'The two parts make the whole. What is the whole?', speak: `${a} and ${b} make what number?`, ans: W,
        distract: [[Math.abs(a - b), 'took away instead of adding'], [W + 1, 'counting slip'], [W - 1, 'counting slip']], explain: `${a} and ${b} make ${W}.` };
      return { ...base, visual: bondSvg(W, a, '?'), ask: `${a} and what make ${W}?`, speak: `${a} and what number make ${W}?`, ans: b,
        distract: [[W + a, 'added instead of finding the part'], [W, 'gave the whole'], [b + 1, 'counting slip'], [b - 1, 'counting slip']], explain: `${a} and ${b} make ${W}.` };
    }
    case 3: { // make 10 to add
      const a = rand(6, 9), k = 10 - a, r = rand(1, 9 - k), b = k + r;
      const vis = tenFrames(a, b, 'add') + bondSvg(b, k, r, 260);
      if (rng() < 0.5) return { ...base, q: `${a} + ${b} = 10 + ${BOX}`, qClass: 'small', visual: vis, ask: `Split ${b} into ${k} and ${r}. ${a} + ${k} makes 10.`,
        speak: `${a} plus ${b}. Give ${k} to the ${a} to make 10. What is left over?`, ans: r,
        distract: [[b, 'did not split the number'], [k, 'gave the part that made 10'], [a + b, 'gave the whole answer']], explain: `${a} + ${k} = 10, and ${r} is left. ${a} + ${b} = 10 + ${r} = ${a + b}.` };
      return { ...base, q: `${a} + ${b}`, visual: vis, ask: 'Make 10 first!', speak: `${a} plus ${b}. Make 10 first.`, ans: a + b,
        distract: [[a + b - 10, 'forgot the 10'], [a + b + 1, 'counting slip'], [a + b - 1, 'counting slip'], [10 + b, 'added 10 instead of making 10']], explain: `${a} + ${k} = 10, then 10 + ${r} = ${a + b}.` };
    }
    case 4: { // subtract from 10
      const r = rand(1, 8), b = rand(r + 1, 9), a = 10 + r;
      const vis = bondSvg(a, 10, r);
      if (rng() < 0.5) return { ...base, q: `${a} − ${b}`, visual: vis, ask: `First take ${b} from the 10. What is left of the 10?`, speak: `${a} minus ${b}. Split ${a} into 10 and ${r}. Take ${b} from the 10. What is left of the 10?`, ans: 10 - b,
        distract: [[a - b, 'gave the whole answer'], [b, 'gave the number taken away'], [10 - b + 1, 'counting slip']], explain: `10 − ${b} = ${10 - b}. Then add back the ${r}: ${10 - b} + ${r} = ${a - b}.` };
      return { ...base, q: `${a} − ${b}`, visual: vis, ask: `Take ${b} from the 10, then add the ${r}.`, speak: `${a} minus ${b}. Take ${b} from the 10, then add the ${r}.`, ans: a - b,
        distract: [[10 - b, 'forgot to add the ones back'], [b - r, 'took the small digit from the big one'], [a - b + 1, 'counting slip'], [a + b, 'added instead']], explain: `10 − ${b} = ${10 - b}, and ${10 - b} + ${r} = ${a - b}.` };
    }
    case 5: { // bonds with tens
      const W = rng() < 0.5 ? 100 : rand(3, 9) * 10, a = rand(1, W / 10 - 1) * 10, b = W - a;
      return { ...base, visual: bondSvg(W, a, '?'), ask: `${a} and what make ${W}?`, speak: `${a} and what number make ${W}?`, ans: b,
        distract: [[W + a, 'added instead of finding the part'], [b + 10, 'off by ten'], [b - 10, 'off by ten'], [b / 10, 'counted tens instead of the number']].filter(d => d[0] > 0),
        explain: `${a / 10} tens and ${b / 10} tens make ${W / 10} tens: ${a} + ${b} = ${W}.` };
    }
    case 6: { // break apart to add: tens with tens, ones with ones
      const a = rand(12, 69), b = rand(11, 29), at = a - a % 10, bt = b - b % 10, ao = a % 10, bo = b % 10;
      const vis = twoBonds(bondSvg(a, at, ao, 230), bondSvg(b, bt, bo, 230));
      const kind = rand(0, 2);
      if (kind === 0) return { ...base, q: `${a} + ${b}`, visual: vis, ask: 'Add the tens first. What do the tens make?', speak: `${a} plus ${b}. Add the tens: ${at} plus ${bt}. What do they make?`, ans: at + bt,
        distract: [[a + b, 'gave the whole answer'], [ao + bo, 'added the ones instead'], [at + bt + 10, 'off by ten']], explain: `${at} + ${bt} = ${at + bt}.` };
      if (kind === 1) return { ...base, q: `${a} + ${b}`, visual: vis, ask: 'Now add the ones. What do the ones make?', speak: `${a} plus ${b}. Add the ones: ${ao} plus ${bo}. What do they make?`, ans: ao + bo,
        distract: [[at + bt, 'added the tens instead'], [ao + bo + 1, 'counting slip'], [Math.abs(ao - bo), 'took away instead']], explain: `${ao} + ${bo} = ${ao + bo}.` };
      return { ...base, q: `${a} + ${b}`, visual: vis, ask: 'Tens plus tens, ones plus ones, then put them together.', speak: `${a} plus ${b}. Add the tens, add the ones, then put them together.`, ans: a + b,
        distract: [[at + bt + ao + bo - 10, 'forgot to carry'], [at + bt, 'forgot the ones'], [a + b + 10, 'off by ten']], explain: `${at} + ${bt} = ${at + bt}, ${ao} + ${bo} = ${ao + bo}, and ${at + bt} + ${ao + bo} = ${a + b}.` };
    }
    case 7: { // bridge to the next ten
      let a, b, k, r;
      do { a = rand(13, 87); k = 10 - a % 10; b = rand(3, 9); r = b - k; } while (a % 10 === 0 || r < 1);
      const next = a + k, vis = bondSvg(b, k, r, 260);
      if (rng() < 0.5) return { ...base, q: `${a} + ${b} = ${next} + ${BOX}`, qClass: 'small', visual: vis, ask: `Split ${b} into ${k} and ${r}. ${a} + ${k} makes ${next}.`,
        speak: `${a} plus ${b}. Give ${k} to the ${a} to make ${next}. What is left over?`, ans: r,
        distract: [[b, 'did not split the number'], [k, 'gave the part that made the ten'], [a + b, 'gave the whole answer']], explain: `${a} + ${k} = ${next}, then ${next} + ${r} = ${a + b}.` };
      return { ...base, q: `${a} + ${b}`, visual: vis, ask: 'Jump to the next ten first!', speak: `${a} plus ${b}. Jump to the next ten first.`, ans: a + b,
        distract: [[a + b - 10, 'forgot to carry'], [next, 'stopped at the next ten'], [a + b + 1, 'counting slip'], [a + b + 10, 'off by ten']], explain: `${a} + ${k} = ${next}, then ${next} + ${r} = ${a + b}.` };
    }
    default: { // Singapore unit bars: "m times as many"
      const P = thinkPeople(), m = rand(2, 4), u = rand(2, 9), T = (m + 1) * u, kind = rand(0, 2);
      const asks = [`How many does ${P.b} have?`, `How many does ${P.a} have?`, `How many more does ${P.a} have than ${P.b}?`];
      const ans = [u, m * u, (m - 1) * u][kind];
      return { ...base, story: `${cap(P.A)} has ${m} times as many ${P.t} as ${P.B}. Together they have ${T}. ${asks[kind]}`, speak: `${cap(P.A)} has ${m} times as many ${P.t} as ${P.B}. Together they have ${T}. ${asks[kind]}`,
        visual: unitBarsSvg(P.a, m, P.b, T), ask: `${m} units + 1 unit = ${m + 1} units. Find one unit first.`,
        ans, distract: [[u, 'gave one unit'], [m * u, 'found the bigger amount'], [T - m, 'took away instead of sharing'], [T, 'gave the total'], [(m - 1) * u, 'found the difference']].filter(d => d[0] !== ans),
        explain: `${m + 1} units make ${T}, so 1 unit is ${T} ÷ ${m + 1} = ${u}. ${cap(P.b)} has ${u}, ${P.a} has ${m} × ${u} = ${m * u}${kind === 2 ? `, and the difference is ${(m - 1) * u}` : ''}.` };
    }
  }
}
