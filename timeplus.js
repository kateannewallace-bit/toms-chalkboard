/* ---------- Telling time 6–10: how much later, how long, the calendar ----------
   and Graphs 5–7: line plots.
   Elapsed time uses the winding clock from app.js, so the child can wind forward and watch
   both hands move. The calendar follows the Waldorf festival year. */

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const FESTIVALS = [['Candlemas', 1], ['May Day', 4], ["St. John's Day", 5], ['Michaelmas', 8], ['Martinmas', 10], ['Advent', 11]];
const EVENTS = ['harvest feast', 'puppet show', 'lantern walk', 'knights’ tournament', 'pixie market', 'Greek play', 'festival dance'];
// T is minutes after 12:00, wrapped onto the 12-hour clock
const tFmt = T => { T = ((T % 720) + 720) % 720; return `${Math.floor(T / 60) || 12}:${pad2(T % 60)}`; };
const tSay = T => { T = ((T % 720) + 720) % 720; const h = Math.floor(T / 60) || 12, m = T % 60; return m ? `${h} ${m < 10 ? 'oh ' : ''}${m}` : `${h} o'clock`; };
const tHr = T => Math.floor((((T % 720) + 720) % 720) / 60) || 12;
const mins = v => `${v} minutes`;

function laterWind(start, dur, durText) {
  const end = start + dur, eT = ((end % 720) + 720) % 720;
  return { skill: 'time', sub: 'later-wind', interactive: 'gear', target: { h: tHr(eT), m: eT % 60 }, setT: ((start % 720) + 720) % 720, ring: false,
    printVisual: clockSvg(null, 0, false), ask: `It is ${tFmt(start)}. Wind the clock ${durText} later.`, speak: `It is ${tSay(start)}. Wind the clock ${durText} later. What time will it be?`,
    ans: tFmt(end), choices: [{ v: tFmt(end), ok: true }],
    explain: `${tFmt(start)} and ${durText} more is ${tFmt(end)}.` };
}

