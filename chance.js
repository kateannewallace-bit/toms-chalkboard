/* ---------- Counting & chance ----------
   Counting ways (pairs, outfits, three choices, lining up, handshakes) and then chance with
   a bag of marbles: most likely, "2 out of 7", certain to impossible, and two dice.
   Uses helpers from app.js and divide.js at the time a problem is made. */

const KNIGHTS = ['Sir Gawain', 'Sir Kay', 'Sir Bors', 'Sir Percival', 'Sir Tristan'];
const HORSES = ['the black horse', 'the white horse', 'the gray horse', 'the brown horse', 'the spotted horse'];
const MARBLE_COLORS = ['red', 'blue', 'green', 'yellow'];
const fact = n => n <= 1 ? 1 : n * fact(n - 1);

// a pairing table: every row with every column
function pairTable(rows, cols) {
  return `<table class="pair-table" aria-label="${rows.length} by ${cols.length} table of pairs"><tr><th></th>${cols.map(c => `<th>${esc(c.replace('the ', '').replace(' horse', ''))}</th>`).join('')}</tr>${rows.map(r => `<tr><th>${esc(r.replace('Sir ', ''))}</th>${cols.map(() => '<td>•</td>').join('')}</tr>`).join('')}</table>`;
}
// a bag of colored marbles
function bagSvg(counts) {
  const all = shuffle(counts.flatMap((c, i) => Array(c).fill(i))), per = 5, r = 11, D = 28, W = per * D + 40, rows = Math.ceil(all.length / per), H = rows * D + 50;
  let s = `<path d="M20 30 Q8 ${H - 4} ${W / 2} ${H - 4} Q${W - 8} ${H - 4} ${W - 20} 30 Z" class="bag"/><path d="M28 30 Q${W / 2} 14 ${W - 28} 30" class="bag-tie"/>`;
  all.forEach((c, i) => { s += `<circle cx="${34 + (i % per) * D}" cy="${50 + Math.floor(i / per) * D}" r="${r}" class="marble m-${MARBLE_COLORS[c]}"/>`; });
  return `<svg class="bagsvg" viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="a bag of marbles: ${counts.map((c, i) => `${c} ${MARBLE_COLORS[i]}`).join(', ')}">${s}</svg>`;
}

