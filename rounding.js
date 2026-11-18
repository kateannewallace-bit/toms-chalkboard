/* ---------- Rounding & estimation ----------
   Which ten is closer (number line), rounding to tens and hundreds, estimating sums and
   differences, "is that answer sensible?", and money estimates. Uses helpers from app.js
   and divide.js at the time a problem is made. */

const r100 = n => Math.floor((n + 50) / 100) * 100;
const roundTen = n => Math.floor((n + 5) / 10) * 10;

// a number line between two tens (or hundreds) with an arrow at n
function roundLine(lo, hi, n) {
  const W = 340, x0 = 24, len = W - 48, at = v => f1(x0 + (v - lo) / (hi - lo) * len);
  let s = `<line x1="${x0}" y1="44" x2="${x0 + len}" y2="44" class="nl-axis"/>`;
  for (let i = 0; i <= 10; i++) { const v = lo + i * (hi - lo) / 10, x = at(v), end = i === 0 || i === 10, mid = i === 5; s += `<line x1="${x}" y1="${end ? 30 : mid ? 34 : 38}" x2="${x}" y2="${end ? 58 : mid ? 54 : 50}" class="nl-tick ${end ? 'big' : ''}"/>`; if (end || mid) s += `<text x="${x}" y="80" text-anchor="middle" class="nl-num ${mid ? 'dim' : ''}">${v}</text>`; }
  const x = at(n);
  s += `<path d="M${x} 28L${+x - 7} 12L${+x + 7} 12Z" class="nl-arrow"/><text x="${x}" y="9" text-anchor="middle" class="nl-num hl">${n}</text>`;
  return `<svg class="numline" viewBox="0 -8 ${W} 96" width="${W}" role="img" aria-label="number line from ${lo} to ${hi} with ${n} marked">${s}</svg>`;
}

