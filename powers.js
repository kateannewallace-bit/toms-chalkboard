/* ---------- Exponents ----------
   What a power means, then the rules, each shown with the factors written out before it is used
   with big exponents: multiply → add the exponents, divide → subtract them, power of a power →
   multiply them, anything to the 0 is 1, and adding powers is different. Ends with letters (a³ × a⁴),
   which leads on to algebra.
   Also holds the root-rule problems that Squares & roots weaves between its levels.
   Uses helpers from app.js and thinking.js at the time a problem is made. */

const pw = (b, e) => `${b}<sup>${e}</sup>`;
// plain-text power for asks and explanations: sp(2, 3) → 2³
const sp = (b, e) => `${b}${String(e).split('').map(c => '⁰¹²³⁴⁵⁶⁷⁸⁹'[c]).join('')}`;
const pwBox = b => `${b}<sup>${BOX}</sup>`;
const sayPow = (b, e) => e === 2 ? `${b} squared` : e === 3 ? `${b} cubed` : `${b} to the power ${e}`;
const big = v => v.toLocaleString('en-US');
// "(2 × 2) × (2 × 2 × 2)": each group in its own color so the factors can be counted
const factors = (b, e) => Array(e).fill(b).join(' × ');
const expandHtml = (b, groups, sep = '×') => `<div class="pw-expand">${groups.map((e, i) => `<span class="g${i % 4}">(${factors(b, e)})</span>`).join(` <span class="pw-op">${sep}</span> `)}</div>`;
// a fraction with matching factors crossed out top and bottom
function cancelHtml(b, top, bot) {
  const row = (n, cls) => Array.from({ length: n }, (_, i) => `<span class="${i < bot ? 'x' : cls}">${b}</span>`).join(' × ');
  return `<div class="pw-frac"><div>${row(top, 'keep')}</div><div class="pw-bar"></div><div>${row(bot, 'x')}</div></div>`;
}
const POW_SUB = (kind, ans, d, extra) => ({ ...extra, ans, distract: [...d, [ans + 1, 'counting slip'], [ans - 1, 'counting slip']].filter(x => x[0] !== ans && x[0] >= 0) });