function genChance(L) {
  const base = { skill: 'chance' };
  switch (L) {
    case 1: case 2: {
      const a = rand(2, L === 1 ? 4 : 5), b = rand(2, L === 1 ? 4 : 6), ans = a * b;
      if (L === 1) {
        const ks = KNIGHTS.slice(0, a), hs = HORSES.slice(0, b);
        return { ...base, visual: pairTable(ks, hs), story: `${a} knights and ${b} horses. Any knight can ride any horse. How many different knight-and-horse pairs are there?`, ans,
          distract: [[a + b, 'added instead of multiplying'], [ans - 1, 'counting slip'], [ans + 1, 'counting slip'], [Math.max(a, b), 'counted only one side']],
          explain: `Each of the ${a} knights can go with ${b} horses: ${a} × ${b} = ${ans} pairs. Every dot in the table is one pair.` };
      }
      const story = pick([
        `A pixie has ${a} hats and ${b} cloaks. How many different outfits of one hat and one cloak can it wear?`,
        `At the feast you can pick ${a} kinds of soup and ${b} kinds of pie. How many different soup-and-pie dinners are there?`,
        `The dragon has ${a} caves and ${b} treasure chests to hide in them. How many ways can it hide one chest in one cave?`,
      ]);
      return { ...base, story, ans, distract: [[a + b, 'added instead of multiplying'], [ans - 1, 'counting slip'], [ans + a, 'next fact over'], [Math.max(a, b), 'counted only one choice']],
        explain: `For each of the ${a}, there are ${b} to go with it: ${a} × ${b} = ${ans}.` };
    }
    case 3: {
      const a = rand(2, 3), b = rand(2, 4), c = rand(2, 3), ans = a * b * c;
      return { ...base, story: `A knight picks a shield (${a} kinds), a sword (${b} kinds) and a helmet (${c} kinds). How many different ways can the knight get ready?`, ans,
        distract: [[a + b + c, 'added instead of multiplying'], [a * b, 'forgot the helmet'], [ans + 1, 'counting slip'], [ans - a, 'counting slip']],
        explain: `${a} × ${b} × ${c} = ${ans}. Each new choice multiplies the ways.` };
    }
    case 4: {
      const n = rand(2, 4), who = shuffle(['the troll', 'the pixie', 'the dragon', 'the gnome']).slice(0, n), ans = fact(n);
      return { ...base, story: `${(s => s[0].toUpperCase() + s.slice(1))(who.slice(0, -1).join(', '))} and ${who[n - 1]} line up for a race. How many different orders can they stand in?`, ans,
        distract: [[n, 'counted the racers'], [n * n, 'multiplied the racers by themselves'], [ans + 1, 'counting slip'], [n * (n - 1) === ans ? ans + n : n * (n - 1), 'forgot the last spot']].filter(([v]) => v !== ans),
        explain: `${n} can stand first, then ${n - 1} ${n === 2 ? 'is' : 'are'} left for second${n > 2 ? `, then ${n - 2} for third` : ''}${n > 3 ? ', then 1 for last' : ''}: ${Array.from({ length: n }, (_, i) => n - i).join(' × ')} = ${ans}.` };
    }
    case 5: {
      const n = rand(3, 6), ans = n * (n - 1) / 2;
      return { ...base, story: `${n} knights sit at the Round Table. Each knight shakes hands once with every other knight. How many handshakes is that?`, ans,
        distract: [[n * (n - 1), 'counted each handshake twice'], [n, 'counted the knights'], [n * n, 'multiplied the knights by themselves'], [ans + 1, 'counting slip']].filter(([v]) => v !== ans),
        explain: `The first knight shakes ${pl(n - 1, 'hand')}. The second has ${pl(n - 2, 'new hand')} to shake, and so on: ${Array.from({ length: n - 1 }, (_, i) => n - 1 - i).join(' + ')} = ${ans}.` };
    }
    case 6: case 7: case 8: {
      let counts; do { counts = MARBLE_COLORS.slice(0, 3).map(() => rand(L === 8 ? 0 : 1, 6)); } while (new Set(counts).size < 3 || counts.reduce((a, b) => a + b, 0) < 5 || (L === 8 && counts.filter(c => c > 0).length < 2));
      const total = counts.reduce((a, b) => a + b, 0), visual = bagSvg(counts);
      if (L === 6) {
        const most = rng() < 0.6, val = most ? Math.max(...counts) : Math.min(...counts), i = counts.indexOf(val), ok = MARBLE_COLORS[i];
        return { ...base, visual, ask: `Without looking, which color are you ${most ? 'most' : 'least'} likely to pull out?`, speak: `You reach into the bag without looking. Which color are you ${most ? 'most' : 'least'} likely to pull out?`, ans: ok,
          choices: MARBLE_COLORS.slice(0, 3).map((c, j) => ({ v: c, ok: j === i, tag: most ? 'picked a color with fewer marbles' : 'picked a color with more marbles' })),
          explain: `There are ${counts.map((c, j) => `${c} ${MARBLE_COLORS[j]}`).join(', ')}. ${most ? 'More' : 'Fewer'} marbles means ${most ? 'more' : 'less'} likely: ${ok}.` };
      }
      if (L === 7) {
        const i = rand(0, 2), c = counts[i], ok = `${c} out of ${total}`;
        return { ...base, visual, ask: `What is the chance of pulling out a ${MARBLE_COLORS[i]} marble?`, speak: `What is the chance of pulling out a ${MARBLE_COLORS[i]} marble without looking?`, ans: ok,
          choices: pickChoices(ok, [[`${c} out of ${total - c}`, 'compared to the other marbles, not all of them'], [`${counts[(i + 1) % 3]} out of ${total}`, 'counted a different color'], [`1 out of ${total}`, 'counted only one marble'], [`${total} out of ${c}`, 'flipped the numbers']]),
          explain: `${c} of the ${total} marbles ${c === 1 ? 'is' : 'are'} ${MARBLE_COLORS[i]}, so the chance is ${c} out of ${total}.` };
      }
      // L8: certain, likely, unlikely, impossible
      const kind = pick(['impossible', 'certain', 'likely', 'unlikely']);
      let ask, ok;
      if (kind === 'impossible') { ask = `pulling out a yellow marble`; ok = 'Impossible'; }
      else if (kind === 'certain') { ask = `pulling out a red, blue or green marble`; ok = 'Certain'; }
      else {
        const i = [0, 1, 2].find(j => kind === 'likely' ? counts[j] * 2 > total : counts[j] > 0 && counts[j] * 2 < total);
        if (i == null) return genChance(8);
        ask = `pulling out a ${MARBLE_COLORS[i]} marble`; ok = kind === 'likely' ? 'Likely' : 'Unlikely';
      }
      return { ...base, visual, ask: `How likely is ${ask}?`, speak: `How likely is ${ask}? Certain, likely, unlikely or impossible?`, ans: ok, wordy: true,
        choices: ['Certain', 'Likely', 'Unlikely', 'Impossible'].map(v => ({ v, ok: v === ok, tag: 'mixed up how likely' })),
        explain: kind === 'impossible' ? 'There are no yellow marbles, so it cannot happen.' : kind === 'certain' ? 'Every marble is red, blue or green, so it must happen.' : `${counts.map((c, j) => `${c} ${MARBLE_COLORS[j]}`).join(', ')}: ${kind === 'likely' ? 'more than half' : 'fewer than half'} of the ${total} marbles.` };
    }
    default: { // two dice
      const s = rand(3, 11), ans = 6 - Math.abs(7 - s), ways = [];
      for (let r = 1; r <= 6; r++) { const b = s - r; if (b >= 1 && b <= 6) ways.push(`${r} + ${b}`); }
      return { ...base, story: `Roll a red die and a blue die. How many different ways can they add up to ${s}? (Red 1 and blue 2 is different from red 2 and blue 1.)`, ans,
        distract: [[Math.ceil(ans / 2), 'counted 1 + 2 and 2 + 1 as the same'], [s, 'gave the total'], [ans + 1, 'counting slip'], [ans - 1, 'counting slip']].filter(([v]) => v !== ans && v > 0),
        explain: `Red + blue: ${ways.join(', ')}. That is ${ans} ways.` };
    }
  }
}