function genRounding(L) {
  const base = { skill: 'round' };
  switch (L) {
    case 1: {
      let n; do { n = rand(11, 99); } while (n % 5 === 0);
      const lo = n - n % 10, hi = lo + 10, ok = roundTen(n);
      return { ...base, visual: roundLine(lo, hi, n), ask: `Is ${n} closer to ${lo} or ${hi}?`, speak: `Is ${n} closer to ${lo} or to ${hi}?`, ans: ok,
        choices: [{ v: lo, ok: ok === lo, tag: 'picked the farther ten' }, { v: hi, ok: ok === hi, tag: 'picked the farther ten' }],
        explain: `${n} is ${Math.abs(n - ok)} away from ${ok} and ${10 - Math.abs(n - ok)} away from ${ok === lo ? hi : lo}. It is closer to ${ok}.` };
    }
    case 2: case 4: {
      let n; do { n = L === 2 ? rand(11, 99) : rand(101, 989); } while (n % 10 === 0);
      if (L === 2 && rng() < 0.3) n = n - n % 10 + 5;
      const ok = roundTen(n), other = ok === n - n % 10 ? ok + 10 : ok - 10;
      return { ...base, q: `${n}`, visual: L === 2 ? roundLine(n - n % 10, n - n % 10 + 10, n) : '', ask: 'Round to the nearest ten.', speak: `Round ${n} to the nearest ten.`, ans: ok,
        distract: [[other, 'rounded the wrong way'], [n, "didn't round"], ...(L === 4 ? [[r100(n), 'rounded to the hundred instead']] : []), [ok + 10, 'one ten too far'], [ok - 10, 'one ten too far']].filter(([v]) => v > 0),
        explain: n % 10 === 5 ? `${n} is exactly halfway, and halfway rounds up: ${ok}.` : `The ones digit is ${n % 10}. ${n % 10 < 5 ? 'Less than 5 rounds down' : '5 or more rounds up'}: ${ok}.` };
    }
    case 3: {
      let n; do { n = rand(110, 990); } while (n % 100 === 0 || n % 10 === 0 && rng() < 0.5);
      const ok = r100(n), lo = n - n % 100, other = ok === lo ? lo + 100 : lo;
      return { ...base, q: `${n}`, visual: roundLine(lo, lo + 100, n), ask: 'Round to the nearest hundred.', speak: `Round ${n} to the nearest hundred.`, ans: ok,
        distract: [[other, 'rounded the wrong way'], [roundTen(n), 'rounded to the ten instead'], [n, "didn't round"], [ok + 100, 'one hundred too far']].filter(([v]) => v > 0 && v !== ok),
        explain: `Look at the tens digit: ${Math.floor(n / 10) % 10}. ${Math.floor(n / 10) % 10 < 5 ? 'Less than 5 rounds down' : '5 or more rounds up'}: ${ok}.` };
    }
    case 5: case 6: {
      const plus = L === 5; let a, b; do { a = rand(12, 89); b = rand(11, plus ? 89 : a - 5); } while (a % 10 === 0 || b % 10 === 0 || a % 10 === 5 || b % 10 === 5 || (!plus && roundTen(a) <= roundTen(b)));
      const ra = roundTen(a), rb = roundTen(b), ans = plus ? ra + rb : ra - rb, exact = plus ? a + b : a - b, sign = plus ? '+' : '−';
      return { ...base, q: `${a} ${sign} ${b}`, ask: `Round each number to the nearest ten, then ${plus ? 'add' : 'take away'}. About how much?`, speak: `Estimate ${a} ${plus ? 'plus' : 'minus'} ${b}. Round each number to the nearest ten first.`, ans,
        distract: [[exact, 'gave the exact answer, not the estimate'], [ans + 10, 'rounded one number the wrong way'], [ans - 10, 'rounded one number the wrong way'], [plus ? ra - rb : ra + rb, plus ? 'took away instead' : 'added instead']].filter(([v]) => v >= 0 && v !== ans),
        explain: `${a} rounds to ${ra} and ${b} rounds to ${rb}. ${ra} ${sign} ${rb} = ${ans}. The exact answer, ${exact}, is close to it.` };
    }
    case 7: {
      const plus = rng() < 0.6; let a = rand(21, 89), b = rand(11, plus ? 89 : a - 10);
      const exact = plus ? a + b : a - b, kind = rand(0, 2), off = pick([30, 40, 50, 60]);
      const shown = kind === 1 ? exact : kind === 0 ? exact + off : exact - off >= 0 ? exact - off : exact + off;
      const verdict = shown === exact ? 'About right' : shown > exact ? 'Too big' : 'Too small', est = plus ? roundTen(a) + roundTen(b) : roundTen(a) - roundTen(b);
      return { ...base, sub: 'sensible', story: `${N()} worked out ${a} ${plus ? '+' : '−'} ${b} and got ${shown}. Is that sensible?`, ans: verdict,
        choices: ['Too big', 'About right', 'Too small'].map(v => ({ v, ok: v === verdict, tag: 'did not estimate first' })),
        explain: `Estimate: ${roundTen(a)} ${plus ? '+' : '−'} ${roundTen(b)} = ${est}. ${shown} is ${verdict === 'About right' ? 'close to that, so it makes sense' : verdict === 'Too big' ? 'much bigger than that' : 'much smaller than that'}. (Exactly: ${exact}.)` };
    }
    default: {
      const p = () => rand(1, 8) * 100 + pick([15, 25, 49, 75, 85, 89, 95, 99, 10, 35, 60]);
      let a, b; do { a = p(); b = p(); } while (a % 100 === 50 || b % 100 === 50);
      const ra = Math.round(a / 100), rb = Math.round(b / 100), ans = ra + rb;
      return { ...base, sub: 'money-est', q: `${cents(a)} + ${cents(b)}`, ask: 'About how many dollars? Round each price to the nearest dollar first.', speak: `About how many dollars is ${cents(a)} plus ${cents(b)}? Round each price to the nearest dollar first.`, ans, fmt: v => `$${v}`,
        distract: [[Math.floor(a / 100) + Math.floor(b / 100), 'dropped the cents'], [ans + 1, 'rounded one price the wrong way'], [ans - 1, 'rounded one price the wrong way'], [ans + 2, 'rounded both up']].filter(([v]) => v > 0 && v !== ans),
        explain: `${cents(a)} is about $${ra} and ${cents(b)} is about $${rb}. $${ra} + $${rb} = $${ans}.` };
    }
  }
}