function genTimePlus(L) {
  if (L === 6 || L === 7) {
    const start = rand(1, 11) * 60 + (L === 6 ? pick([0, 30]) : 5 * rand(0, 11));
    const dur = L === 6 ? 60 * rand(1, 4) : 5 * rand(2, 11), durText = L === 6 ? pl(dur / 60, 'hour') : `${dur} minutes`, end = start + dur;
    if (rng() < 0.5) return laterWind(start, dur, durText);
    const ev = pick(EVENTS), sh = Math.floor(start / 60), sm = start % 60;
    const traps = L === 6
      ? [[tFmt(start - dur), 'went backwards'], [tFmt(end + 60), 'counted one hour too many'], [tFmt(end - 60), 'counted one hour too few'], [tFmt(start + dur / 60), 'added to the minutes, not the hours']]
      : [[tFmt(end - 60), 'forgot the hour changes'], [tFmt(end + 60), 'moved the hour too far'], [tFmt(start - dur), 'went backwards'], [tFmt(end + 5), 'counted by fives wrong'], [tFmt(end - 5), 'counted by fives wrong']];
    const crosses = Math.floor(end / 60) !== sh;
    return { skill: 'time', sub: 'later', visual: clockSvg(sh, sm, false), story: `The ${ev} starts at ${tFmt(start)} and lasts ${durText}. What time does it end?`, ans: tFmt(end),
      choices: pickChoices(tFmt(end), traps.filter(([v]) => v !== tFmt(end))),
      explain: L === 6 ? `Count on ${pl(dur / 60, 'hour')} from ${tFmt(start)}: the short hand moves ${pl(dur / 60, 'number')}. It ends at ${tFmt(end)}.`
        : crosses ? `From ${tFmt(start)} it is ${60 - sm} minutes to ${tFmt((sh + 1) * 60)}. ${dur} − ${60 - sm} = ${dur - (60 - sm)} more minutes: ${tFmt(end)}.` : `${sm} + ${dur} = ${sm + dur} minutes past ${sh || 12}: ${tFmt(end)}.` };
  }
  if (L === 8) {
    const start = rand(1, 9) * 60 + 5 * rand(1, 11), dur = 5 * rand(4, 19), end = start + dur, sh = Math.floor(start / 60), sm = start % 60, eh = Math.floor(end / 60), em = end % 60;
    const ev = pick(EVENTS), next = (sh + 1) * 60;
    const explain = eh === sh ? `${em} − ${sm} = ${dur} minutes.` : `From ${tFmt(start)} to ${tFmt(next)} is ${next - start} minutes. From ${tFmt(next)} to ${tFmt(end)} is ${end - next} minutes. ${next - start} + ${end - next} = ${dur} minutes.`;
    return { skill: 'time', sub: 'how-long', story: `The ${ev} starts at ${tFmt(start)} and ends at ${tFmt(end)}. How many minutes long is it?`, ans: dur, fmt: mins,
      distract: [[(eh * 100 + em) - (sh * 100 + sm), 'treated an hour as 100 minutes'], [Math.abs(em - sm), 'only took away the minutes'], [dur + 60, 'counted an extra hour'], [dur + 5, 'counted by fives wrong'], [dur - 5, 'counted by fives wrong']].filter(([v]) => v > 0),
      explain: `${explain} Tip: count up to the next o'clock first.` };
  }
  if (L === 9) {
    const kind = rand(0, 3);
    if (kind === 0) {
      const d = rand(0, 6), k = rand(2, 6), back = rng() < 0.3, ok = DAYS[(d + (back ? -k : k) + 14) % 7];
      return { skill: 'time', sub: 'days', story: `Today is ${DAYS[d]}. What day ${back ? 'was it' : 'will it be'} ${k} days ${back ? 'ago' : 'from now'}?`, ans: ok,
        choices: pickChoices(ok, [[DAYS[(d + (back ? k : -k) + 14) % 7], back ? 'counted forward' : 'counted backwards'], [DAYS[(d + (back ? -k - 1 : k + 1) + 14) % 7], 'counted today as a day'], [DAYS[(d + (back ? -k + 1 : k - 1) + 14) % 7], 'counting slip']]),
        explain: `Count ${back ? 'back' : 'on'} ${k} days from ${DAYS[d]}: ${Array.from({ length: k }, (_, i) => DAYS[(d + (back ? -(i + 1) : i + 1) + 14) % 7]).join(', ')}.` };
    }
    if (kind === 1) {
      const m = rand(0, 11), k = rand(2, 5), ok = MONTHS[(m + k) % 12];
      return { skill: 'time', sub: 'months', story: `It is ${MONTHS[m]}. Which month will it be ${k} months from now?`, ans: ok,
        choices: pickChoices(ok, [[MONTHS[(m - k + 12) % 12], 'counted backwards'], [MONTHS[(m + k + 1) % 12], 'counting slip'], [MONTHS[(m + k - 1) % 12], 'counted this month too']]),
        explain: `Count on ${k} months from ${MONTHS[m]}: ${Array.from({ length: k }, (_, i) => MONTHS[(m + i + 1) % 12]).join(', ')}.` };
    }
    if (kind === 2) {
      let a, b; do { a = pick(FESTIVALS); b = pick(FESTIVALS); } while (a === b);
      const gap = (b[1] - a[1] + 12) % 12;
      return { skill: 'time', sub: 'festivals', story: `${a[0]} is in ${MONTHS[a[1]]}. ${b[0]} is in ${MONTHS[b[1]]}. How many months from ${a[0]} to the next ${b[0]}?`, ans: gap,
        distract: [[12 - gap, 'counted the other way round the year'], [gap + 1, 'counted both months'], [gap - 1, 'counting slip'], [b[1] + 1, 'gave the month number']].filter(([v]) => v > 0),
        explain: `Count the months on from ${MONTHS[a[1]]}: ${Array.from({ length: gap }, (_, i) => MONTHS[(a[1] + i + 1) % 12]).join(', ')}. That is ${gap}.` };
    }
    const w = rand(2, 5);
    return { skill: 'time', sub: 'weeks', story: `The knights ride for ${w} weeks to reach the dragon's mountain. How many days is that?`, ans: 7 * w,
      distract: [[7 + w, 'added instead of multiplying'], [5 * w, 'counted only school days'], [7 * w + 1, 'counting slip'], [7 * w - 1, 'counting slip'], [10 * w, 'used 10 days in a week']],
      explain: `A week has 7 days. ${w} × 7 = ${7 * w} days.` };
  }
  // a calendar page
  const mi = rand(0, 11), len = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][mi], first = rand(0, 6);
  const dayOf = n => (first + n - 1) % 7, kind = rand(0, 2), n = rand(2, len - 8);
  const visual = calendarHtml(MONTHS[mi], first, len);
  if (kind === 0) {
    const ok = DAYS[dayOf(n)];
    return { skill: 'time', sub: 'calendar', visual, ask: `What day of the week is ${MONTHS[mi]} ${n}?`, speak: `Look at the calendar. What day of the week is ${MONTHS[mi]} ${n}?`, ans: ok,
      choices: pickChoices(ok, [[DAYS[(dayOf(n) + 1) % 7], 'read the next column'], [DAYS[(dayOf(n) + 6) % 7], 'read the column before'], [DAYS[(dayOf(n) + 3) % 7], 'read the wrong column']]),
      explain: `Find ${n} on the calendar, then look up to the top of its column: ${ok}.` };
  }
  if (kind === 1) {
    return { skill: 'time', sub: 'calendar', visual, ask: `What date is one week after ${MONTHS[mi]} ${n}?`, speak: `Look at the calendar. What date is one week after ${MONTHS[mi]} ${n}?`, ans: n + 7,
      distract: [[n + 1, 'counted one day, not one week'], [n + 5, 'counted only school days'], [n + 6, 'counting slip'], [n + 8, 'counting slip'], [n - 7, 'went back a week']].filter(([v]) => v > 0),
      explain: `One week is 7 days, so go straight down one row: ${n} + 7 = ${n + 7}.` };
  }
  const want = rand(0, 6), count = Array.from({ length: len }, (_, i) => dayOf(i + 1)).filter(d => d === want).length;
  return { skill: 'time', sub: 'calendar', visual, ask: `How many ${DAYS[want]}s are in ${MONTHS[mi]}?`, speak: `Look at the calendar. How many ${DAYS[want]}s are in ${MONTHS[mi]}?`, ans: count,
    distract: [[count === 4 ? 5 : 4, 'counted the column wrong'], [7, 'gave the days in a week'], [count + 2, 'counting slip'], [3, 'counting slip']],
    explain: `Count down the ${DAYS[want]} column: there are ${count}.` };
}
function calendarHtml(month, first, len) {
  let cells = '<div class="cal-h">Su</div><div class="cal-h">Mo</div><div class="cal-h">Tu</div><div class="cal-h">We</div><div class="cal-h">Th</div><div class="cal-h">Fr</div><div class="cal-h">Sa</div>';
  cells += '<div></div>'.repeat(first);
  for (let d = 1; d <= len; d++) cells += `<div class="cal-d">${d}</div>`;
  return `<div class="cal" role="img" aria-label="calendar for ${month}"><div class="cal-title">${month}</div><div class="cal-grid">${cells}</div></div>`;
}

