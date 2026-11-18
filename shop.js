/* ---------- Money: paying and getting change (Money levels 5–7) ----------
   Level 5: pay and get change (or work back to the price), amounts as numbers or as bills and coins.
   Level 6: how many can you buy, and how much is left over ($1.99 is 1¢ less than $2).
   Level 7: a shopping trip with two things, and picking the right change from piles of bills and coins.
   Uses helpers from app.js at the time a problem is made. */

// drawn bills for $5, $10 and $20: plain chalk-green cards, clearly not pictures of real money
const BILLS = { b20: 2000, b10: 1000, b5: 500, b: 100 };
const MONEY_ORDER = ['b20', 'b10', 'b5', 'b', 'q', 'd', 'n', 'p'];
const moneyVal = k => BILLS[k] || COINS[k].v;
function billSvg(v, w = 150) {
  return `<svg class="bill-draw" viewBox="0 0 150 64" width="${w}" role="img" aria-label="${v} dollar bill"><rect x="1.5" y="1.5" width="147" height="61" rx="5" class="bd-paper"/><rect x="8" y="8" width="134" height="48" rx="3" class="bd-frame"/><circle cx="75" cy="32" r="17" class="bd-seal"/><text x="75" y="39" text-anchor="middle" class="bd-mid">${v}</text><text x="17" y="24" text-anchor="middle" class="bd-corner">${v}</text><text x="133" y="52" text-anchor="middle" class="bd-corner">${v}</text></svg>`;
}
// fewest bills and coins for an amount
function breakdown(c) {
  const out = [];
  for (const k of MONEY_ORDER) while (c >= moneyVal(k)) { out.push(k); c -= moneyVal(k); }
  return out;
}
// a pile of money; `small` for answer choices
function moneyPile(list, small) {
  const items = list.slice().sort((a, b) => MONEY_ORDER.indexOf(a) - MONEY_ORDER.indexOf(b)).map(k => {
    if (k === 'b') return `<span class="coin-wrap"><img src="money/dollar.jpg" width="${small ? 84 : 150}" height="${small ? 36 : 64}" class="bill-img" alt="one dollar bill">${small ? '' : '<b class="denom">$1</b><small>dollar</small>'}</span>`;
    if (BILLS[k]) return `<span class="coin-wrap">${billSvg(BILLS[k] / 100, small ? 84 : 150)}${small ? '' : `<b class="denom">$${BILLS[k] / 100}</b><small>${BILLS[k] / 100} dollars</small>`}</span>`;
    const c = COINS[k], d = Math.round(c.mm * (small ? 1.9 : 2.6));
    return `<span class="coin-wrap"><img src="${c.img}" width="${d}" height="${d}" class="coin-img" alt="${c.name}">${small ? '' : `<b class="denom">${c.v}¢</b><small>${c.name}</small>`}</span>`;
  });
  return `<div class="coins ${small ? 'coins-small' : ''}" role="img" aria-label="${list.length} bills and coins">${items.join('')}</div>`;
}
const saidMoney = c => { const d = Math.floor(c / 100), r = c % 100; return d && r ? `${d} dollar${d > 1 ? 's' : ''} and ${r} cent${r > 1 ? 's' : ''}` : d ? `${d} dollar${d > 1 ? 's' : ''}` : `${r} cents`; };

// things to buy, with a price range in cents and a step (prices end in 5 or 0 early, any cents later)
const SHOP = [
  { one: 'box of ice creams', many: 'boxes of ice creams', lo: 150, hi: 299 },
  { one: 'dragon kite', many: 'dragon kites', lo: 200, hi: 450 },
  { one: 'jar of honey', many: 'jars of honey', lo: 120, hi: 380 },
  { one: 'comic book', many: 'comic books', lo: 99, hi: 399 },
  { one: 'bag of marbles', many: 'bags of marbles', lo: 75, hi: 250 },
  { one: 'wooden sword', many: 'wooden swords', lo: 250, hi: 650 },
  { one: 'lantern', many: 'lanterns', lo: 300, hi: 800 },
  { one: 'apple pie', many: 'apple pies', lo: 225, hi: 575 },
  { one: 'bag of chestnuts', many: 'bags of chestnuts', lo: 85, hi: 199 },
  { one: 'set of colored chalk', many: 'sets of colored chalk', lo: 110, hi: 340 },
];
const priceIn = (it, step) => { const lo = Math.ceil(it.lo / step) * step; return lo + step * rand(0, Math.floor((it.hi - lo) / step)); };
const a_an = w => (/^[aeiou]/.test(w) ? 'an ' : 'a ') + w;