function genPowers(L) {
  const base = { skill: 'powers' };
  switch (L) {
    case 1: { // what a power means
      let b, e; do { b = rand(2, 9); e = rand(2, 5); } while (b === e);
      const kind = rand(0, 1);
      if (kind === 0) return { ...base, sub: 'count', q: `${factors(b, e)} = ${pwBox(b)}`, qClass: 'small', ask: `How many ${b}s are multiplied?`,
        speak: `${factors(b, e).replace(/×/g, 'times')}. How many ${b}s are multiplied together?`, ans: e,
        distract: [[b, 'gave the number being multiplied'], [b * e, 'multiplied them'], [e + 1, 'counting slip'], [e - 1, 'counting slip']].filter(d => d[0] !== e && d[0] > 0),
        explain: `There are ${e} ${b}s multiplied, so it is ${b} to the power ${e}: ${sp(b, e)}.` };
      const ok = factors(b, e), wrong = [[`${b} × ${e}`, 'multiplied the two numbers'], [Array(e).fill(b).join(' + '), 'added instead of multiplied'], [factors(e, b), 'mixed up the two numbers']].filter(w => w[0] !== ok);
      return { ...base, sub: 'means', q: pw(b, e), ask: `What does ${sp(b, e)} mean?`, speak: `What does ${sayPow(b, e)} mean?`, ans: ok, wordy: true, sayChoices: true,
        choices: [{ v: ok, ok: true }, ...wrong.map(([v, tag]) => ({ v, tag }))], explain: `The small ${e} says how many ${b}s to multiply: ${ok}.` };
    }
    case 2: { // small powers: find the value
      const [b, e] = pick([[2, 2], [2, 3], [2, 4], [2, 5], [3, 2], [3, 3], [4, 2], [4, 3], [5, 2], [5, 3], [10, 2], [10, 3], [1, rand(2, 6)], [6, 2], [2, 6]]);
      const v = b ** e;
      return { ...base, sub: 'value', q: pw(b, e), visual: `<div class="pw-expand"><span class="g0">${factors(b, e)}</span></div>`, ask: 'Multiply them all.', speak: `What is ${sayPow(b, e)}?`, ...POW_SUB('v', v,
        [[b * e, 'multiplied the two numbers'], [b + e, 'added the two numbers'], [b ** (e - 1), 'one too few'], [b ** (e + 1), 'one too many']]),
        explain: `${sp(b, e)} = ${factors(b, e)} = ${v}` };
    }
    case 3: { // multiplying: count all the factors (adding exponents, concretely)
      const b = rand(2, 5), a = rand(1, 4), c = rand(1, Math.min(4, 7 - a)), s = a + c;
      return { ...base, sub: 'mulc', q: `${pw(b, a)} × ${pw(b, c)} = ${pwBox(b)}`, qClass: 'small', visual: expandHtml(b, [a, c]), ask: `Count all the ${b}s.`,
        speak: `${sayPow(b, a)} times ${sayPow(b, c)} equals ${b} to the power of what? Count all the ${b}s.`, ...POW_SUB('m', s,
          [[a * c, 'multiplied the exponents'], [Math.max(a, c), 'kept one of the exponents'], [b, 'gave the number being multiplied']]),
        explain: `${sp(b, a)} has ${a} of them and ${sp(b, c)} has ${c}: ${a} + ${c} = ${s} in all. Multiplying powers adds the exponents!` };
    }
    case 4: { // powers of 10: count the zeros
      const kind = rand(0, 2);
      if (kind === 0) { const e = rand(1, 6), v = 10 ** e;
        return { ...base, sub: 'ten-val', q: pw(10, e), ask: `Write a 1 with ${pl(e, 'zero')} after it.`, speak: `What is ten to the power ${e}?`, fmt: big, ...POW_SUB('t', v,
          [[10 * e, 'multiplied 10 by the exponent'], [10 ** (e + 1), 'one zero too many'], [10 ** Math.max(0, e - 1), 'one zero too few']]), explain: `${sp(10, e)} = ${factors(10, e)} = ${big(v)}, a 1 with ${pl(e, 'zero')}.` }; }
      if (kind === 1) { const e = rand(2, 6), v = 10 ** e;
        return { ...base, sub: 'ten-exp', q: `${big(v)} = ${pwBox(10)}`, ask: 'Count the zeros.', speak: `${big(v)} is ten to the power of what?`, ...POW_SUB('t', e,
          [[v / 10, 'counted the digits wrong'], [e + 1, 'counted every digit'], [10, 'gave the 10']]), explain: `${big(v)} has ${pl(e, 'zero')}, so it is 10 to the power ${e}.` }; }
      const a = rand(1, 4), c = rand(1, 4), s = a + c;
      return { ...base, sub: 'ten-mul', q: `${pw(10, a)} × ${pw(10, c)} = ${pwBox(10)}`, qClass: 'small', visual: `<div class="pw-expand"><span class="g0">${big(10 ** a)}</span> <span class="pw-op">×</span> <span class="g1">${big(10 ** c)}</span> = ${big(10 ** s)}</div>`,
        ask: 'Count the zeros.', speak: `ten to the power ${a} times ten to the power ${c} equals ten to the power of what?`, ...POW_SUB('t', s, [[a * c, 'multiplied the exponents']]),
        explain: `${pl(a, 'zero')} and ${pl(c, 'more zero')} make ${s}: ${a} + ${c} = ${s}.` };
    }
    case 5: { // multiply: add the exponents (too many to count)
      const b = rand(2, 9), a = rand(3, 12), c = rand(3, 12), kind = rand(0, 2);
      if (kind === 1) return { ...base, sub: 'mul-miss', q: `${pw(b, a)} × ${pwBox(b)} = ${pw(b, a + c)}`, qClass: 'small', ask: 'Multiplying adds the exponents.', speak: `${sayPow(b, a)} times ${b} to the power of what equals ${sayPow(b, a + c)}?`, ...POW_SUB('m', c,
        [[a + a + c, 'added instead of finding the missing part'], [a, 'copied an exponent'], [a + c, 'copied the total']]), explain: `${a} + ${c} = ${a + c}, so the missing exponent is ${c}.` };
      if (kind === 2) { const d = rand(2, 6), s = a + c + d;
        return { ...base, sub: 'mul3', q: `${pw(b, a)} × ${pw(b, c)} × ${pw(b, d)} = ${pwBox(b)}`, qClass: 'small', ask: 'Multiplying adds the exponents.', speak: `${sayPow(b, a)} times ${sayPow(b, c)} times ${sayPow(b, d)} equals ${b} to the power of what?`, ...POW_SUB('m', s,
          [[a + c, 'forgot one'], [a * c * d, 'multiplied the exponents'], [s + 10, 'off by ten']]), explain: `${a} + ${c} + ${d} = ${s}` }; }
      return { ...base, sub: 'mul', q: `${pw(b, a)} × ${pw(b, c)} = ${pwBox(b)}`, qClass: 'small', ask: 'Multiplying adds the exponents.', speak: `${sayPow(b, a)} times ${sayPow(b, c)} equals ${b} to the power of what?`, ...POW_SUB('m', a + c,
        [[a * c, 'multiplied the exponents'], [a + c + 10, 'off by ten'], [Math.max(a, c), 'kept one of the exponents']]), explain: `Multiplying adds the exponents: ${a} + ${c} = ${a + c}.` };
    }
    case 6: { // divide: cross out matching factors (subtracting exponents, concretely)
      const b = rand(2, 5), a = rand(3, 7), c = rand(1, a - 1), r = a - c;
      return { ...base, sub: 'divc', q: `${pw(b, a)} ÷ ${pw(b, c)} = ${pwBox(b)}`, qClass: 'small', visual: cancelHtml(b, a, c), ask: `Each ${b} on the bottom crosses out a ${b} on top. How many are left?`,
        speak: `${sayPow(b, a)} divided by ${sayPow(b, c)} equals ${b} to the power of what? Cross out matching ${b}s. How many are left on top?`, ...POW_SUB('d', r,
          [[a + c, 'added the exponents'], [a % c === 0 ? a / c : -1, 'divided the exponents'], [a, 'forgot to cross out']]),
        explain: `The bottom crosses out ${c} on top, so ${r} are left: ${a} − ${c} = ${r}. Dividing powers subtracts the exponents!` };
    }
    case 7: { // divide: subtract the exponents
      const b = rand(2, 9), c = rand(2, 9), r = rand(2, 9), a = c + r;
      if (rng() < 0.35) return { ...base, sub: 'div-miss', q: `${pw(b, a)} ÷ ${pwBox(b)} = ${pw(b, r)}`, qClass: 'small', ask: 'Dividing subtracts the exponents.', speak: `${sayPow(b, a)} divided by ${b} to the power of what equals ${sayPow(b, r)}?`, ...POW_SUB('d', c,
        [[a + r, 'added instead'], [r, 'copied an exponent'], [a, 'copied an exponent']]), explain: `${a} − ${c} = ${r}, so the missing exponent is ${c}.` };
      return { ...base, sub: 'div', q: `${pw(b, a)} ÷ ${pw(b, c)} = ${pwBox(b)}`, qClass: 'small', ask: 'Dividing subtracts the exponents.', speak: `${sayPow(b, a)} divided by ${sayPow(b, c)} equals ${b} to the power of what?`, ...POW_SUB('d', r,
        [[a + c, 'added the exponents'], [a % c === 0 ? a / c : -1, 'divided the exponents'], [a, 'forgot to subtract']]), explain: `${a} − ${c} = ${r}` };
    }
    case 8: { // the zero power
      const b = rand(2, 12), e = rand(2, 6), kind = rand(0, 2);
      if (kind === 0) return { ...base, sub: 'zero-exp', q: `${pw(b, e)} ÷ ${pw(b, e)} = ${pwBox(b)}`, qClass: 'small', visual: cancelHtml(b, e, e), ask: 'Subtract the exponents.', speak: `${sayPow(b, e)} divided by ${sayPow(b, e)} equals ${b} to the power of what?`, ...POW_SUB('z', 0,
        [[1, 'gave the value, not the exponent'], [2 * e, 'added the exponents'], [e, 'kept the exponent']]), explain: `${e} − ${e} = 0, so it is ${sp(b, 0)}. Every ${b} crossed out!` };
      if (kind === 1) return { ...base, sub: 'zero-val', q: `${pw(b, e)} ÷ ${pw(b, e)}`, visual: cancelHtml(b, e, e), ask: 'A number divided by itself is…', speak: `What is ${sayPow(b, e)} divided by ${sayPow(b, e)}?`, ...POW_SUB('z', 1,
        [[0, 'thought nothing is left'], [b, 'gave the number being multiplied'], [b ** e, 'gave one of the powers']]), explain: `Any number divided by itself is 1. So ${sp(b, 0)} = 1.` };
      return { ...base, sub: 'zero', q: pw(b, 0), ask: `${sp(b, 0)} is the same as ${sp(b, e)} ÷ ${sp(b, e)}.`, speak: `What is ${b} to the power zero?`, ...POW_SUB('z', 1,
        [[0, 'thought the 0 makes it 0'], [b, 'gave the number being multiplied'], [10, 'guessed 10']]), explain: `Anything (except 0) to the power 0 is 1, because it is a number divided by itself.` };
    }
    case 9: { // power of a power: multiply the exponents
      if (rng() < 0.5) { const b = rand(2, 5), a = rand(2, 3), c = rand(2, 3), s = a * c;
        return { ...base, sub: 'powc', q: `(${pw(b, a)})<sup>${c}</sup> = ${pwBox(b)}`, qClass: 'small', visual: expandHtml(b, Array(c).fill(a)), ask: `It is ${c} groups of ${sp(b, a)}. Count all the ${b}s.`,
          speak: `${sayPow(b, a)}, all to the power ${c}, equals ${b} to the power of what? Count all the ${b}s.`, ...POW_SUB('p', s, [[a + c, 'added the exponents'], [a ** c, 'made a power of the exponent']]),
          explain: `${c} groups of ${sp(b, a)}: ${c} × ${a} = ${s}. A power of a power multiplies the exponents!` }; }
      const b = rand(2, 9), a = rand(2, 6), c = rand(2, 6), s = a * c;
      return { ...base, sub: 'pow', q: `(${pw(b, a)})<sup>${c}</sup> = ${pwBox(b)}`, qClass: 'small', ask: 'A power of a power multiplies the exponents.', speak: `${sayPow(b, a)}, all to the power ${c}, equals ${b} to the power of what?`, ...POW_SUB('p', s,
        [[a + c, 'added the exponents'], [s + a, 'one group too many'], [s - a, 'one group too few']]), explain: `${c} groups of ${a}: ${a} × ${c} = ${s}.` };
    }
    case 10: { // adding powers is different
      const kind = rand(0, 2);
      if (kind === 0) { const [b, a, c] = pick([[2, 2, 3], [2, 1, 3], [2, 3, 2], [3, 1, 2], [3, 2, 2], [2, 2, 2], [10, 1, 2], [2, 4, 1], [5, 1, 2], [3, 2, 1]]), v = b ** a + b ** c;
        return { ...base, sub: 'add-val', q: `${pw(b, a)} + ${pw(b, c)}`, ask: 'Adding is different: find each power first.', speak: `What is ${sayPow(b, a)} plus ${sayPow(b, c)}?`, ...POW_SUB('a', v,
          [[b ** (a + c), 'added the exponents'], [(2 * b) ** Math.max(a, c), 'added the bottom numbers'], [b * a + b * c, 'multiplied instead of making powers']]),
          explain: `${b ** a} + ${b ** c} = ${v}. There is no shortcut for adding: ${sp(b, a)} + ${sp(b, c)} is not ${sp(b, a + c)} = ${b ** (a + c)}.` }; }
      if (kind === 1) { const e = rand(2, 6);
        return { ...base, sub: 'add-twin', q: `${pw(2, e)} + ${pw(2, e)} = ${pwBox(2)}`, qClass: 'small', ask: `Two of the same thing is double, and doubling is × 2.`, speak: `2 to the power ${e} plus 2 to the power ${e} equals 2 to the power of what?`, ...POW_SUB('a', e + 1,
          [[2 * e, 'added the exponents'], [e, 'kept the exponent']]), explain: `${sp(2, e)} + ${sp(2, e)} = 2 × ${sp(2, e)}, which is one more 2: ${sp(2, e + 1)}.` }; }
      const e = rand(2, 5);
      return { ...base, sub: 'add-three', q: `${pw(3, e)} + ${pw(3, e)} + ${pw(3, e)} = ${pwBox(3)}`, qClass: 'small', ask: 'Three of the same thing is × 3.', speak: `3 to the power ${e}, three times over, added up, equals 3 to the power of what?`, ...POW_SUB('a', e + 1,
        [[3 * e, 'added the exponents'], [e, 'kept the exponent']]), explain: `Three of them is 3 × ${sp(3, e)}, which is one more 3: ${sp(3, e + 1)}.` };
    }
    case 11: { // mixing the rules
      const b = rand(2, 7);
      if (rng() < 0.4) { // which rule?
        const a = rand(2, 9), c = rand(2, 9), forms = [
          [`${pw(b, a)} × ${pw(b, c)}`, 'Add the exponents', `${sayPow(b, a)} times ${sayPow(b, c)}`],
          [`${pw(b, a + c)} ÷ ${pw(b, c)}`, 'Subtract the exponents', `${sayPow(b, a + c)} divided by ${sayPow(b, c)}`],
          [`(${pw(b, a)})<sup>${c}</sup>`, 'Multiply the exponents', `${sayPow(b, a)}, all to the power ${c}`],
          [`${pw(b, a)} + ${pw(b, c)}`, 'No shortcut: work out each one', `${sayPow(b, a)} plus ${sayPow(b, c)}`]];
        const [q, ok, said] = pick(forms);
        return { ...base, sub: 'which', q, ask: 'Which rule do you use?', speak: `${said}. Which rule do you use?`, ans: ok, wordy: true, sayChoices: true,
          choices: forms.map(f => ({ v: f[1], ok: f[1] === ok, tag: 'picked the wrong rule' })), explain: `${ok}. × adds, ÷ subtracts, a power of a power multiplies, and + has no shortcut.` };
      }
      const a = rand(2, 4), c = rand(2, 3), d = rand(1, 5), kind = rand(0, 1);
      if (kind === 0) { const s = a * c + d;
        return { ...base, sub: 'mix-pow', q: `(${pw(b, a)})<sup>${c}</sup> × ${pw(b, d)} = ${pwBox(b)}`, qClass: 'small', ask: 'Power of a power first, then multiply.', speak: `${sayPow(b, a)} all to the power ${c}, times ${sayPow(b, d)}, equals ${b} to the power of what?`, ...POW_SUB('x', s,
          [[a + c + d, 'added all the exponents'], [a * c * d, 'multiplied all the exponents'], [a * c, 'forgot the last one']]), explain: `${a} × ${c} = ${a * c}, then ${a * c} + ${d} = ${s}.` }; }
      const m = rand(3, 8), n = rand(2, 8), k = rand(2, m + n - 1), s = m + n - k;
      return { ...base, sub: 'mix-div', q: `${pw(b, m)} × ${pw(b, n)} ÷ ${pw(b, k)} = ${pwBox(b)}`, qClass: 'small', ask: 'Add for ×, subtract for ÷.', speak: `${sayPow(b, m)} times ${sayPow(b, n)} divided by ${sayPow(b, k)} equals ${b} to the power of what?`, ...POW_SUB('x', s,
        [[m + n + k, 'added all the exponents'], [m + n, 'forgot the divide'], [Math.abs(m - n) + k, 'mixed up the signs']]), explain: `${m} + ${n} = ${m + n}, then ${m + n} − ${k} = ${s}.` };
    }
    default: { // letters: the rules work for any number
      const A = VAR('a'), m = rand(2, 9), n = rand(2, 9), kind = rand(0, 3);
      const ap = e => `${A}<sup>${e}</sup>`, apBox = `${A}<sup>${BOX}</sup>`;
      if (kind === 0) return { ...base, sub: 'let-mul', q: `${ap(m)} × ${ap(n)} = ${apBox}`, qClass: 'small', ask: 'Whatever a is, multiplying adds the exponents.', speak: `a to the power ${m} times a to the power ${n} equals a to the power of what?`, ...POW_SUB('l', m + n,
        [[m * n, 'multiplied the exponents']]), explain: `Multiplying adds the exponents: ${m} + ${n} = ${m + n}.` };
      if (kind === 1) { const top = m + n;
        return { ...base, sub: 'let-div', q: `${ap(top)} ÷ ${ap(n)} = ${apBox}`, qClass: 'small', ask: 'Whatever a is, dividing subtracts the exponents.', speak: `a to the power ${top} divided by a to the power ${n} equals a to the power of what?`, ...POW_SUB('l', m,
          [[top + n, 'added the exponents'], [top % n === 0 ? top / n : -1, 'divided the exponents']]), explain: `${top} − ${n} = ${m}.` }; }
      if (kind === 2) { const a = rand(2, 5), c = rand(2, 5);
        return { ...base, sub: 'let-pow', q: `(${ap(a)})<sup>${c}</sup> = ${apBox}`, qClass: 'small', ask: 'A power of a power multiplies the exponents.', speak: `a to the power ${a}, all to the power ${c}, equals a to the power of what?`, ...POW_SUB('l', a * c,
          [[a + c, 'added the exponents']]), explain: `${c} groups of ${a}: ${a} × ${c} = ${a * c}.` }; }
      return { ...base, sub: 'let-zero', q: `${ap(m)} ÷ ${ap(m)}`, ask: 'A number divided by itself…', speak: `What is a to the power ${m} divided by a to the power ${m}?`, ...POW_SUB('l', 1,
        [[0, 'thought nothing is left'], [m, 'gave the exponent'], [2 * m, 'added the exponents']]), explain: `It is a⁰, and anything (except 0) divided by itself is 1.` };
    }
  }
}

