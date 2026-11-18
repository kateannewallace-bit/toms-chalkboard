/* ---------- Roman numerals ----------
   I, V and X, then up to 39, L and C, writing numbers the Roman way, D and M with years,
   and Roman sums. A good contrast with place value: the Romans had no zero and no places.
   Uses helpers from app.js and divide.js at the time a problem is made. */

const ROMAN = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
const RV = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
function toRoman(n) { let s = ''; for (const [v, r] of ROMAN) while (n >= v) { s += r; n -= v; } return s; }
// the common slip: adding every letter, even the small one in front
const romanAddAll = s => [...s].reduce((t, c) => t + RV[c], 0);
const romanHtml = s => `<span class="roman">${s}</span>`;
const romanBreak = n => ROMAN.reduce((out, [v, r]) => { while (n >= v) { out.push(`${r} = ${v}`); n -= v; } return out; }, []).join(', ');

function readRoman(n, story) {
  const r = toRoman(n), add = romanAddAll(r);
  return { skill: 'roman', q: romanHtml(r), story, ask: story ? null : 'What number is this?', speak: story || `What number is this Roman numeral? ${[...r].join(' ')}`, ans: n,
    distract: [[add, 'added the small letter in front instead of taking it away'], [n + 1, 'counting slip'], [n - 1, 'counting slip'], [n + 10, 'miscounted the X’s'], [n + 5, 'read V as more']].filter(([v]) => v !== n && v > 0),
    explain: `${romanBreak(n)}. Together: ${n}.${add !== n ? ' A smaller letter in front of a bigger one is taken away.' : ''}` };
}
function genRoman(L) {
  switch (L) {
    case 1: return readRoman(rand(1, 10));
    case 2: case 3: {
      const n = L === 2 ? rand(11, 39) : rand(40, 100);
      if (rng() < 0.35) return readRoman(n, pick([
        `A Roman milestone says ${toRoman(n)} miles to the city. How many miles is that?`,
        `The legion's banner says ${toRoman(n)}. Which number legion is it?`,
        `Julius Caesar's scroll is chapter ${toRoman(n)}. What chapter number is that?`]));
      return readRoman(n);
    }
    case 4: {
      const n = rand(4, 49), ok = toRoman(n), alt = [n + 1, n - 1, n + 10, n - 10, n + 5, n - 5].filter(m => m > 0 && m !== n);
      // write a 4 or 9 the "added up" way (VI for 4, XI for 9), which is a different number
      const flipped = ok.replace('IV', 'VI').replace('IX', 'XI').replace('XL', 'LX');
      const wrong = [...(flipped !== ok ? [[flipped, 'put the small letter on the wrong side']] : []), ...shuffle(alt).map(m => [toRoman(m), 'counted wrong'])];
      return { skill: 'roman', q: `${n}`, ask: 'How do the Romans write this number?', speak: `How do the Romans write ${n}?`, ans: ok,
        choices: pickChoices(ok, wrong).map(c => ({ ...c, html: romanHtml(c.v), say: [...c.v].join(' ') })),
        explain: `${n}: ${romanBreak(n)}. So ${n} = ${ok}.` };
    }
    case 5: {
      const n = rng() < 0.6 ? rand(1066, 2030) : rand(500, 1500);
      return { ...readRoman(n, `A stone above the castle gate is carved with the year ${toRoman(n)}. What year is that?`), fmt: v => String(v) };
    }
    default: {
      const a = rand(3, 39), b = rand(3, 39), ans = a + b, ra = toRoman(a), rb = toRoman(b);
      return { skill: 'roman', q: `${romanHtml(ra)} + ${romanHtml(rb)}`, ask: 'Add them. Answer with an ordinary number.', speak: `${[...ra].join(' ')} plus ${[...rb].join(' ')}. What is the total?`, ans,
        distract: [[romanAddAll(ra) + romanAddAll(rb), 'added the small letter in front instead of taking it away'], [ans + 10, 'off by ten'], [ans - 10, 'off by ten'], [ans + 1, 'counting slip'], [ans - 1, 'counting slip']].filter(([v]) => v !== ans && v > 0),
        explain: `${ra} = ${a} and ${rb} = ${b}. ${a} + ${b} = ${ans}, which is ${toRoman(ans)}.` };
    }
  }
}