// the classic slip: take the smaller cents from the bigger cents, never borrowing a dollar
function noBorrow(a, b) { const d = Math.floor(a / 100) - Math.floor(b / 100), c = Math.abs(a % 100 - b % 100); return d * 100 + c; }
// count up from the price to what was paid: $2.35 → $2.40 → $2.50 → $3 → $5
function countUp(price, paid) {
  const stops = [price];
  let at = price;
  if (at % 10) { at += 10 - at % 10; if (at <= paid) stops.push(at); }
  if (at % 100 && at < paid) { at += 100 - at % 100; if (at <= paid) stops.push(at); }
  if (at < paid) stops.push(paid);
  return stops.filter((v, i, a) => a.indexOf(v) === i).map(cents).join(' → ');
}
const changeTraps = (paid, price, ans) => [[noBorrow(paid, price), 'took the small cents from the big cents'], [price, 'gave the price, not the change'], [paid + price, 'added instead of taking away'], [ans + 10, 'counting slip'], [ans - 10, 'counting slip'], [ans + 100, 'off by a dollar'], [ans - 100, 'off by a dollar']];

function genShop(L) {
  const base = { skill: 'money', fmt: cents }, it = pick(SHOP), who = N();
  if (L === 5) {
    const kind = rand(0, 2), step = 5; // first change level: prices end in 0 or 5
    if (kind === 0) { // has some money, buys one thing
      const price = priceIn(it, step), have = price + rand(1, 30) * (step === 5 ? 5 : rand(1, 9)), ans = have - price, pics = rng() < 0.5;
      const story = pics ? `${who} has this money and buys ${a_an(it.one)} for ${cents(price)}. How much is left?` : `${who} has ${cents(have)} and buys ${a_an(it.one)} for ${cents(price)}. How much is left?`;
      return { ...base, sub: 'left', story, speak: pics ? `${who} has this money and buys ${a_an(it.one)} for ${saidMoney(price)}. How much is left?` : `${who} has ${saidMoney(have)} and buys ${a_an(it.one)} for ${saidMoney(price)}. How much is left?`,
        visual: pics ? moneyPile(breakdown(have)) : null, ask: pics ? 'Count the money first, then take away the price.' : 'Take away the price. Count up if it helps!', ans,
        distract: changeTraps(have, price, ans), explain: `${pics ? `The money is ${cents(have)}. ` : ''}${cents(have)} − ${cents(price)} = ${cents(ans)}` };
    }
    if (kind === 1) { // pays with a bill, gets change: count up
      const price = priceIn(it, step), bill = [100, 500, 1000].find(b => b > price + 4) || 1000, ans = bill - price;
      return { ...base, sub: 'change', story: `${cap(a_an(it.one))} costs ${cents(price)}. ${who} pays with a $${bill / 100} bill. How much change?`, speak: `${cap(a_an(it.one))} costs ${saidMoney(price)}. ${who} pays with a ${bill / 100} dollar bill. How much change does ${who} get back?`,
        visual: moneyPile(breakdown(bill)), ask: 'Count up from the price to the bill.', ans, distract: changeTraps(bill, price, ans),
        explain: `Count up: ${countUp(price, bill)}. That is ${cents(ans)} of change.` };
    }
    // work back to the price
    const price = priceIn(it, 5), left = rand(1, 20) * 5, have = price + left;
    return { ...base, sub: 'price', story: `${who} had ${cents(have)}, bought ${a_an(it.one)}, and has ${cents(left)} left. How much was the ${it.one}?`, speak: `${who} had ${saidMoney(have)}, bought ${a_an(it.one)}, and has ${saidMoney(left)} left. How much was the ${it.one}?`,
      ask: 'What was spent is what is missing.', ans: price, distract: [[have + left, 'added instead of taking away'], [left, 'gave what was left'], [noBorrow(have, left), 'took the small cents from the big cents'], [price + 10, 'counting slip'], [price - 10, 'counting slip']],
      explain: `${cents(have)} − ${cents(left)} = ${cents(price)}. Check: ${cents(price)} + ${cents(left)} = ${cents(have)}.` };
  }
  if (L === 6) { // how many can you buy, and what's left over
    const nice = rng() < 0.4, price = nice ? pick([199, 99, 299, 149, 249]) : pick([125, 150, 175, 200, 225, 250, 75, 50]), n = rand(1, nice ? 4 : 5);
    // what's left must be less than one more, or one more could be bought
    const have = n * price + step5(rand(0, price - 1), nice), rest = have - n * price, pics = rng() < 0.4;
    const asksLeft = rng() < 0.45, item = it;
    const has = pics ? `${who} has this money.` : `${who} has ${cents(have)}.`, hasSaid = pics ? `${who} has this money.` : `${who} has ${saidMoney(have)}.`;
    const tip = price % 100 === 99 ? ` ${cents(price)} is 1¢ less than ${cents(price + 1)}.` : '';
    const steps = Array.from({ length: n + 1 }, (_, k) => cents(k * price)).slice(1);
    if (!asksLeft) return { ...base, fmt: null, sub: 'howmany', story: `${has} ${cap(item.many)} cost ${cents(price)} each. How many can ${who} buy?`, speak: `${hasSaid} ${cap(item.many)} cost ${saidMoney(price)} each. How many can ${who} buy?`,
      visual: pics ? moneyPile(breakdown(have)) : null, ask: `Add ${cents(price)} again and again until the next one would be too much.${tip}`, ans: n,
      distract: [[n + 1, 'rounded up'], [n - 1, 'stopped too soon'], [Math.round(have / 100), 'counted dollars instead'], [n + 2, 'counting slip']].filter(d => d[0] > 0 && d[0] !== n),
      explain: `${steps.join(', ')}${have >= (n + 1) * price ? '' : `, and ${n + 1} would be ${cents((n + 1) * price)}, too much`}. So ${who} can buy ${n}${rest ? `, with ${cents(rest)} left over` : ''}.` };
    return { ...base, sub: 'leftover', story: `${has} ${cap(item.many)} cost ${cents(price)} each. ${who} buys as many as possible. How much money is left over?`, speak: `${hasSaid} ${cap(item.many)} cost ${saidMoney(price)} each. ${who} buys as many as possible. How much money is left over?`,
      visual: pics ? moneyPile(breakdown(have)) : null, ask: `First find how many ${who} can buy.${tip}`, ans: rest,
      distract: [[rest + price, 'bought one too few'], [have - price, 'bought only one'], [price - rest, 'found what was missing for one more'], [have - n * 100, 'used whole dollars for the price'], [rest + 10, 'counting slip']].filter(d => d[0] >= 0 && d[0] !== rest),
      explain: `${n} ${n === 1 ? item.one : item.many} cost ${cents(n * price)}${price % 100 === 99 ? ` (${n} × ${cents(price + 1)} − ${n}¢)` : ''}. ${cents(have)} − ${cents(n * price)} = ${cents(rest)} left over.` };
  }
  // level 7: a shopping trip
  if (rng() < 0.45) { // which pile is the right change?
    const price = priceIn(it, 5), bill = [500, 1000].find(b => b > price + 20) || 1000, ans = bill - price;
    const wrongVals = [...new Set([noBorrow(bill, price), ans + 25, ans - 25, ans + 100, ans - 10, ans + 5].filter(v => v > 0 && v !== ans))];
    const picks = shuffle(wrongVals).slice(0, 3);
    return { ...base, fmt: null, sub: 'pile', story: `${cap(a_an(it.one))} costs ${cents(price)}. ${who} pays with a $${bill / 100} bill.`, speak: `${cap(a_an(it.one))} costs ${saidMoney(price)}. ${who} pays with a ${bill / 100} dollar bill. Which pile is the right change?`,
      ask: 'Which pile is the right change?', ans: cents(ans), pics: true, ansLabel: `${cents(ans)}, the pile with the green border`,
      choices: [{ v: cents(ans), ok: true, html: moneyPile(breakdown(ans), true) }, ...picks.map(v => ({ v: cents(v), tag: v === noBorrow(bill, price) ? 'took the small cents from the big cents' : 'counted the change wrong', html: moneyPile(breakdown(v), true) }))],
      explain: `Count up: ${countUp(price, bill)}. The change is ${cents(ans)}.` };
  }
  let it2; do { it2 = pick(SHOP); } while (it2 === it);
  const step = rng() < 0.5 ? 5 : 1, p1 = priceIn(it, step), p2 = priceIn(it2, step), cost = p1 + p2, bill = [500, 1000, 2000].find(b => b > cost + 9), ans = bill - cost;
  return { ...base, sub: 'trip', story: `${who} buys ${a_an(it.one)} for ${cents(p1)} and ${a_an(it2.one)} for ${cents(p2)}, and pays with a $${bill / 100} bill. How much change?`,
    speak: `${who} buys ${a_an(it.one)} for ${saidMoney(p1)} and ${a_an(it2.one)} for ${saidMoney(p2)}, and pays with a ${bill / 100} dollar bill. How much change?`,
    visual: moneyPile(breakdown(bill)), ask: 'Add the prices first, then find the change.', ans,
    distract: [[bill - p1, 'forgot one of the things'], [bill - p2, 'forgot one of the things'], [cost, 'gave the total, not the change'], [noBorrow(bill, cost), 'took the small cents from the big cents'], [ans + 10, 'counting slip'], [ans + 100, 'off by a dollar']].filter(d => d[0] > 0),
    explain: `${cents(p1)} + ${cents(p2)} = ${cents(cost)}. Count up to $${bill / 100}: ${countUp(cost, bill)}. The change is ${cents(ans)}.` };
}
// leftover cents for "how many can you buy": round numbers early, any cents with the $x.99 prices
function step5(left, nice) { return nice ? left : Math.floor(left / 5) * 5; }