/* ---------- root rules, woven into Squares & roots ---------- */
const rt = n => `√${n}`;
const NON_SQ = [2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 17, 19];
function rootUndo() { // a square and a root undo each other
  const kind = rand(0, 2);
  if (kind === 0) { const n = rand(2, 12);
    return { skill: 'squares', sub: 'undo-sq', q: `√(${n}²)`, visual: blocks(Math.min(n, 10)), ask: 'The root undoes the square.', speak: `What is the square root of ${n} squared?`, ans: n,
      distract: [[n * n, 'gave the square'], [2 * n, 'doubled'], [n + 1, 'counting slip']], explain: `${n}² = ${n * n}, and √${n * n} = ${n}. Squaring then rooting gets you back to ${n}.` }; }
  const k = pick(NON_SQ);
  if (kind === 1) return { skill: 'squares', sub: 'undo-rt', q: `(√${k})²`, ask: `Even when you can't find √${k}, squaring undoes it.`, speak: `What is the square root of ${k}, squared?`, ans: k,
    distract: [[k * k, 'squared the number'], [2 * k, 'doubled'], [k + 1, 'counting slip']], explain: `√${k} is the number that times itself makes ${k}. So (√${k})² = ${k}.` };
  return { skill: 'squares', sub: 'undo-x', q: `√${k} × √${k}`, ask: `Which number times itself makes ${k}? That's √${k}!`, speak: `What is the square root of ${k} times the square root of ${k}?`, ans: k,
    distract: [[k * k, 'squared the number'], [2 * k, 'doubled'], [k - 1, 'counting slip']], explain: `√${k} × √${k} = ${k}, because that's what √${k} means.` };
}
function rootMultiply() { // √a × √b = √(a × b)
  if (rng() < 0.45) { // concrete: both are squares, so you can check
    const a = rand(2, 6), b = rand(2, 6);
    return { skill: 'squares', sub: 'mul-c', q: `√${a * a} × √${b * b}`, ask: `Find each root, then multiply. (It's also √${a * a * b * b}!)`, speak: `What is the square root of ${a * a} times the square root of ${b * b}?`, ans: a * b,
      distract: [[a * a * b * b, 'forgot the roots'], [a + b, 'added the roots'], [a * a * b, 'took only one root']], explain: `√${a * a} = ${a} and √${b * b} = ${b}, so ${a} × ${b} = ${a * b}. And √(${a * a} × ${b * b}) = √${a * a * b * b} = ${a * b} too!` };
  }
  const [a, b] = pick([[2, 8], [2, 18], [3, 12], [2, 32], [3, 27], [5, 20], [2, 50], [6, 24], [3, 48], [5, 45], [7, 28], [8, 18], [10, 40], [2, 2], [3, 3], [5, 5], [6, 6], [2, 72], [3, 75]]), r = Math.sqrt(a * b);
  return { skill: 'squares', sub: 'mul', q: `√${a} × √${b}`, ask: 'Multiply under the roots: √a × √b = √(a × b).', speak: `What is the square root of ${a} times the square root of ${b}? Multiply under the roots.`, ans: r,
    distract: [[a * b, 'forgot the root'], [a + b, 'added'], [r + 1, 'counting slip'], [r * 2, 'doubled']], explain: `√${a} × √${b} = √${a * b} = ${r}, because ${r} × ${r} = ${a * b}.` };
}
function rootSplit() { // √(a × b) = √a × √b
  const kind = rand(0, 1);
  if (kind === 0) { const a = rand(2, 9);
    return { skill: 'squares', sub: 'split-100', q: `√${a * a * 100}`, ask: `Split it: √${a * a * 100} = √${a * a} × √100.`, speak: `What is the square root of ${a * a * 100}? Split it into the square root of ${a * a} times the square root of 100.`, ans: a * 10,
      distract: [[a, 'forgot the root of 100'], [a * 100, 'used 100 instead of its root'], [a * a * 10, 'forgot one root'], [a * 10 + 10, 'off by ten']], explain: `√${a * a} = ${a} and √100 = 10, so ${a} × 10 = ${a * 10}.` }; }
  const a = rand(2, 5), b = rand(2, 6);
  return { skill: 'squares', sub: 'split', q: `√(${a * a} × ${b * b})`, ask: 'Find the root of each part, then multiply.', speak: `What is the square root of ${a * a} times ${b * b}? Take the root of each part.`, ans: a * b,
    distract: [[a * a * b * b, 'forgot the roots'], [a * a * b, 'took only one root'], [a + b, 'added the roots']], explain: `√${a * a} = ${a}, √${b * b} = ${b}, and ${a} × ${b} = ${a * b}.` };
}
function rootDivide() { // √a ÷ √b = √(a ÷ b)
  if (rng() < 0.45) { const b = rand(2, 4), a = rand(2, Math.floor(20 / b)), A = a * a * b * b;
    return { skill: 'squares', sub: 'div-c', q: `√${A} ÷ √${b * b}`, ask: `Find each root, then divide. (It's also √${a * a}!)`, speak: `What is the square root of ${A} divided by the square root of ${b * b}?`, ans: a,
      distract: [[a * a, 'forgot the root'], [A / b, 'took only one root'], [a + 1, 'counting slip']], explain: `√${A} = ${a * b} and √${b * b} = ${b}, so ${a * b} ÷ ${b} = ${a}. And √(${A} ÷ ${b * b}) = √${a * a} = ${a} too!` }; }
  const b = pick([2, 3, 5, 6, 7]), r = rand(2, 8), A = b * r * r;
  return { skill: 'squares', sub: 'div', q: `√${A} ÷ √${b}`, ask: 'Divide under the roots: √a ÷ √b = √(a ÷ b).', speak: `What is the square root of ${A} divided by the square root of ${b}? Divide under the roots.`, ans: r,
    distract: [[r * r, 'forgot the root'], [A / b + b, 'added instead'], [r + 1, 'counting slip'], [r - 1, 'counting slip']], explain: `${A} ÷ ${b} = ${r * r}, and √${r * r} = ${r}.` };
}
function rootAddTrap() { // √a + √b is NOT √(a + b)
  // pairs where the wrong way (adding or taking away under the root) still lands on a whole number, so the trap is real
  const minus = rng() < 0.35;
  const [a, b] = minus ? pick([[5, 4], [5, 3], [10, 8], [10, 6], [13, 5], [13, 12], [3, 2], [6, 2]]) : pick([[3, 4], [6, 8], [5, 12], [9, 12], [8, 6], [4, 3], [8, 15], [12, 5], [2, 3], [1, 4], [4, 5], [2, 7]]);
  const A = a * a, B = b * b, ans = minus ? a - b : a + b, trapV = Math.sqrt(minus ? A - B : A + B);
  return { skill: 'squares', sub: minus ? 'add-trap-sub' : 'add-trap', q: `√${A} ${minus ? '−' : '+'} √${B}`, ask: `Careful: you can't ${minus ? 'take away' : 'add'} under the root. Find each root first.`, speak: `What is the square root of ${A} ${minus ? 'minus' : 'plus'} the square root of ${B}?`, ans,
    distract: [[Number.isInteger(trapV) ? trapV : -1, `${minus ? 'took away' : 'added'} under the root`], [minus ? A - B : A + B, 'forgot the roots'], [a * b, 'multiplied'], [ans + 1, 'counting slip']],
    explain: `√${A} = ${a} and √${B} = ${b}, so ${a} ${minus ? '−' : '+'} ${b} = ${ans}.${Number.isInteger(trapV) ? ` √${minus ? A - B : A + B} would be ${trapV}, which is different! Only × and ÷ work under the root.` : ' Only × and ÷ work under the root.'}` };
}
function rootLike() { // 2√3 + 5√3 = 7√3: like counting apples
  const r = pick([2, 3, 5, 6, 7]), a = rand(1, 9), b = rand(1, 9), minus = a > b && rng() < 0.35, ans = minus ? a - b : a + b;
  const show = n => n === 1 ? '' : n;
  return { skill: 'squares', sub: minus ? 'like-sub' : 'like', q: `${show(a)}√${r} ${minus ? '−' : '+'} ${show(b)}√${r} = ${BOX}√${r}`, qClass: 'small', ask: `Count the √${r}s, like apples: ${pl(a, 'apple')} ${minus ? 'take away' : 'and'} ${pl(b, 'apple')}.`,
    speak: `${a} square root ${r} ${minus ? 'minus' : 'plus'} ${b} square root ${r} equals how many square root ${r}s?`, ans,
    distract: [[a * b, 'multiplied'], [minus ? a + b : Math.abs(a - b), minus ? 'added instead' : 'took away instead'], [ans + 1, 'counting slip']].filter(d => d[0] !== ans),
    explain: `${a} of them ${minus ? 'take away' : 'and'} ${b} of them makes ${ans} of them: ${ans}√${r}.` };
}
function rootSimplify() { // √12 = 2√3: find a square hiding inside
  let k, r; do { k = rand(2, 6); r = pick([2, 3, 5, 6, 7]); } while (k * k * r > 200);
  const n = k * k * r;
  return { skill: 'squares', sub: 'simplify', q: `√${n} = ${BOX}√${r}`, qClass: 'small', ask: `Find the square hiding inside: ${n} = ${k * k} × ${r}.`, speak: `The square root of ${n} equals how many square root ${r}s? ${n} is ${k * k} times ${r}.`, ans: k,
    distract: [[k * k, 'gave the square, not its root'], [n / r, 'forgot the root'], [r, 'copied the number under the root'], [k + 1, 'counting slip']].filter(d => d[0] !== k),
    explain: `√${n} = √${k * k} × √${r} = ${k}√${r}, because √${k * k} = ${k}.` };
}
function rootCube() { // ∛8 = 2: the number used 3 times
  const n = rand(1, 10), c = n ** 3;
  return { skill: 'squares', sub: 'cube', q: `∛${c}`, ask: `Which number times itself, three times, makes ${c}?`, speak: `What is the cube root of ${c}? Which number, times itself three times, makes ${c}?`, ans: n,
    distract: [[Number.isInteger(Math.sqrt(c)) ? Math.sqrt(c) : -1, 'took the square root'], [c % 3 === 0 ? c / 3 : -1, 'divided by 3'], [n + 1, 'counting slip'], [n - 1, 'counting slip']].filter(d => d[0] !== n && d[0] > 0),
    explain: `${n} × ${n} × ${n} = ${c}, so ∛${c} = ${n}. The cube root undoes ${n}³.` };
}