/* ---------- Graphs 5–7: line plots ---------- */
const PLOT_SETS = [
  { title: 'Sticks we found on the walk', noun: 'sticks', unit: 'inches', lo: 3 },
  { title: 'Feathers on the nature table', noun: 'feathers', unit: 'inches', lo: 2 },
  { title: 'Snails in the garden', noun: 'snails', unit: 'centimeters', lo: 1 },
  { title: 'Sunflowers by the fence', noun: 'sunflowers', unit: 'feet', lo: 4 },
  { title: 'Dragon teeth in the cave', noun: 'dragon teeth', unit: 'inches', lo: 5 },
];
function linePlot(set, counts, marks = true) {
  const n = counts.length, W = 360, x0 = 30, step = (W - 60) / (n - 1), top = Math.max(...counts, 3), H = 70 + top * 22, ay = H - 40;
  let s = `<line x1="${x0 - 14}" y1="${ay}" x2="${W - 16}" y2="${ay}" class="nl-axis"/>`;
  counts.forEach((c, i) => {
    const x = f1(x0 + i * step);
    s += `<line x1="${x}" y1="${ay - 6}" x2="${x}" y2="${ay + 6}" class="nl-tick"/><text x="${x}" y="${ay + 26}" text-anchor="middle" class="nl-num">${set.lo + i}</text>`;
    if (marks) for (let j = 0; j < c; j++) s += `<text x="${x}" y="${ay - 12 - j * 22}" text-anchor="middle" class="lp-x">X</text>`;
  });
  return `<div class="pg-title">${set.title} (${set.unit})</div><svg class="lineplot" viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="line plot">${s}</svg>`;
}
function genLinePlot(L) {
  const set = pick(PLOT_SETS);
  let counts; do { counts = Array.from({ length: 6 }, () => rand(0, 4)); } while (counts.reduce((a, b) => a + b, 0) < 7 || counts.filter(c => c === Math.max(...counts)).length > 1 || counts.filter(c => c > 0).length < 4);
  const total = counts.reduce((a, b) => a + b, 0), len = i => set.lo + i, visual = linePlot(set, counts);
  if (L === 5) {
    if (rng() < 0.6) {
      const i = rng() < 0.85 ? pick(counts.map((c, j) => c > 0 ? j : -1).filter(j => j >= 0)) : rand(0, 5);
      return { skill: 'graphs', sub: 'plot-read', visual, ask: `How many ${set.noun} are ${len(i)} ${set.unit} long?`, speak: `Each X is one of the ${set.noun}. How many are ${len(i)} ${set.unit} long?`, ans: counts[i],
        distract: [[len(i), 'gave the length, not how many'], [counts[(i + 1) % 6], 'read the wrong column'], [counts[i] + 1, 'counting slip'], [total, 'counted them all']],
        explain: `Count the X's above ${len(i)}: ${counts[i]}.` };
    }
    const top = counts.indexOf(Math.max(...counts));
    return { skill: 'graphs', sub: 'plot-most', visual, ask: `Which length is the most common?`, speak: `Which length has the most ${set.noun}?`, ans: len(top),
      distract: [[counts[top], 'gave how many, not the length'], [len((top + 1) % 6), 'picked the wrong column'], [len((top + 5) % 6), 'picked the wrong column'], [set.lo + 5, 'picked the longest']],
      explain: `The tallest stack of X's is above ${len(top)}, with ${counts[top]}.` };
  }
  if (L === 6) {
    const kind = rand(0, 2);
    if (kind === 0) {
      const v = rand(1, 3), cut = len(v), ans = counts.slice(v + 1).reduce((a, b) => a + b, 0);
      return { skill: 'graphs', sub: 'plot-more', visual, ask: `How many ${set.noun} are longer than ${cut} ${set.unit}?`, speak: `How many ${set.noun} are longer than ${cut} ${set.unit}?`, ans,
        distract: [[ans + counts[v], `counted the ${cut}s too`], [total - ans - counts[v], 'counted the shorter ones'], [ans + 1, 'counting slip'], [ans - 1, 'counting slip']].filter(([v2]) => v2 >= 0),
        explain: (t => `Count the X's to the right of ${cut}: ${t.length > 1 ? `${t.join(' + ')} = ${ans}` : `there ${ans === 1 ? 'is 1' : `are ${ans}`}`}.`)(counts.slice(v + 1).filter(Boolean)) };
    }
    if (kind === 1) return { skill: 'graphs', sub: 'plot-total', visual, ask: `How many ${set.noun} were measured in all?`, speak: `How many ${set.noun} were measured in all?`, ans: total,
      distract: [[6, 'counted the numbers on the line'], [total - 1, 'counting slip'], [total + 1, 'counting slip'], [Math.max(...counts), 'counted one stack']],
      explain: `Every X is one: ${counts.filter(Boolean).join(' + ')} = ${total}.` };
    const lo = counts.findIndex(c => c > 0), hi = 5 - [...counts].reverse().findIndex(c => c > 0), ans = hi - lo;
    return { skill: 'graphs', sub: 'plot-range', visual, ask: `How much longer is the longest than the shortest?`, speak: `How much longer is the longest of the ${set.noun} than the shortest?`, ans, fmt: v => `${v} ${set.unit}`,
      distract: [[5, 'used the ends of the line'], [len(hi), 'gave the longest'], [ans + 1, 'counted the marks, not the jumps'], [counts[hi] - counts[lo] > 0 ? counts[hi] - counts[lo] : 7, 'compared the stacks']].filter(([v]) => v !== ans && v >= 0),
      explain: `The longest is ${len(hi)} and the shortest is ${len(lo)}. ${len(hi)} − ${len(lo)} = ${ans} ${set.unit}.` };
  }
  // L7: read a list of measurements, then plot it
  const list = shuffle(counts.flatMap((c, j) => Array(c).fill(len(j)))), i = pick(counts.map((c, j) => c > 0 ? j : -1).filter(j => j >= 0));
  return { skill: 'graphs', sub: 'plot-make', q: `<div class="plot-list">${list.join(', ')}</div>`, visual: linePlot(set, counts, false), ask: `Make a line plot of these ${set.noun}. How many X's go above ${len(i)}?`,
    speak: `Here are the lengths: ${list.join(', ')}. How many X's go above ${len(i)}?`, ans: counts[i],
    distract: [[len(i), 'gave the length, not how many'], [counts[i] + 1, 'counting slip'], [list.length, 'counted every number'], [counts[(i + 1) % 6], 'counted a different length']],
    explain: `Count the ${len(i)}s in the list: there ${counts[i] === 1 ? 'is 1' : `are ${counts[i]}`}. So ${counts[i]} X${counts[i] === 1 ? ' goes' : '’s go'} above ${len(i)}.` };
}
