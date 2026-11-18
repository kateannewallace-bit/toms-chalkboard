/* ---------- Factors & primes ----------
   Multiples, factor pairs as arrays, which numbers divide in, all the factors, primes,
   common multiples and factors, prime factor trees, and prime factors written with powers
   (which links to Exponents and to simplifying roots). Uses helpers from app.js, divide.js
   and powers.js at the time a problem is made. */

const factorsOf = n => { const f = []; for (let i = 1; i <= n; i++) if (n % i === 0) f.push(i); return f; };
const isPrime = n => n > 1 && factorsOf(n).length === 2;
const gcd = (a, b) => b ? gcd(b, a % b) : a;
const lcm = (a, b) => a / gcd(a, b) * b;
function primeFactors(n) { const out = []; for (let p = 2; n > 1; p++) while (n % p === 0) { out.push(p); n /= p; } return out; }
const PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
const ODD_COMPOSITES = [9, 15, 21, 25, 27, 33, 35, 39, 45, 49, 51, 55, 57];

function genFactors(L) {
  const base = { skill: 'factors' };
  switch (L) {
    case 1: { // multiples
      const k = pick([3, 4, 6, 7, 8, 9]);
      if (rng() < 0.5) {
        const j = rand(1, 5), seq = [j, j + 1, j + 2].map(x => x * k), ans = (j + 3) * k;
        return { ...base, q: `${seq.join(', ')}, ${BOX}`, ask: `Count by ${k}s. What comes next?`, speak: `${seq.join(', ')}. Counting by ${k}s, what comes next?`, ans,
          distract: [[ans + 1, `added 1, not ${k}`], [ans - k + 1, 'counting slip'], [ans + k, 'skipped one'], [ans - 1, 'counting slip']], explain: `${seq[2]} + ${k} = ${ans}. Multiples of ${k} go up by ${k} each time.` };
      }
      const m = k * rand(2, 9), near = [m + 1, m - 1, m + 2, m - 2, m + k + 1, m + 3].filter(v => v % k !== 0);
      return { ...base, ask: `Which number is a multiple of ${k}?`, speak: `Which number is in the ${k} times table?`, ans: m,
        choices: pickChoices(m, shuffle(near).map(v => [v, 'not in the times table'])), explain: `${m / k} × ${k} = ${m}, so ${m} is a multiple of ${k}.` };
    }
    case 2: { // factor pairs with arrays
      const n = pick([12, 16, 18, 20, 24, 30, 36]), fs = factorsOf(n).filter(f => f > 1 && f < n && f <= 6), a = pick(fs), b = n / a;
      return { ...base, q: `${n} = ${a} × ${BOX}`, visual: dots(a, b), ask: 'What number goes in the box?', speak: `${n} is ${a} times what? The dots show ${a} rows.`, ans: b,
        distract: [[n - a, 'took away instead'], [b + 1, 'next fact over'], [b - 1, 'next fact over'], [a, 'copied a number'], [n, 'copied the total']],
        explain: `${a} rows of ${b} make ${n}, so ${a} and ${b} are a factor pair of ${n}.` };
    }
    case 3: { // is it a factor?
      const n = pick([12, 18, 20, 24, 28, 30, 32, 36, 40, 42, 45, 48]), fs = factorsOf(n).filter(f => f > 1 && f < n && f <= 12), f = pick(fs);
      const non = shuffle(Array.from({ length: 11 }, (_, i) => i + 2).filter(x => n % x !== 0));
      return { ...base, ask: `Which number goes into ${n} with nothing left over?`, speak: `Which number is a factor of ${n}? It must divide ${n} with nothing left over.`, ans: f,
        choices: pickChoices(f, non.map(v => [v, `${v} does not go into ${n} evenly`])),
        explain: `${n} ÷ ${f} = ${n / f}, with nothing left over. So ${f} is a factor of ${n}.` };
    }
    case 4: { // all the factors
      const n = pick([6, 8, 10, 12, 15, 16, 18, 20, 24]), fs = factorsOf(n), ok = fs.join(', ');
      const mid = fs.slice(1, -1), drop = pick(mid), extra = pick(Array.from({ length: n - 2 }, (_, i) => i + 2).filter(x => n % x !== 0));
      return { ...base, ask: `Which list has all the factors of ${n}?`, speak: `Which list has all the factors of ${n}, and nothing else?`, ans: ok, wordy: true,
        choices: pickChoices(ok, [[fs.filter(x => x !== drop).join(', '), 'missed a factor pair'], [[...fs, extra].sort((a, b) => a - b).join(', '), 'included a number that is not a factor'], [mid.join(', '), 'forgot 1 and the number itself']]),
        explain: `Find the pairs: ${fs.slice(0, Math.ceil(fs.length / 2)).map(x => `${x} × ${n / x}`).join(', ')}. So the factors are ${ok}.` };
    }
    case 5: { // prime or not?
      const p = pick(PRIMES.filter(x => x > 5)), comps = shuffle(ODD_COMPOSITES).slice(0, 3);
      return { ...base, ask: 'Which number is prime?', speak: 'Which number is prime? A prime number can only be made as 1 times itself.', ans: p,
        choices: pickChoices(p, comps.map(c => { const f = factorsOf(c)[1]; return [c, `${c} = ${f} × ${c / f}, so it is not prime`]; })),
        explain: `${p} can only be made as 1 × ${p}: one row of ${p}. That makes it prime. ${comps.map(c => { const f = factorsOf(c)[1]; return `${c} = ${f} × ${c / f}`; }).join(', ')}.` };
    }
    case 6: { // common multiples
      const [a, b] = pick([[2, 3], [3, 4], [2, 5], [4, 6], [3, 5], [4, 5], [6, 8], [2, 7], [6, 9], [4, 10]]), m = lcm(a, b);
      return { ...base, sub: 'lcm', story: `In the castle, the bell rings every ${a} days and the great drum booms every ${b} days. Both sounded today. How many days until the next day they both sound?`, ans: m,
        distract: [[a * b === m ? m + a * b : a * b, 'multiplied, but that is not the soonest'], [a + b, 'added the numbers'], [Math.max(a, b), 'picked the bigger number'], [m + 1, 'counting slip']].filter(([v]) => v !== m),
        explain: `Bell: ${Array.from({ length: m / a }, (_, i) => (i + 1) * a).join(', ')}. Drum: ${Array.from({ length: m / b }, (_, i) => (i + 1) * b).join(', ')}. They meet first at ${m}.` };
    }
    case 7: { // biggest common factor
      let a, b, g; do { g = rand(2, 9); a = g * rand(1, 5); b = g * rand(1, 5); } while (a === b || gcd(a, b) !== g || Math.max(a, b) > 45 || Math.min(a, b) === g && rng() < 0.7);
      const smaller = factorsOf(g).filter(x => x > 1 && x < g);
      return { ...base, ask: `What is the biggest number that goes into both ${a} and ${b} with nothing left over?`, speak: `What is the biggest number that divides both ${a} and ${b} evenly?`, ans: g,
        distract: [...smaller.map(x => [x, 'found a common factor, but not the biggest']), [Math.min(a, b) === g ? g * 2 : Math.min(a, b), 'picked the smaller number'], [Math.abs(a - b) % g === 0 && Math.abs(a - b) !== g ? Math.abs(a - b) : g + 1, 'took one from the other'], [1, 'gave up at 1']],
        explain: `Factors of ${a}: ${factorsOf(a).join(', ')}. Factors of ${b}: ${factorsOf(b).join(', ')}. The biggest in both lists is ${g}.` };
    }
    default: { // prime factor trees, then powers
      const n = pick(L === 8 ? [8, 12, 18, 20, 24, 28, 30, 36, 45, 50] : [12, 18, 20, 24, 28, 36, 40, 45, 48, 72]), ps = primeFactors(n);
      if (L === 8) {
        const ok = ps.join(' × '), big = factorsOf(n).find(f => f > 3 && !isPrime(f) && f < n);
        const wrong = [[`${n / big} × ${big}`, `${big} is not prime`], [ps.slice(1).join(' × '), 'missed a prime'], [[2, ...ps].join(' × '), 'one prime too many'], [ps.map(p => p === 2 ? 3 : p).join(' × '), 'used the wrong prime']].filter(([v]) => v && v !== ok);
        return { ...base, ask: `Which shows ${n} made only from prime numbers?`, speak: `Break ${n} into a factor tree. Which shows ${n} as prime numbers multiplied together?`, ans: ok, wordy: true,
          visual: treeHtml(n), choices: pickChoices(ok, wrong), explain: `Keep splitting until every number is prime: ${n} = ${ok}.` };
      }
      const count = {}; ps.forEach(p => { count[p] = (count[p] || 0) + 1; });
      const write = c => Object.keys(c).map(Number).sort((a, b) => a - b).filter(p => c[p] > 0);
      const html = c => write(c).map(p => c[p] > 1 ? pw(p, c[p]) : p).join(' × '), plain = c => write(c).map(p => c[p] > 1 ? sp(p, c[p]) : p).join(' × ');
      const ps2 = write(count), tweak = [];
      const up = { ...count }; up[ps2[0]]++; tweak.push([up, 'one prime too many']);
      if (count[ps2[0]] > 1) { const dn = { ...count }; dn[ps2[0]]--; tweak.push([dn, 'one prime too few']); }
      if (ps2.length > 1) { const sw = { ...count }; [sw[ps2[0]], sw[ps2[1]]] = [count[ps2[1]], count[ps2[0]]]; if (plain(sw) !== plain(count)) tweak.push([sw, 'put the power on the wrong prime']); }
      const add3 = { ...count }; add3[3] = (add3[3] || 0) + 1; tweak.push([add3, 'one prime too many']);
      const ok = plain(count), extra = { [ok]: { html: html(count), say: ok } };
      tweak.forEach(([c]) => { extra[plain(c)] = { html: html(c), say: plain(c) }; });
      return { ...base, ask: `Which is ${n} written as primes with powers?`, speak: `Which shows ${n} as prime numbers, using powers for repeats?`, ans: ok, ansLabel: ok, wordy: true,
        choices: pickChoices(ok, tweak.map(([c, tag]) => [plain(c), tag]), extra),
        explain: `${n} = ${ps.join(' × ')}. Repeated primes become a power: ${ok}.` };
    }
  }
}
// a simple factor tree: split off the smallest prime each time
function treeHtml(n) {
  const rows = []; let m = n;
  for (const p of primeFactors(n).slice(0, -1)) { rows.push(`<div class="tree-row"><b>${m}</b> → <span class="prime">${p}</span> × ${m / p}</div>`); m /= p; }
  return `<div class="tree">${rows.join('')}</div>`;
}
