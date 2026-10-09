// All problem randomness goes through rng(), which makeProblem seeds so a missed problem can come back exactly.
let rng = Math.random;
function seeded(seed) { let t = seed >>> 0; return () => { t += 0x6D2B79F5; let r = Math.imul(t ^ (t >>> 15), 1 | t); r ^= r + Math.imul(r ^ (r >>> 7), 61 | r); return ((r ^ (r >>> 14)) >>> 0) / 4294967296; }; }
const newSeed = () => Math.floor(Math.random() * 2 ** 31);
const rand = (a, b) => a + Math.floor(rng() * (b - a + 1));
const pick = a => a[Math.floor(rng() * a.length)];
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const isSq = n => Number.isInteger(Math.sqrt(n));
const BOX = '<span class="box" aria-label="mystery number"></span>';
// The child's name, set on the grown-ups page. Stories fall back to "Pip" until a name is set.
const childName = () => (state.childName || '').trim();
const N = () => childName() || 'Pip';
const greet = s => childName() ? `${s}, ${childName()}!` : `${s}!`;

const SKILLS = {
  add:      { name: 'Adding',          levels: ['Sums to 10', 'Make a ten (8 + 7)', 'Two-digit + one-digit, carrying', 'Two-digit + two-digit, carrying', 'Three-digit + two-digit', 'Three-digit + three-digit', 'Four-digit adding'] },
  sub:      { name: 'Taking away',     levels: ['Within 10', 'Within 20', 'Two-digit − one-digit', 'Two-digit − two-digit, no borrowing', 'Two-digit with borrowing', 'Three-digit with borrowing'] },
  place:    { name: 'Place value',     levels: ['Tens and ones blocks', 'Hundreds, tens and ones blocks', 'Value of a digit', 'Expanded form (300 + 40 + 6)', 'Compare with > and <', 'Regrouping (13 tens)'] },
  patterns: { name: 'Counting patterns', levels: ['Skip-count by 5s and 10s', 'Even or odd?', 'Count by 10s and 100s from any number', 'Count back by 10s and 100s'] },
  arrays:   { name: 'Arrays',          levels: ['How many dots?', 'Match the number sentence', 'Bigger arrays', 'Equal rows (first sharing)'] },
  money:    { name: 'Money',           levels: ['Pennies, nickels and dimes', 'Add quarters', 'Coins and dollars', 'Money stories'] },
  time:     { name: 'Telling time',    levels: ["O'clock", 'Half past', 'Quarter past and quarter to', 'Five-minute times'] },
  measure:  { name: 'Measuring',       levels: ['Measure with a ruler', "Ruler that doesn't start at 0", 'How much longer?', 'Length stories'] },
  graphs:   { name: 'Graphs',          levels: ['Picture graphs', 'Bar graphs', 'How many more?', 'How many in all?'] },
  shapes:   { name: 'Shapes',          levels: ['Count the sides', 'Name the shape', 'Halves, thirds and fourths', 'More sides and equal parts'] },
  words:    { name: 'Story problems',  levels: ['Adding and taking away to 20', 'Two-digit stories', 'Groups and rows', 'Two steps and sharing'] },
  times:    { name: 'Times tables',    levels: ['×1, ×2, ×5, ×10', '×3 and ×4', 'Up to 10 × 10', 'Up to 12 × 12', 'Bigger facts (×11 to ×25)', 'Two-digit × one-digit (23 × 4)'] },
  missing:  { name: 'Mystery number',  levels: ['☐ + 3 = 7', 'Mystery number to 20', '☐ × 4 = 20', 'Two steps: 2 × ☐ + 1 = 9', 'Letters for numbers (n + 7 = 15)'] },
  squares:  { name: 'Squares & roots', levels: ['Square numbers to 5 × 5', 'Square numbers to 10 × 10', 'Spot the square number', 'Square roots with blocks (to 10 × 10)', 'Odd numbers build squares', 'Square roots to 12 × 12', 'Squares to 15 × 15 (split into parts)', 'Square roots to 15 × 15', 'Squares to 19 × 19', 'Square roots to 19 × 19', '★ Root detective: the clues', '★ Root detective: solve it (to 30 × 30)'] },
  negatives: { name: 'Below zero',     levels: ['Frog jumps past zero', 'Take away past zero (3 − 5)', 'Start below zero (−4 + 6)', 'Cold-weather stories'] },
  bignums:  { name: 'Big numbers',     levels: ['Thousands blocks', 'Value of a digit to 9,999', 'Value of a digit to 999,999', 'Compare big numbers', 'Listen and find the number'] },
};
const GROUPS = [
  { title: '2nd grade', note: "Following Khan Academy's 2nd grade units", keys: ['add', 'sub', 'place', 'patterns', 'arrays', 'money', 'time', 'measure', 'graphs', 'shapes', 'words'] },
  { title: 'Beyond 2nd grade', note: '', keys: ['times', 'missing', 'squares', 'negatives', 'bignums'] },
];
const ORDER = Object.keys(SKILLS);
const GOAL_SIZES = [25, 50, 100];
// The goal tally can follow any topic. Each topic keeps its own count, so switching goals loses nothing.
const goalSkill = () => SKILLS[state.goal.skill] ? state.goal.skill : 'arrays';
const goalDone = () => Math.max(0, (state.done[goalSkill()] || 0) - (state.goalBase[goalSkill()] || 0));
const goalMet = () => goalDone() >= state.goal.target;

function defaultState() {
  return {
    levels: { add: 4, sub: 2, place: 2, patterns: 1, arrays: 2, money: 1, time: 1, measure: 1, graphs: 1, shapes: 1, words: 2, times: 4, missing: 1, squares: 1, negatives: 1, bignums: 1 }, squaresV2: true,
    on: { add: true, sub: true, place: true, patterns: false, arrays: true, money: true, time: true, measure: false, graphs: false, shapes: false, words: true, times: true, missing: false, squares: false, negatives: false, bignums: false },
    rec: {}, slips: {}, sessions: [], log: [],
    cards: [], stretch: {}, mastered: {}, cleared: 0,
    worlds: { hunter: true, knights: true, pixies: true, tailypo: true, greek: true, egypt: true, shakespeare: true, nature: true }, seasonal: true,
    cast: { friends: 'Fu Dog, Cool Dracula', villains: 'the Death Raccoon' },
    done: {}, goal: { skill: 'arrays', target: 50 }, goalBase: {}, total: 0, perSession: 10, voice: 'stories', answerMode: 'choose', narrator: 'tr', updatedAt: 0,
  };
}
function normalize(s) {
  const d = defaultState(), raw = s || {};
  const oldSquares = raw.levels && !raw.squaresV2;
  s = Object.assign(d, raw);
  s.levels = Object.assign(defaultState().levels, s.levels);
  s.on = Object.assign(defaultState().on, s.on);
  s.worlds = Object.assign(defaultState().worlds, s.worlds);
  s.cast = Object.assign(defaultState().cast, s.cast);
  // squares used to have 5 levels; map them onto the new 12-level path
  if (oldSquares) {
    const map = { 1: 2, 2: 3, 3: 4, 4: 6, 5: 5 };
    if (s.levels.squares) s.levels.squares = map[s.levels.squares] || 1;
    (s.cards || []).forEach(c => { if (c.skill === 'squares') c.level = map[c.level] || 1; });
    s.squaresV2 = true;
  }
  // older saves had an on/off read-aloud switch
  if (s.readAloud != null) { s.voice = s.readAloud ? 'all' : 'stories'; delete s.readAloud; }
  // older saves only counted arrays
  if (s.arraysDone != null) { s.done.arrays = Math.max(s.done.arrays || 0, s.arraysDone); delete s.arraysDone; }
  return s;
}

/* ---------- storage: this device first, Supabase sync when a sync code is set ---------- */
const LS_KEY = 'toms-chalkboard-v1';
const CODE_KEY = 'toms-chalkboard-sync-code';
const CFG = window.CHALKBOARD_CONFIG || {};
const syncAvailable = !!(CFG.supabaseUrl && CFG.supabaseKey && window.crypto?.subtle);
function loadLocal() { try { const t = localStorage.getItem(LS_KEY); return t ? JSON.parse(t) : null; } catch (e) { return null; } }
function saveLocal() { try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch (e) {} }
let state = normalize(loadLocal());
const sync = { code: '', key: '', status: 'off', lastAt: 0, saving: false, dirty: false, error: '' };
try { sync.code = localStorage.getItem(CODE_KEY) || ''; } catch (e) {}

const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
function newCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  const raw = [...bytes].map(b => CODE_ALPHABET[b % CODE_ALPHABET.length]).join('');
  return `${raw.slice(0, 4)}-${raw.slice(4, 8)}-${raw.slice(8)}`;
}
function cleanCode(c) {
  const raw = String(c).toUpperCase().replace(/[^A-Z0-9]/g, '');
  return raw.length === 12 ? `${raw.slice(0, 4)}-${raw.slice(4, 8)}-${raw.slice(8)}` : '';
}
async function keyFor(code) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('toms-chalkboard:' + code));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}
async function rpc(fn, body) {
  const res = await fetch(`${CFG.supabaseUrl}/rest/v1/rpc/${fn}`, {
    method: 'POST',
    // New-style publishable keys (sb_publishable_…) go only in the apikey header; legacy anon JWTs also go in Authorization.
    headers: Object.assign({ apikey: CFG.supabaseKey, 'Content-Type': 'application/json' }, CFG.supabaseKey.startsWith('sb_') ? {} : { Authorization: `Bearer ${CFG.supabaseKey}` }),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${fn} failed (${res.status})`);
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}
async function pushRemote() {
  if (!sync.key) return;
  if (sync.saving) { sync.dirty = true; return; }
  sync.saving = true;
  try { await rpc('chalkboard_save', { p_key: sync.key, p_data: state }); sync.status = 'ok'; sync.lastAt = Date.now(); sync.error = ''; }
  catch (e) { sync.status = 'error'; sync.error = navigator.onLine === false ? 'offline' : String(e.message || e); }
  sync.saving = false;
  if (screen === 'parent') render();
  if (sync.dirty) { sync.dirty = false; pushRemote(); }
}
async function pullRemote() {
  if (!sync.key) return;
  try {
    const remote = await rpc('chalkboard_get', { p_key: sync.key });
    sync.status = 'ok'; sync.lastAt = Date.now(); sync.error = '';
    if (remote && (remote.updatedAt || 0) > (state.updatedAt || 0)) {
      state = normalize(remote);
      saveLocal();
    } else if (!remote || (state.updatedAt || 0) > (remote.updatedAt || 0)) pushRemote();
  } catch (e) { sync.status = 'error'; sync.error = navigator.onLine === false ? 'offline' : String(e.message || e); }
  if (screen === 'home' || screen === 'parent') render();
}
async function startSync(code) {
  sync.code = code;
  try { localStorage.setItem(CODE_KEY, code); } catch (e) {}
  sync.key = await keyFor(code);
  sync.status = 'syncing';
  await pullRemote();
}
function stopSync() {
  sync.code = ''; sync.key = ''; sync.status = 'off';
  try { localStorage.removeItem(CODE_KEY); } catch (e) {}
}
function save() { state.updatedAt = Date.now(); saveLocal(); pushRemote(); }
function initSync() {
  if (!syncAvailable) return;
  if (sync.code) startSync(sync.code);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') pullRemote(); });
  window.addEventListener('online', () => pullRemote());
}

/* ---------- speech ---------- */
const canSpeak = 'speechSynthesis' in window;
const VOICE_KEY = 'toms-chalkboard-voice';
let voices = [];
function loadVoices() {
  try { voices = speechSynthesis.getVoices().filter(v => /^en/i.test(v.lang)); } catch (e) { voices = []; }
  if (screen === 'parent') render();
}
function savedVoiceName() { try { return localStorage.getItem(VOICE_KEY) || ''; } catch (e) { return ''; } }
const TR_VOICES = ['Daniel', 'Arthur', 'Fred', 'Ralph', 'Aaron', 'Alex', 'Tom', 'Evan', 'Nathan', 'Google UK English Male', 'Microsoft Guy', 'Microsoft David'];
const NICE_VOICES = ['Samantha', 'Ava', 'Karen', 'Moira', 'Serena', 'Google US English', 'Microsoft Aria', 'Microsoft Jenny'];
function chosenVoice() {
  const name = savedVoiceName();
  const exact = name && voices.find(v => v.name === name);
  if (exact) return exact;
  const prefs = state.narrator === 'tr' ? TR_VOICES : NICE_VOICES;
  const score = v => (/enhanced|premium|natural/i.test(v.name) ? 0 : 1);
  for (const p of prefs) {
    const hits = voices.filter(v => v.name.startsWith(p)).sort((a, b) => score(a) - score(b));
    if (hits.length) return hits[0];
  }
  return null;
}
function say(t, colonel) {
  if (!canSpeak || !t) return;
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(t), v = chosenVoice();
    if (v) { u.voice = v; u.lang = v.lang; }
    if (colonel && tr()) { u.rate = 0.95; u.pitch = 0.72; } else { u.rate = 0.88; u.pitch = 1.05; }
    speechSynthesis.speak(u);
  } catch (e) {}
}
const tr = () => state.narrator === 'tr';
/* Public-domain photos, Library of Congress via Wikimedia Commons (all 1910) */
const TR_PHOTOS = [
  { src: 'tr/laugh.jpg', alt: 'Theodore Roosevelt laughing, 1910' },
  { src: 'tr/laugh-closeup.jpg', alt: 'Theodore Roosevelt laughing, close up, 1910' },
  { src: 'tr/grin.jpg', alt: 'Theodore Roosevelt grinning, 1910' },
  { src: 'tr/laughing-together.jpg', alt: 'Theodore Roosevelt laughing with a man in uniform, 1910' },
  { src: 'tr/automobile.jpg', alt: 'Theodore Roosevelt smiling from an automobile, 1910' },
];
function nextPhoto() {
  let last = -1;
  try { last = +(localStorage.getItem('toms-chalkboard-photo') ?? -1); } catch (e) {}
  let i;
  do { i = Math.floor(rng() * TR_PHOTOS.length); } while (i === last && TR_PHOTOS.length > 1);
  try { localStorage.setItem('toms-chalkboard-photo', String(i)); } catch (e) {}
  return TR_PHOTOS[i];
}
const spoken = s => String(s).replace(/×/g, ' times ').replace(/−/g, ' minus ').replace(/\+/g, ' plus ').replace(/=/g, ' equals ').replace(/√/g, 'the square root of ');

/* ---------- visuals ---------- */
function column(a, b, op) {
  const A = String(a), B = String(b), w = Math.max(A.length, B.length);
  const line = (s, lead) => `<span class="cc op">${lead}</span>` + [...s.padStart(w, ' ')].map(ch => `<span class="cc">${ch.trim()}</span>`).join('');
  return `<div class="column" style="--w:${w + 1}" aria-label="${a} ${{ '+': 'plus', '−': 'minus', '×': 'times' }[op]} ${b}">${line(A, '')}${line(B, op)}<span class="rule"></span></div>`;
}
function dots(r, c) {
  const d = c > 7 || r > 7 ? 22 : 30, g = d > 24 ? 10 : 8;
  let h = '';
  for (let i = 0; i < r; i++) for (let j = 0; j < c; j++) h += `<i class="${i % 2 ? 'alt' : ''}"></i>`;
  return `<div class="dots" style="--c:${c};--d:${d}px;--g:${g}px" aria-label="${r} rows of ${c} dots">${h}</div>`;
}
function blocks(n) {
  const d = n > 6 ? 20 : 28;
  return `<div class="blocks" style="--c:${n};--d:${d}px" aria-label="a square of ${n} by ${n} blocks">${'<i></i>'.repeat(n * n)}</div>`;
}

/* ---------- problem generators ---------- */
function genAdd(L) {
  let a, b;
  if (L === 1) { a = rand(1, 9); b = rand(1, 10 - a); }
  else if (L === 2) { do { a = rand(2, 9); b = rand(2, 9); } while (a + b <= 10); }
  else if (L === 3) { do { a = rand(11, 89); b = rand(2, 9); } while ((a % 10) + b < 10); }
  else if (L === 4) { do { a = rand(11, 89); b = rand(11, 89); } while ((a % 10) + (b % 10) < 10); }
  else if (L === 5) { do { a = rand(101, 899); b = rand(11, 99); } while ((a % 10) + (b % 10) < 10); }
  else if (L === 6) { do { a = rand(101, 599); b = rand(101, 399); } while ((a % 10) + (b % 10) < 10); }
  else { do { a = rand(1001, 5999); b = rand(1001, 3999); } while ((a % 10) + (b % 10) < 10); }
  const ans = a + b, au = a % 10, bu = b % 10;
  const d = [];
  if (L >= 3) d.push([ans - 10, 'forgot to carry']);
  if (L >= 5) d.push([ans - 100, 'forgot to carry']);
  if (L >= 7) d.push([ans - 1000, 'forgot to carry']);
  d.push([ans + 10, 'off by ten'], [ans + 1, 'counting slip'], [ans - 1, 'counting slip']);
  let explain = `${a} + ${b} = ${ans}`;
  if (L === 2) explain = `${a} + ${10 - a} makes 10, then ${b - (10 - a)} more makes ${ans}.`;
  if (L >= 3) explain = `Ones first: ${au} + ${bu} = ${au + bu}. Write ${(au + bu) % 10}, carry 1 ten. ${a} + ${b} = ${ans}`;
  const useBlocks = (L === 3 || L === 4) && rng() < 0.5;
  const visual = L === 2 ? tenFrames(a, b, 'add') : useBlocks ? pvSvg([a, b], 2) : L >= 3 ? column(a, b, '+') : null;
  return { skill: 'add', q: L >= 3 && !useBlocks ? null : `${a} + ${b}`, visual, speak: `${a} plus ${b}`, ans, distract: d, explain: useBlocks ? `${au} + ${bu} = ${au + bu} ones. Trade 10 ones for a ten. ${a} + ${b} = ${ans}` : explain };
}
function genSub(L) {
  let a, b;
  if (L === 1) { a = rand(3, 10); b = rand(1, a - 1); }
  else if (L === 2) { a = rand(11, 20); b = rand(2, 9); }
  else if (L === 3) { do { a = rand(21, 99); b = rand(1, 9); } while (b > a % 10); }
  else if (L === 4) { do { a = rand(30, 99); b = rand(11, a - 10); } while (b % 10 > a % 10); }
  else if (L === 5) { do { a = rand(31, 98); b = rand(12, a - 10); } while (!(a % 10 < b % 10)); }
  else { do { a = rand(300, 999); b = rand(101, a - 60); } while (!(a % 10 < b % 10)); }
  const ans = a - b, au = a % 10, bu = b % 10;
  const d = [];
  if (L >= 5) d.push([[...String(a)].reverse().reduce((t, ch, i) => t + Math.abs(+ch - +(String(b).padStart(String(a).length, '0')[String(a).length - 1 - i])) * 10 ** i, 0), 'took the small digit from the big one']);
  d.push([a + b, 'added instead of taking away'], [ans + 1, 'counting slip'], [ans - 1, 'counting slip'], [ans + 10, 'off by ten']);
  const explain = L >= 5 ? `Not enough ones to take ${bu} from ${au}, so borrow a ten: ${au + 10} − ${bu} = ${au + 10 - bu}. ${a} − ${b} = ${ans}` : `${a} − ${b} = ${ans}`;
  const frames = L <= 2 && rng() < 0.5;
  return { skill: 'sub', q: L >= 4 ? null : `${a} − ${b}`, visual: L >= 4 ? column(a, b, '−') : frames ? tenFrames(a, b, 'sub') : null, speak: `${a} minus ${b}`, ans, distract: d, explain };
}
function genTimes(L) {
  let a, b;
  if (L === 1) { a = pick([1, 2, 5, 10]); b = rand(1, 10); }
  else if (L === 2) { a = pick([3, 4]); b = rand(1, 10); }
  else if (L === 3) { a = rand(2, 10); b = rand(2, 10); }
  else if (L === 4) { a = rand(2, 12); b = rand(2, 12); }
  else if (L === 5) { a = pick([11, 12, 15, 20, 25]); b = rand(2, 12); }
  else {
    a = rand(13, 49); b = rand(3, 9);
    if (a % 10 === 0) a++;
    const t = Math.floor(a / 10), o = a % 10, ans = a * b;
    return { skill: 'times', visual: column(a, b, '×'), speak: `${a} times ${b}`, ans,
      distract: [[t * b * 10 + (o * b) % 10, 'forgot to carry'], [t * b * 10, 'only multiplied the tens'], [t * 10 + o * b, 'only multiplied the ones'], [ans + 10, 'off by ten'], [ans - 10, 'off by ten']],
      explain: `${t * 10} × ${b} = ${t * 10 * b} and ${o} × ${b} = ${o * b}. ${t * 10 * b} + ${o * b} = ${ans}` };
  }
  if (rng() < 0.5) [a, b] = [b, a];
  const ans = a * b;
  return {
    skill: 'times', q: `${a} × ${b}`, speak: `${a} times ${b}`, ans,
    distract: [[a + b, 'added instead of multiplied'], [a * (b + 1), 'next fact over'], [a * (b - 1), 'next fact over'], [(a + 1) * b, 'next fact over'], [ans + 10, 'off by ten']],
    explain: `${a} groups of ${b}: ${a} × ${b} = ${ans}`,
  };
}
function genArrays(L) {
  if (L === 2) {
    const r = rand(2, 6), c = rand(2, 6);
    const ok = `${r} × ${c}`;
    return {
      skill: 'arrays', ask: 'Which number sentence matches the dots?', visual: dots(r, c),
      speak: 'Which number sentence matches the dots? Count the rows, then count how many are in each row.', ans: ok,
      choices: [{ v: ok, ok: true }, { v: `${r} + ${c}`, tag: 'added instead of multiplied' }, { v: `${r} × ${c + 1}`, tag: 'miscounted a row' }, { v: `${r + 1} × ${c}`, tag: 'miscounted the rows' }],
      explain: `${r} rows with ${c} in each row: ${r} × ${c} = ${r * c}`,
    };
  }
  if (L === 4) {
    const r = rand(2, 5), c = rand(2, 6), N = r * c;
    return {
      skill: 'arrays', story: `${N} dots are shared into ${r} equal rows. How many dots are in each row?`, visual: dots(r, c), ans: c,
      distract: [[r, 'picked the number of rows'], [N - r, 'took away instead of sharing'], [c + 1, 'counting slip'], [c - 1, 'counting slip']],
      explain: `${r} × ${c} = ${N}, so ${N} shared into ${r} rows is ${c} in each row.`,
    };
  }
  const r = L === 1 ? rand(2, 5) : rand(3, 9), c = L === 1 ? rand(2, 5) : rand(4, 10), N = r * c;
  return {
    skill: 'arrays', ask: 'How many dots?', visual: dots(r, c), speak: 'How many dots are there? Try counting the rows.', ans: N,
    distract: [[N + c, 'miscounted a row'], [N - c, 'miscounted a row'], [r + c, 'added instead of multiplied'], [N + 1, 'counting slip']],
    explain: `${r} rows of ${c}: ${r} × ${c} = ${N}`,
  };
}
function genMissing(L) {
  if (L === 5) {
    const N = '<em class="var">n</em>', kind = rand(0, 2);
    if (kind === 0) { const a = rand(6, 29), x = rand(4, 30), s = a + x; return { skill: 'missing', q: `${N} + ${a} = ${s}`, ask: 'What number is n?', speak: `n plus ${a} equals ${s}. What number is n?`, ans: x, distract: [[s + a, 'added the numbers'], [x + 1, 'counting slip'], [x - 1, 'counting slip'], [x + 10, 'off by ten']], explain: `n is ${x}, because ${x} + ${a} = ${s}.` }; }
    if (kind === 1) { const a = rand(5, 25), r = rand(4, 30), x = a + r; return { skill: 'missing', q: `${N} − ${a} = ${r}`, ask: 'What number is n?', speak: `n minus ${a} equals ${r}. What number is n?`, ans: x, distract: [[r - a < 0 ? r + 1 : r - a, 'took away instead of adding back'], [x + 1, 'counting slip'], [x - 1, 'counting slip'], [x + 10, 'off by ten']], explain: `n is ${x}, because ${x} − ${a} = ${r}.` }; }
    const a = rand(3, 12), x = rand(3, 12), p = a * x;
    return { skill: 'missing', q: `${a} × ${N} = ${p}`, ask: 'What number is n?', speak: `${a} times n equals ${p}. What number is n?`, ans: x, distract: [[p - a, 'took away instead'], [x + 1, 'next fact over'], [x - 1, 'next fact over'], [p, 'copied the total']], explain: `n is ${x}, because ${a} × ${x} = ${p}.` };
  }
  if (L === 1 || (L === 2 && rng() < 0.5)) {
    const s = L === 1 ? rand(3, 10) : rand(11, 20), a = L === 1 ? rand(1, s - 1) : rand(2, 9), x = s - a;
    const first = rng() < 0.5;
    return {
      skill: 'missing', q: first ? `${BOX} + ${a} = ${s}` : `${a} + ${BOX} = ${s}`, speak: `What number plus ${a} makes ${s}?`, ans: x,
      distract: [[s + a, 'added the numbers'], [x + 1, 'counting slip'], [x - 1, 'counting slip'], [s, 'copied the total']],
      explain: first ? `${x} + ${a} = ${s}` : `${a} + ${x} = ${s}`,
    };
  }
  if (L === 2) {
    const s = rand(11, 20), x = rand(2, 9), r = s - x;
    return {
      skill: 'missing', q: `${s} − ${BOX} = ${r}`, speak: `${s} minus what number leaves ${r}?`, ans: x,
      distract: [[s + r, 'added the numbers'], [x + 1, 'counting slip'], [x - 1, 'counting slip'], [r, 'copied a number']],
      explain: `${s} − ${x} = ${r}`,
    };
  }
  if (L === 3) {
    const a = rand(2, 10), x = rand(2, 10), p = a * x;
    return {
      skill: 'missing', q: `${BOX} × ${a} = ${p}`, speak: `What number times ${a} makes ${p}?`, ans: x,
      distract: [[p - a, 'took away instead'], [x + 1, 'next fact over'], [x - 1, 'next fact over'], [p, 'copied the total']],
      explain: `${x} × ${a} = ${p}`,
    };
  }
  const m = rand(2, 5), x = rand(2, 9), k = rand(1, 9), t = m * x + k;
  return {
    skill: 'missing', q: `${m} × ${BOX} + ${k} = ${t}`, speak: `${m} times what number, plus ${k}, makes ${t}?`, ans: x,
    distract: [[t - k, 'stopped after one step'], [x + 1, 'counting slip'], [x - 1, 'counting slip'], [t - m, 'took away instead']],
    explain: `${t} − ${k} = ${t - k}, and ${m} × ${x} = ${t - k}. So the mystery number is ${x}.`,
  };
}
// Squares build up gradually to 19 × 19, then a stretch "root detective" method for finding square roots.
function genSquares(L) {
  const mostly = (lo, hi, oLo, oHi) => rng() < 0.7 ? rand(lo, hi) : rand(oLo, oHi);
  switch (L) {
    case 1: return sqNumber(rand(2, 5));
    case 2: return sqNumber(rand(2, 10));
    case 3: return sqSpot();
    case 4: return sqRoot(rand(2, 10), 'blocks');
    case 5: return genOddSquares();
    case 6: return sqRoot(mostly(9, 12, 2, 8), 'none');
    case 7: return sqBig(rand(11, 15));
    case 8: return sqRoot(rand(11, 15), rng() < 0.5 ? 'area' : 'none');
    case 9: return sqBig(mostly(16, 19, 11, 15));
    case 10: return sqRoot(mostly(16, 19, 11, 15), rng() < 0.4 ? 'area' : 'none');
    case 11: return rootClue();
    default: return rootSolve();
  }
}
function sqNumber(n) {
  return {
    skill: 'squares', q: `${n} × ${n}`, visual: blocks(n), speak: `${n} times ${n}`, ans: n * n,
    distract: [[n * 2, 'doubled instead'], [n * n + n, 'one row too many'], [n * n - n, 'one row too few'], [n * n + 1, 'counting slip']],
    explain: `${n} × ${n} = ${n * n}. ${n * n} makes a perfect square.`,
  };
}
function sqSpot() {
  const n = rand(2, 10), sq = n * n;
  const pool = shuffle([sq - 1, sq + 1, sq + 2, sq - 2, n * (n + 1), n * 2, sq + n, sq + 3].filter(v => v > 2 && !isSq(v)));
  const wrong = [...new Set(pool)].slice(0, 3);
  return {
    skill: 'squares', ask: 'Which one is a square number?', speak: 'Which one is a square number? It can make a perfect square of blocks.', ans: sq,
    choices: [{ v: sq, ok: true }, ...wrong.map(v => ({ v, tag: 'picked a non-square' }))],
    explain: `${sq} = ${n} × ${n}, so it makes a perfect square.`,
  };
}
function sqRoot(n, vis) {
  const sq = n * n, u = n % 10, twin = n > 10 && u && u !== 5 ? Math.floor(n / 10) * 10 + (10 - u) : null;
  const d = [[n * 2, 'doubled instead'], [sq, 'copied the number'], [n + 1, 'counting slip'], [n - 1, 'counting slip']];
  if (twin) d.unshift([twin, 'picked the wrong ending']);
  return {
    skill: 'squares', q: `√${sq}`, ask: vis === 'area' ? `This square has ${sq} blocks. How long is each side?` : `Which number times itself makes ${sq}?`,
    visual: vis === 'blocks' ? blocks(n) : vis === 'area' ? mysterySquare(sq) : null,
    speak: `What is the square root of ${sq}? Which number times itself makes ${sq}?`, ans: n, distract: d,
    explain: `${n} × ${n} = ${sq}, so √${sq} = ${n}`,
  };
}
// 13 × 13 as an area model: 10 × 10, 10 × 3, 3 × 10 and 3 × 3
function sqBig(n) {
  const k = n - 10, sq = n * n;
  return {
    skill: 'squares', q: `${n} × ${n}`, visual: areaSvg(n), ask: 'Add up the four parts.', speak: `${n} times ${n}. Split it into 10 and ${k}, then add up the four parts.`, ans: sq,
    distract: [[100 + k * k, 'forgot the middle parts'], [100 + 10 * k + k * k, 'counted a middle part once'], [n * 2, 'doubled instead'], [sq + 10, 'off by ten'], [sq - 10, 'off by ten']],
    explain: `10 × 10 = 100, 10 × ${k} = ${10 * k} twice, ${k} × ${k} = ${k * k}. 100 + ${10 * k} + ${10 * k} + ${k * k} = ${sq}`,
  };
}
function areaSvg(n) {
  const k = n - 10, u = 13, A = 10 * u, B = k * u, pad = 26, W = pad + A + B + 6;
  const lab = (x, y, w, h, t, cls) => (w >= 46 && h >= 22 ? `<text x="${x + w / 2}" y="${y + h / 2 + 5}" text-anchor="middle" class="area-lab ${cls}">${t}</text>` : '');
  const grid = (x, y, w, h) => { let d = ''; for (let i = u; i < w; i += u) d += `M${x + i} ${y}v${h}`; for (let j = u; j < h; j += u) d += `M${x} ${y + j}h${w}`; return `<path d="${d}" class="area-grid"/>`; };
  const x0 = pad, y0 = pad;
  let s = '';
  s += `<rect x="${x0}" y="${y0}" width="${A}" height="${A}" class="area a1"/>${grid(x0, y0, A, A)}${lab(x0, y0, A, A, '10 × 10', 'dark')}`;
  s += `<rect x="${x0 + A}" y="${y0}" width="${B}" height="${A}" class="area a2"/>${grid(x0 + A, y0, B, A)}${lab(x0 + A, y0, B, A, `10 × ${k}`, 'dark')}`;
  s += `<rect x="${x0}" y="${y0 + A}" width="${A}" height="${B}" class="area a2"/>${grid(x0, y0 + A, A, B)}${lab(x0, y0 + A, A, B, `${k} × 10`, 'dark')}`;
  s += `<rect x="${x0 + A}" y="${y0 + A}" width="${B}" height="${B}" class="area a3"/>${grid(x0 + A, y0 + A, B, B)}${lab(x0 + A, y0 + A, B, B, `${k} × ${k}`, 'dark')}`;
  s += `<text x="${x0 + A / 2}" y="${y0 - 8}" text-anchor="middle" class="area-edge">10</text><text x="${x0 + A + B / 2}" y="${y0 - 8}" text-anchor="middle" class="area-edge">${k}</text>`;
  s += `<text x="${x0 - 8}" y="${y0 + A / 2 + 5}" text-anchor="end" class="area-edge">10</text><text x="${x0 - 8}" y="${y0 + A + B / 2 + 5}" text-anchor="end" class="area-edge">${k}</text>`;
  return `<svg class="areamodel" viewBox="0 0 ${W} ${W}" width="${Math.round(W * 1.15)}" role="img" aria-label="${n} by ${n} square split into 10 and ${k}">${s}</svg>`;
}
function mysterySquare(sq) {
  return `<svg class="areamodel" viewBox="0 0 200 200" width="200" role="img" aria-label="a square made of ${sq} blocks"><rect x="30" y="30" width="150" height="150" class="area a1"/><text x="105" y="114" text-anchor="middle" class="area-big">${sq}</text><text x="105" y="20" text-anchor="middle" class="area-edge">?</text><text x="16" y="111" text-anchor="middle" class="area-edge">?</text></svg>`;
}

/* Root detective: the classic way to find a square root in your head.
   1. Find the tens (10 × 10 = 100, 20 × 20 = 400 ...)  2. The last digit gives two choices  3. Try one and check. */
const ENDINGS = { 1: '1 or 9', 4: '2 or 8', 9: '3 or 7', 6: '4 or 6', 5: '5', 0: '0' };
function recipeCard(step) {
  const steps = ['Find the tens', 'Check the last digit', 'Try it and check'];
  return `<ol class="recipe">${steps.map((t, i) => `<li class="${step === i + 1 || step === 0 ? 'on' : ''}">${t}</li>`).join('')}</ol>`;
}
const tensRef = () => `<div class="sqref">${[10, 20, 30].map(t => `<span>${t} × ${t} = ${t * t}</span>`).join('')}</div>`;
const endingRef = () => `<div class="sqref">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(d => `<span>${d} × ${d} = ${d * d}</span>`).join('')}</div>`;
function detectiveRoot() { let n; do { n = rand(11, 29); } while (n % 10 === 0); return n; }
function rootClue() {
  const n = detectiveRoot(), sq = n * n, t = Math.floor(n / 10) * 10;
  if (rng() < 0.5) {
    const opts = [[0, 10], [10, 20], [20, 30], [30, 40]];
    return {
      skill: 'squares', q: `√${sq}`, visual: recipeCard(1) + tensRef(), ask: 'Step 1: which tens is it between?',
      speak: `Root detective, step 1. The square root of ${sq} is between which two tens?`, ans: `${t} and ${t + 10}`,
      choices: opts.map(([a, b]) => ({ v: `${a} and ${b}`, ok: a === t, tag: 'picked the wrong tens' })),
      explain: `${t} × ${t} = ${t * t} and ${t + 10} × ${t + 10} = ${(t + 10) ** 2}. ${sq} is in between, so √${sq} is between ${t} and ${t + 10}.`,
    };
  }
  const last = sq % 10, ok = ENDINGS[last];
  const others = shuffle(Object.values(ENDINGS).filter(v => v !== ok)).slice(0, 3);
  return {
    skill: 'squares', q: `√${sq}`, visual: recipeCard(2) + endingRef(), ask: `Step 2: ${sq} ends in ${last}. The root must end in…`,
    speak: `Root detective, step 2. ${sq} ends in ${last}. Look at the table: which numbers times themselves end in ${last}?`, ans: ok,
    choices: [{ v: ok, ok: true }, ...others.map(v => ({ v, tag: 'picked the wrong ending' }))],
    explain: `In the table, ${ok.split(' or ').map(x => `${x} × ${x} = ${x * x}`).join(' and ')} end${ok.includes('or') ? '' : 's'} in ${last}. So the root ends in ${ok}.`,
  };
}
function rootSolve() {
  const n = detectiveRoot(), sq = n * n, t = Math.floor(n / 10) * 10, u = n % 10, last = sq % 10;
  const twin = u === 5 ? null : t + (10 - u), mid = t + 5;
  const d = [[n + 10, 'picked the wrong tens'], [n - 10, 'picked the wrong tens'], [n + 1, 'counting slip'], [n - 1, 'counting slip']];
  if (twin) d.unshift([twin, 'picked the wrong ending']);
  const lo = Math.min(n, twin || n), hi = Math.max(n, twin || n);
  return {
    skill: 'squares', q: `√${sq}`, visual: recipeCard(0) + tensRef() + endingRef(), ask: 'Be a root detective!',
    speak: `Root detective! What is the square root of ${sq}? Find the tens, check the last digit, then try it.`, ans: n, distract: d,
    explain: `1) Between ${t} and ${t + 10}. 2) It ends in ${last}, so the root ends in ${ENDINGS[last]}${twin ? `: ${lo} or ${hi}` : ''}. 3) ${twin ? `${mid} × ${mid} = ${mid * mid}, and ${sq} is ${sq < mid * mid ? 'less' : 'more'}, so it's ${n}. ` : ''}${n} × ${n} = ${sq} ✓`,
  };
}
/* ---------- 2nd grade visuals (topics follow Khan Academy's 2nd grade units) ---------- */
const f1 = x => x.toFixed(1);
const pad2 = n => String(n).padStart(2, '0');
const listOr = a => a.length < 2 ? (a[0] || '') : a.slice(0, -1).join(', ') + ', or ' + a[a.length - 1];

// Place-value mat: labeled columns, true 10:1 proportions, rods and cubes grouped in fives.
function pvSvg(nums, places, partsOverride) {
  // u = one block's length; cw = cube and rod width, a little chunkier than u so single cubes stay easy to see
  const u = 10, cw = 14, F = 10 * u, gap = 8, rodGap = 7, cubeGap = 5, colGap = 30, headH = 28, rowGap = 24, pad = 6;
  const P = partsOverride || nums.map(n => ({ h: Math.floor(n / 100), t: Math.floor(n / 10) % 10, o: n % 10 }));
  const dep = Math.round(F * 0.42), maxK = Math.max(0, ...P.map(p => p.th || 0));
  const kCols = Math.max(1, Math.min(maxK, 3)), kRows = Math.max(1, Math.ceil(maxK / 3));
  const wK = places === 4 ? Math.max(kCols * (F + dep) + (kCols - 1) * gap, 96) : 0;
  const maxH = Math.max(0, ...P.map(p => p.h)), maxT = Math.max(0, ...P.map(p => p.t)), maxO = Math.max(0, ...P.map(p => p.o));
  const hCols = Math.max(1, Math.min(maxH, 3)), hRows = Math.max(1, Math.ceil(maxH / 3));
  const rodX = i => i * (cw + rodGap) + Math.floor(i / 5) * 12;
  const cubeX = c => c * (cw + cubeGap) + Math.floor(c / 2) * 12;
  const wH = places >= 3 ? Math.max(hCols * F + (hCols - 1) * gap, 84) : 0;
  const wT = Math.max(maxT ? rodX(maxT - 1) + cw : 0, 48);
  const wO = Math.max(maxO ? cubeX(Math.ceil(maxO / 5) - 1) + cw : 0, 48);
  const label = P.length > 1 ? 28 : 0;
  const xK = pad + label, xH = xK + (places === 4 ? wK + colGap : 0), xT = xH + (places >= 3 ? wH + colGap : 0), xO = xT + wT + colGap;
  const W = xO + wO + pad;
  const rowH = Math.max(places >= 3 && maxH ? hRows * F + (hRows - 1) * gap : F, places === 4 && maxK ? kRows * (F + dep) + (kRows - 1) * gap : F);
  const H = headH + P.length * rowH + (P.length - 1) * rowGap + pad;
  const grid = (x, y, w, h, nx, ny) => { let d = ''; for (let i = 1; i < nx; i++) d += `M${f1(x + i * w / nx)} ${y}v${h}`; for (let j = 1; j < ny; j++) d += `M${x} ${f1(y + j * h / ny)}h${w}`; return `<path d="${d}" class="pv-grid"/>`; };
  const head = (x, w, txt, cls) => `<text x="${x + w / 2}" y="17" text-anchor="middle" class="pv-head ${cls}">${txt}</text>`;
  const sep = x => `<line x1="${x}" y1="2" x2="${x}" y2="${H - 2}" class="pv-sep"/>`;
  let s = '';
  if (places === 4) s += head(xK, wK, 'Thousands', 'k') + sep(xH - colGap / 2);
  if (places >= 3) s += head(xH, wH, 'Hundreds', 'h') + sep(xT - colGap / 2);
  s += head(xT, wT, 'Tens', 't') + head(xO, wO, 'Ones', 'o') + sep(xO - colGap / 2);
  P.forEach((p, r) => {
    const top = headH + r * (rowH + rowGap), bottom = top + rowH;
    if (r) s += `<text x="${pad + 10}" y="${top + rowH / 2 + 9}" text-anchor="middle" class="pv-op">+</text>`;
    for (let i = 0; i < (p.th || 0); i++) {
      const x = xK + (i % 3) * (F + dep + gap), y = top + Math.floor(i / 3) * (F + dep + gap);
      s += `<polygon points="${x},${y + dep} ${x + dep},${y} ${x + dep + F},${y} ${x + F},${y + dep}" class="pv-k top"/>`
        + `<polygon points="${x + F},${y + dep} ${x + F + dep},${y} ${x + F + dep},${y + F} ${x + F},${y + F + dep}" class="pv-k side"/>`
        + `<rect x="${x}" y="${y + dep}" width="${F}" height="${F}" class="pv-k"/>` + grid(x, y + dep, F, F, 10, 10);
    }
    for (let i = 0; i < p.h; i++) { const x = xH + (i % 3) * (F + gap), y = top + Math.floor(i / 3) * (F + gap); s += `<rect x="${x}" y="${y}" width="${F}" height="${F}" rx="2" class="pv-h"/>` + grid(x, y, F, F, 10, 10); }
    for (let i = 0; i < p.t; i++) { const x = xT + rodX(i), y = bottom - F; s += `<rect x="${x}" y="${y}" width="${cw}" height="${F}" rx="2" class="pv-t"/>` + grid(x, y, cw, F, 1, 10); }
    for (let k = 0; k < p.o; k++) { const c = Math.floor(k / 5), rr = k % 5; s += `<rect x="${xO + cubeX(c)}" y="${bottom - (rr + 1) * (cw + cubeGap) + cubeGap}" width="${cw}" height="${cw}" rx="2.5" class="pv-o"/>`; }
  });
  return `<svg class="pv" viewBox="0 0 ${W} ${H}" width="${Math.round(W * (P.length > 1 ? 1.15 : 1.5))}" role="img" aria-label="place value blocks">${s}</svg>`;
}

// Ten frames: add shows a then b in a second color; sub crosses out the last b.
function tenFrames(a, b, mode) {
  const total = mode === 'sub' ? a : a + b, frames = total > 10 ? 2 : 1, c = 30;
  let s = '';
  for (let fr = 0; fr < frames; fr++) {
    const ox = fr * (5 * c + 20) + 1;
    s += `<rect x="${ox}" y="1" width="${5 * c}" height="${2 * c}" class="tf-frame"/>`;
    for (let i = 1; i < 5; i++) s += `<line x1="${ox + i * c}" y1="1" x2="${ox + i * c}" y2="${2 * c + 1}" class="tf-line"/>`;
    s += `<line x1="${ox}" y1="${c + 1}" x2="${ox + 5 * c}" y2="${c + 1}" class="tf-line"/>`;
    for (let k = 0; k < 10; k++) {
      const idx = fr * 10 + k;
      if (idx >= total) break;
      const cx = ox + (k % 5) * c + c / 2, cy = 1 + Math.floor(k / 5) * c + c / 2;
      s += `<circle cx="${cx}" cy="${cy}" r="${c / 2 - 5}" class="tf-dot ${mode !== 'sub' && idx >= a ? 'b' : ''}"/>`;
      if (mode === 'sub' && idx >= a - b) s += `<path d="M${cx - 9} ${cy - 9}l18 18M${cx + 9} ${cy - 9}l-18 18" class="tf-x"/>`;
    }
  }
  const W = frames * 5 * c + (frames - 1) * 20 + 2;
  return `<svg class="tf" viewBox="0 0 ${W} ${2 * c + 2}" width="${W}" role="img" aria-label="ten frames">${s}</svg>`;
}

const COINS = {
  q: { v: 25, r: 27, name: 'quarter' },
  n: { v: 5, r: 23, name: 'nickel' },
  p: { v: 1, r: 21, name: 'penny', cls: 'copper' },
  d: { v: 10, r: 19, name: 'dime' },
};
function coinRow(list) {
  const order = ['b', 'q', 'd', 'n', 'p'];
  const items = list.slice().sort((a, b) => order.indexOf(a) - order.indexOf(b)).map(k => {
    if (k === 'b') return `<span class="coin-wrap"><svg viewBox="0 0 124 58" width="124" class="bill" aria-hidden="true"><rect x="1" y="1" width="122" height="56" rx="4"/><circle cx="62" cy="29" r="16"/><text x="62" y="35" text-anchor="middle">$1</text></svg><small>dollar</small></span>`;
    const c = COINS[k], d = c.r * 2 + 4;
    return `<span class="coin-wrap"><svg viewBox="0 0 ${d} ${d}" width="${d}" class="coin ${c.cls || 'silver'}" aria-hidden="true"><circle cx="${d / 2}" cy="${d / 2}" r="${c.r}"/><circle cx="${d / 2}" cy="${d / 2}" r="${c.r - 4}" class="rim"/><text x="${d / 2}" y="${d / 2 + 5}" text-anchor="middle">${c.v}¢</text></svg><small>${c.name}</small></span>`;
  });
  return `<div class="coins" role="img" aria-label="coins">${items.join('')}</div>`;
}
const cents = c => c >= 100 ? `$${(c / 100).toFixed(2)}` : `${c}¢`;

function clockSvg(h, m) {
  const R = 92, c = 100;
  let s = `<circle cx="${c}" cy="${c}" r="${R}" class="ck-face"/>`;
  for (let i = 0; i < 60; i++) {
    const a = i * Math.PI / 30, big = i % 5 === 0, r1 = R - (big ? 11 : 5);
    s += `<line x1="${f1(c + Math.sin(a) * r1)}" y1="${f1(c - Math.cos(a) * r1)}" x2="${f1(c + Math.sin(a) * (R - 2))}" y2="${f1(c - Math.cos(a) * (R - 2))}" class="ck-tick ${big ? 'big' : ''}"/>`;
  }
  let nums = '';
  for (let n = 1; n <= 12; n++) { const a = n * Math.PI / 6; nums += `<text x="${f1(c + Math.sin(a) * (R - 26))}" y="${f1(c - Math.cos(a) * (R - 26) + 7)}" text-anchor="middle" class="ck-num">${n}</text>`; }
  const ha = ((h % 12) + m / 60) * Math.PI / 6, ma = m * Math.PI / 30;
  s += `<line x1="${c}" y1="${c}" x2="${f1(c + Math.sin(ha) * 46)}" y2="${f1(c - Math.cos(ha) * 46)}" class="ck-hour"/>`;
  s += `<line x1="${c}" y1="${c}" x2="${f1(c + Math.sin(ma) * 74)}" y2="${f1(c - Math.cos(ma) * 74)}" class="ck-min"/>`;
  s += `<circle cx="${c}" cy="${c}" r="6" class="ck-pin"/>` + nums;
  return `<svg class="clock" viewBox="0 0 200 200" width="210" role="img" aria-label="clock">${s}</svg>`;
}

function rulerSvg(max, objs) {
  const U = Math.min(34, Math.floor(440 / max)), x0 = 18, W = x0 * 2 + max * U, objH = 18;
  let s = '', y = 6;
  const ry = 6 + objs.length * (objH + 12) + 8, RH = 46;
  for (const o of objs) {
    const x = x0 + o.start * U, w = o.len * U, tip = Math.min(14, w / 3);
    s += `<rect x="${x}" y="${y}" width="${w - tip}" height="${objH}" rx="3" class="obj ${o.cls}"/><path d="M${x + w - tip} ${y}L${x + w} ${y + objH / 2}L${x + w - tip} ${y + objH}Z" class="obj ${o.cls} tip"/>`;
    s += `<line x1="${x}" y1="${y + objH}" x2="${x}" y2="${ry}" class="guide"/><line x1="${x + w}" y1="${y + objH / 2}" x2="${x + w}" y2="${ry}" class="guide"/>`;
    y += objH + 12;
  }
  s += `<rect x="4" y="${ry}" width="${W - 8}" height="${RH}" rx="4" class="ruler"/>`;
  for (let i = 0; i <= max; i++) {
    const x = x0 + i * U;
    s += `<line x1="${x}" y1="${ry}" x2="${x}" y2="${ry + 16}" class="r-tick"/><text x="${x}" y="${ry + 36}" text-anchor="middle" class="r-num">${i}</text>`;
  }
  return `<svg class="rulerv" viewBox="0 0 ${W} ${ry + RH + 2}" width="${W}" role="img" aria-label="ruler">${s}</svg>`;
}

const GRAPH_SETS = [
  { title: 'Fruit in the basket', cats: ['apples', 'pears', 'plums', 'cherries'], noun: 'pieces of fruit' },
  { title: 'Animals in the garden', cats: ['snails', 'bees', 'robins', 'worms'], noun: 'animals' },
  { title: 'Favorite colors', cats: ['red', 'blue', 'green', 'yellow'], noun: 'children' },
];
function pictureGraph(set, vals) {
  return `<div class="pg" role="img" aria-label="picture graph"><div class="pg-title">${set.title}</div>${set.cats.map((c, i) => `<div class="pg-row"><span class="pg-label">${c}</span><span class="pg-icons">${`<i class="pg-dot c${i}"></i>`.repeat(vals[i])}</span></div>`).join('')}<div class="pg-key">Each <i class="pg-dot c0"></i> = 1</div></div>`;
}
function barGraph(set, vals) {
  const top = 10, plotH = 200, step = plotH / 10, left = 34, bw = 46, bg = 26, W = left + set.cats.length * (bw + bg) + 6, H = top + plotH + 30;
  let s = '';
  for (let v = 0; v <= 10; v++) { const y = top + plotH - v * step; s += `<line x1="${left}" y1="${y}" x2="${W - 4}" y2="${y}" class="bg-grid ${v === 0 ? 'axis' : ''}"/><text x="${left - 8}" y="${y + 5}" text-anchor="end" class="bg-num">${v}</text>`; }
  set.cats.forEach((c, i) => { const x = left + bg / 2 + i * (bw + bg), h = vals[i] * step; s += `<rect x="${x}" y="${top + plotH - h}" width="${bw}" height="${h}" class="bar c${i}"/><text x="${x + bw / 2}" y="${H - 8}" text-anchor="middle" class="bg-label">${c}</text>`; });
  return `<div class="pg-title">${set.title}</div><svg class="bargraph" viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="bar graph">${s}</svg>`;
}

const SHAPE_NAMES = { 3: 'triangle', 4: 'square', 5: 'pentagon', 6: 'hexagon', 8: 'octagon' };
function polygonSvg(n) {
  const c = 80, r = 64, rot = n === 4 ? Math.PI / 4 : -Math.PI / 2 + (rng() < 0.5 ? 0 : Math.PI / n);
  const pts = Array.from({ length: n }, (_, i) => `${f1(c + r * Math.cos(rot + i * 2 * Math.PI / n))},${f1(c + r * Math.sin(rot + i * 2 * Math.PI / n))}`).join(' ');
  return `<svg class="shape" viewBox="0 0 160 160" width="170" role="img" aria-label="a shape"><polygon points="${pts}" class="poly"/></svg>`;
}
function partsSvg(kind, k) {
  if (kind === 'circle') {
    const c = 80, r = 66, pt = i => [c + r * Math.sin(i * 2 * Math.PI / k), c - r * Math.cos(i * 2 * Math.PI / k)];
    const [x1, y1] = pt(0), [x2, y2] = pt(1);
    let s = `<path d="M${c} ${c}L${f1(x1)} ${f1(y1)}A${r} ${r} 0 ${k < 2 ? 1 : 0} 1 ${f1(x2)} ${f1(y2)}Z" class="part-on"/><circle cx="${c}" cy="${c}" r="${r}" class="part-edge"/>`;
    for (let i = 0; i < k; i++) { const [x, y] = pt(i); s += `<line x1="${c}" y1="${c}" x2="${f1(x)}" y2="${f1(y)}" class="part-line"/>`; }
    return `<svg class="shape" viewBox="0 0 160 160" width="170" role="img" aria-label="a circle cut into ${k} equal parts">${s}</svg>`;
  }
  const w = 200, h = 110, x0 = 10, y0 = 10, grid4 = k === 4 && rng() < 0.5;
  let s = '';
  if (grid4) s += `<rect x="${x0}" y="${y0}" width="${w / 2}" height="${h / 2}" class="part-on"/><line x1="${x0 + w / 2}" y1="${y0}" x2="${x0 + w / 2}" y2="${y0 + h}" class="part-line"/><line x1="${x0}" y1="${y0 + h / 2}" x2="${x0 + w}" y2="${y0 + h / 2}" class="part-line"/>`;
  else { s += `<rect x="${x0}" y="${y0}" width="${f1(w / k)}" height="${h}" class="part-on"/>`; for (let i = 1; i < k; i++) s += `<line x1="${f1(x0 + i * w / k)}" y1="${y0}" x2="${f1(x0 + i * w / k)}" y2="${y0 + h}" class="part-line"/>`; }
  s += `<rect x="${x0}" y="${y0}" width="${w}" height="${h}" class="part-edge"/>`;
  return `<svg class="shape" viewBox="0 0 220 130" width="230" role="img" aria-label="a rectangle cut into ${k} equal parts">${s}</svg>`;
}
function pairsDots(n) {
  const cols = Math.ceil(n / 2);
  let h = '';
  for (let i = 0; i < n; i++) h += `<i style="grid-column:${Math.floor(i / 2) + 1};grid-row:${(i % 2) + 1}"></i>`;
  return `<div class="dots pairs" style="--c:${cols};--d:24px;--g:8px" aria-label="${n} dots in pairs">${h}</div>`;
}

/* ---------- 2nd grade generators ---------- */
function genPlace(L) {
  if (L === 1 || L === 2) {
    const n = L === 1 ? rand(11, 99) : rand(101, 999), h = Math.floor(n / 100), t = Math.floor(n / 10) % 10, o = n % 10;
    const d = L === 1
      ? [[o * 10 + t, 'mixed up tens and ones'], [t + o, 'counted blocks, not their values'], [n + 10, 'miscounted the tens'], [n - 10, 'miscounted the tens']]
      : [[t * 100 + h * 10 + o, 'mixed up hundreds and tens'], [h + t + o, 'counted blocks, not their values'], [n + 100, 'miscounted the hundreds'], [n + 10, 'miscounted the tens']];
    return { skill: 'place', visual: pvSvg([n], L === 1 ? 2 : 3), ask: 'What number do the blocks show?', speak: 'What number do the blocks show? Count the hundreds, then the tens, then the ones.', ans: n, distract: d, explain: L === 1 ? `${t} tens and ${o} ones make ${n}.` : `${h} hundreds, ${t} tens and ${o} ones make ${n}.` };
  }
  if (L === 3) {
    let n; do { n = rand(102, 987); } while (new Set(String(n)).size < 3 || String(n).includes('0'));
    const digits = String(n), pos = rand(0, 2), dgt = +digits[pos], place = [100, 10, 1][pos];
    const q = [...digits].map((ch, i) => i === pos ? `<span class="hl">${ch}</span>` : ch).join('');
    return { skill: 'place', q, ask: 'What is the value of the circled digit?', speak: `In the number ${n}, what is the value of the ${dgt}?`, ans: dgt * place, distract: [[dgt * (place === 1 ? 10 : place === 10 ? 100 : 10), 'picked the wrong place'], [dgt, 'gave the digit, not its value'], [dgt * (place === 100 ? 1 : place === 10 ? 1 : 100), 'picked the wrong place'], [n, 'gave the whole number']], explain: `The ${dgt} is in the ${['hundreds', 'tens', 'ones'][pos]} place, so it is worth ${dgt * place}.` };
  }
  if (L === 4) {
    let h, t, o; do { h = rand(1, 9); t = rand(1, 9); o = rand(1, 9); } while (t === o || h === t);
    const n = h * 100 + t * 10 + o;
    if (rng() < 0.5) return { skill: 'place', q: `${h * 100} + ${t * 10} + ${o}`, ask: 'What number is this?', speak: `${h * 100} plus ${t * 10} plus ${o}. What number is this?`, ans: n, distract: [[h + t + o, 'added the digits'], [h * 100 + o * 10 + t, 'mixed up tens and ones'], [h * 1000 + t * 10 + o, 'wrote each part in a row'], [n + 10, 'off by ten']], explain: `${h} hundreds, ${t} tens and ${o} ones make ${n}.` };
    const ok = `${h * 100} + ${t * 10} + ${o}`;
    return { skill: 'place', q: String(n), ask: 'Which is the same number?', speak: `Which one is the same as ${n}?`, ans: ok, choices: [{ v: ok, ok: true }, { v: `${h} + ${t} + ${o}`, tag: 'added the digits' }, { v: `${h * 100} + ${o * 10} + ${t}`, tag: 'mixed up tens and ones' }, { v: `${h * 10} + ${t * 100} + ${o}`, tag: 'mixed up hundreds and tens' }], explain: `${n} = ${ok}` };
  }
  if (L === 5) {
    const a = rand(100, 999);
    let b = rng() < 0.15 ? a : rng() < 0.5 ? Math.floor(a / 100) * 100 + rand(0, 99) : rand(100, 999);
    const sym = a > b ? '>' : a < b ? '<' : '=';
    const name = { '>': 'is greater than', '<': 'is less than', '=': 'equals' };
    return { skill: 'place', q: `${a} ${BOX} ${b}`, ask: 'Which sign goes in the box?', speak: `Which sign goes between ${a} and ${b}? Greater than, less than, or equal?`, ans: sym, choices: [{ v: '>', ok: sym === '>', tag: 'flipped the sign', say: 'greater than' }, { v: '<', ok: sym === '<', tag: 'flipped the sign', say: 'less than' }, { v: '=', ok: sym === '=', tag: 'thought they were equal', say: 'equal' }], explain: `${a} ${name[sym]} ${b}. Compare the hundreds first, then the tens, then the ones.` };
  }
  const h = rand(1, 6), bigTens = rng() < 0.5, t = bigTens ? rand(10, 15) : rand(1, 8), o = bigTens ? rand(0, 9) : rand(10, 16);
  const n = h * 100 + t * 10 + o;
  return { skill: 'place', visual: pvSvg(null, 3, [{ h, t, o }]), ask: 'What number do the blocks show?', speak: `${h} hundreds, ${t} tens and ${o} ones. What number is that?`, ans: n, distract: [[n - (bigTens ? 100 : 10), bigTens ? 'forgot to trade 10 tens for a hundred' : 'forgot to trade 10 ones for a ten'], [n + 100, 'miscounted the hundreds'], [n + 10, 'miscounted the tens'], [n - 1, 'counting slip']], explain: bigTens ? `${t} tens is 1 hundred and ${t - 10} tens. So ${h + 1} hundreds, ${t - 10} tens and ${o} ones make ${n}.` : `${o} ones is 1 ten and ${o - 10} ones. So ${h} hundreds, ${t + 1} tens and ${o - 10} ones make ${n}.` };
}
function genPatterns(L) {
  if (L === 2) {
    const n = rand(3, 20), even = n % 2 === 0;
    return { skill: 'patterns', visual: pairsDots(n), q: String(n), ask: 'Even or odd?', speak: `Is ${n} even or odd? Can every dot have a partner?`, ans: even ? 'even' : 'odd', choices: [{ v: 'even', ok: even, tag: 'mixed up even and odd' }, { v: 'odd', ok: !even, tag: 'mixed up even and odd' }], explain: even ? `${n} dots make ${n / 2} pairs with none left over, so ${n} is even.` : `${n} dots make ${(n - 1) / 2} pairs with 1 left over, so ${n} is odd.` };
  }
  let step, start;
  if (L === 1) { step = pick([5, 10]); start = step * rand(0, 12); }
  else { step = pick([10, 100]); start = step === 10 ? rand(101, 850) : rand(105, 590); if (start % step === 0) start += 3; }
  if (L === 4) { step = -step; start = Math.abs(step) === 10 ? rand(150, 990) : rand(450, 990); }
  const seq = [0, 1, 2, 3].map(i => start + i * step), miss = L === 1 ? rand(1, 3) : 3, ans = seq[miss];
  const q = seq.map((v, i) => i === miss ? BOX : v).join(', ');
  const by = Math.abs(step), dir = step > 0 ? 'Count by' : 'Count back by';
  return { skill: 'patterns', q, ask: 'What number goes in the box?', speak: `${seq.map((v, i) => i === miss ? 'blank' : v).join(', ')}. What number goes in the blank?`, ans, distract: [[ans + (step > 0 ? 1 : -1) * (by === 100 ? 10 : 1), 'counted by the wrong amount'], [ans + step, 'skipped a step'], [ans - step, 'repeated a step'], [ans + (step > 0 ? 1 : -1), 'counted by ones']], explain: `${dir} ${by}s: ${seq.join(', ')}` };
}
function genMoney(L) {
  const pool = L === 1 ? ['d', 'n', 'p'] : ['q', 'd', 'n', 'p'];
  if (L <= 3) {
    const list = Array.from({ length: rand(L === 1 ? 2 : 3, L === 1 ? 6 : 6) }, () => pick(pool));
    if (L === 3) for (let i = rand(1, 3); i > 0; i--) list.push('b');
    const total = list.reduce((t, k) => t + (k === 'b' ? 100 : COINS[k].v), 0);
    return { skill: 'money', visual: coinRow(list), ask: 'How much money is this?', speak: 'How much money is this? Start with the biggest coins.', ans: total, fmt: cents, distract: [[list.length, 'counted coins, not cents'], [total + 5, 'counting slip'], [total - 5, 'counting slip'], [total + 10, 'counting slip'], [total - 10, 'counting slip']], explain: `${list.slice().sort((a, b) => ['b', 'q', 'd', 'n', 'p'].indexOf(a) - ['b', 'q', 'd', 'n', 'p'].indexOf(b)).map(k => cents(k === 'b' ? 100 : COINS[k].v)).join(' + ')} = ${cents(total)}` };
  }
  const stories = [
    () => { const a = rand(2, 7) * 5, b = rand(2, 9) * 5; return { story: `A pencil costs ${a}¢ and an eraser costs ${b}¢. How much for both?`, ans: a + b, distract: [[Math.abs(a - b), 'took away instead of adding']], explain: `${a}¢ + ${b}¢ = ${cents(a + b)}` }; },
    () => { const d = rand(3, 7), cost = rand(2, d * 2 - 1) * 5; return { story: `${N()} has ${d} dimes and buys an apple for ${cost}¢. How much money is left?`, ans: d * 10 - cost, distract: [[d * 10 + cost, 'added instead of taking away'], [d - cost / 5, 'counted coins, not cents']], explain: `${d} dimes is ${d * 10}¢. ${d * 10}¢ − ${cost}¢ = ${d * 10 - cost}¢` }; },
    () => { const q = rand(1, 3), n = rand(1, 4); return { story: `Grandma gives ${N()} ${q} quarter${q > 1 ? 's' : ''} and ${n} nickel${n > 1 ? 's' : ''}. How much money is that?`, ans: q * 25 + n * 5, distract: [[q + n, 'counted coins, not cents'], [q * 25 + n, 'counted nickels as pennies']], explain: `${q} × 25¢ = ${q * 25}¢, ${n} × 5¢ = ${n * 5}¢. Together ${cents(q * 25 + n * 5)}` }; },
  ];
  const p = pick(stories)();
  p.distract.push([p.ans + 5, 'counting slip'], [p.ans - 5, 'counting slip'], [p.ans + 10, 'counting slip']);
  return Object.assign({ skill: 'money', speak: p.story, fmt: cents }, p);
}
function genTime(L) {
  const h = rand(1, 12), m = L === 1 ? 0 : L === 2 ? 30 : L === 3 ? pick([15, 45]) : 5 * rand(1, 11);
  const fmt = (hh, mm) => `${((hh - 1 + 12) % 12) + 1}:${pad2(mm)}`;
  const ok = fmt(h, m), cand = [];
  if (L === 1) cand.push([fmt(12, h * 5 % 60), 'mixed up the hands'], [fmt(h + 1, 0), 'read the wrong hour'], [fmt(h - 1, 0), 'read the wrong hour'], [fmt(h, 30), 'misread the minute hand']);
  else if (L === 2) cand.push([fmt(h + 1, 30), 'read the next hour'], [fmt(h, 0), 'misread the minute hand'], [fmt(6, h * 5 % 60), 'mixed up the hands'], [fmt(h - 1, 30), 'read the wrong hour']);
  else if (L === 3) cand.push([fmt(h + 1, m), 'read the next hour'], [fmt(h, 60 - m), 'mixed up quarter past and quarter to'], [fmt(m / 5, h * 5 % 60), 'mixed up the hands'], [fmt(h, m / 5), 'read the number the minute hand points to']);
  else cand.push([fmt(h, m / 5), 'read the number the minute hand points to'], [fmt(h + 1, m), 'read the next hour'], [fmt(h, (m + 5) % 60), 'counted by fives wrong'], [fmt(h, (m + 55) % 60), 'counted by fives wrong']);
  const seen = new Set([ok]), choices = [{ v: ok, ok: true }];
  for (const [v, tag] of cand) if (!seen.has(v) && choices.length < 4) { seen.add(v); choices.push({ v, tag }); }
  const said = m === 0 ? `${((h - 1) % 12) + 1} o'clock` : m === 30 ? `half past ${h}` : m === 15 ? `quarter past ${h}` : m === 45 ? `quarter to ${(h % 12) + 1}` : ok;
  return { skill: 'time', visual: clockSvg(h, m), ask: 'What time is it?', speak: 'What time does the clock show? The short hand shows the hour.', ans: ok, choices, explain: `The short hand points ${m ? 'past' : 'to'} ${h}, and the long hand points to ${m === 0 ? '12' : m / 5}. It is ${ok}${said !== ok ? ` (${said})` : ''}.` };
}
function genMeasure(L) {
  const unit = rng() < 0.6 ? 'cm' : 'inches', fmt = v => `${v} ${unit === 'cm' ? 'cm' : v === 1 ? 'inch' : 'inches'}`;
  if (L === 1 || L === 2) {
    const max = unit === 'cm' ? 13 : 10, len = rand(2, L === 1 ? max - 1 : max - 4), start = L === 1 ? 0 : rand(1, max - len);
    const d = [[len + 1, 'counted the tick marks'], [len - 1, 'counting slip']];
    if (start) d.unshift([start + len, 'read the end number without checking the start']);
    return { skill: 'measure', visual: rulerSvg(max, [{ start, len, cls: 'pencil' }]), ask: 'How long is the pencil?', speak: `How long is the pencil, in ${unit === 'cm' ? 'centimeters' : 'inches'}?${start ? ' Look where it starts.' : ''}`, ans: len, fmt, distract: d, explain: start ? `It starts at ${start} and ends at ${start + len}. ${start + len} − ${start} = ${len}` : `It starts at 0 and ends at ${len}.` };
  }
  if (L === 3) {
    const max = unit === 'cm' ? 13 : 10, a = rand(5, max), b = rand(2, a - 1);
    return { skill: 'measure', visual: rulerSvg(max, [{ start: 0, len: a, cls: 'pencil' }, { start: 0, len: b, cls: 'crayon' }]), ask: 'How much longer is the pencil than the crayon?', speak: `The pencil is on top. The crayon is below it. How much longer is the pencil than the crayon?`, ans: a - b, fmt, distract: [[a, "gave the pencil's length"], [a + b, 'added the lengths'], [b, "gave the crayon's length"]], explain: `${a} − ${b} = ${a - b}` };
  }
  const st = [
    () => { const a = rand(25, 60), b = rand(11, a - 8); return { story: `${N()}'s paper boat floated ${a} feet down the stream. A friend's boat floated ${b} feet. How much farther did ${N()}'s boat float?`, ans: a - b, unit: 'feet', distract: [[a + b, 'added instead of taking away']] }; },
    () => { const a = rand(12, 45), b = rand(12, 45); return { story: `A gnome walked ${a} meters to the mushroom ring, then ${b} meters to the stream. How far did the gnome walk?`, ans: a + b, unit: 'meters', distract: [[Math.abs(a - b), 'took away instead of adding']] }; },
    () => { const a = rand(40, 90), b = rand(12, a - 15); return { story: `The ribbon was ${a} centimeters long. Mama cut off ${b} centimeters for a bookmark. How long is the ribbon now?`, ans: a - b, unit: 'cm', distract: [[a + b, 'added instead of taking away']] }; },
  ];
  const p = pick(st)();
  p.distract.push([p.ans + 1, 'counting slip'], [p.ans - 1, 'counting slip'], [p.ans + 10, 'off by ten']);
  return Object.assign({ skill: 'measure', speak: p.story, fmt: v => `${v} ${p.unit}`, explain: `${p.ans} ${p.unit}` }, p);
}
function genGraphs(L) {
  const set = pick(GRAPH_SETS);
  let vals; do { vals = set.cats.map(() => rand(1, L === 1 ? 8 : 10)); } while (new Set(vals).size < 3);
  const visual = L === 1 ? pictureGraph(set, vals) : barGraph(set, vals);
  const i = rand(0, 3);
  if (L <= 2) return { skill: 'graphs', visual, ask: `How many ${set.cats[i]}?`, speak: `Look at the ${L === 1 ? 'picture graph' : 'bar graph'}. How many ${set.cats[i]}?`, ans: vals[i], distract: [[vals[i] + 1, 'misread the graph'], [vals[i] - 1, 'misread the graph'], [vals[(i + 1) % 4], 'read the wrong row']], explain: `The ${set.cats[i]} ${L === 1 ? 'row has' : 'bar goes up to'} ${vals[i]}.` };
  if (L === 3) {
    let a, b; do { a = rand(0, 3); b = rand(0, 3); } while (vals[a] <= vals[b]);
    return { skill: 'graphs', visual, ask: `How many more ${set.cats[a]} than ${set.cats[b]}?`, speak: `How many more ${set.cats[a]} than ${set.cats[b]}?`, ans: vals[a] - vals[b], distract: [[vals[a] + vals[b], 'added instead of comparing'], [vals[a], 'gave just one bar'], [vals[a] - vals[b] + 1, 'counting slip']], explain: `${vals[a]} − ${vals[b]} = ${vals[a] - vals[b]}` };
  }
  const total = vals.reduce((x, y) => x + y, 0);
  return { skill: 'graphs', visual, ask: `How many ${set.noun} in all?`, speak: `How many ${set.noun} are there in all? Add up all the bars.`, ans: total, distract: [[total - vals[3], 'left out one bar'], [total + 1, 'counting slip'], [total - 1, 'counting slip'], [total + 10, 'off by ten']], explain: `${vals.join(' + ')} = ${total}` };
}
function genShapes(L) {
  if (L === 1 || L === 4) {
    const n = L === 1 ? rand(3, 6) : rand(5, 9);
    if (L === 4 && rng() < 0.5) {
      const k = rand(2, 6), kind = k <= 4 && rng() < 0.5 ? 'circle' : 'rect';
      return { skill: 'shapes', visual: partsSvg(kind, k), ask: 'How many equal parts?', speak: 'How many equal parts is the shape cut into?', ans: k, distract: [[k - 1, 'counted the lines'], [k + 1, 'counting slip'], [k + 2, 'counting slip']], explain: `There are ${k} equal parts.` };
    }
    return { skill: 'shapes', visual: polygonSvg(n), ask: 'How many sides?', speak: 'How many sides does this shape have? Count the straight edges.', ans: n, distract: [[n + 1, 'counted one side twice'], [n - 1, 'missed a side'], [n + 2, 'counting slip']], explain: `It has ${n} sides and ${n} corners.` };
  }
  if (L === 2) {
    const n = pick([3, 4, 5, 6, 8]), ok = SHAPE_NAMES[n];
    const others = shuffle(Object.values(SHAPE_NAMES).filter(v => v !== ok)).slice(0, 3);
    return { skill: 'shapes', visual: polygonSvg(n), ask: 'What is this shape called?', speak: 'What is this shape called?', ans: ok, choices: [{ v: ok, ok: true }, ...others.map(v => ({ v, tag: 'mixed up shape names' }))], explain: `It has ${n} sides, so it is a ${ok}.` };
  }
  const k = pick([2, 3, 4]), kind = rng() < 0.5 ? 'circle' : 'rect', names = { 2: 'one half', 3: 'one third', 4: 'one fourth' };
  return { skill: 'shapes', visual: partsSvg(kind, k), ask: 'What part is shaded?', speak: 'What part of the shape is shaded?', ans: names[k], choices: [2, 3, 4].map(x => ({ v: names[x], ok: x === k, tag: 'mixed up halves, thirds and fourths' })), explain: `The shape is cut into ${k} equal parts and 1 is shaded: ${names[k]}.` };
}

/* ---------- beyond 2nd grade: negatives, big numbers, odd-number squares ---------- */
const signed = v => v < 0 ? `−${-v}` : String(v);
const commas = v => Number(v).toLocaleString('en-US');

function numberLineSvg(lo, hi, start, jump) {
  const U = 30, x0 = 20, W = x0 * 2 + (hi - lo) * U, base = 78, X = v => x0 + (v - lo) * U;
  let s = `<line x1="6" y1="${base}" x2="${W - 6}" y2="${base}" class="nl-line"/>`;
  for (let v = lo; v <= hi; v++) s += `<line x1="${X(v)}" y1="${base - (v === 0 ? 12 : 7)}" x2="${X(v)}" y2="${base + (v === 0 ? 12 : 7)}" class="nl-tick ${v === 0 ? 'zero' : ''}"/><text x="${X(v)}" y="${base + 30}" text-anchor="middle" class="nl-num ${v < 0 ? 'neg' : ''}">${signed(v)}</text>`;
  if (jump) {
    const a = X(start), b = X(start + jump), mid = (a + b) / 2, hgt = Math.min(60, 18 + Math.abs(jump) * 4);
    s += `<path d="M${a} ${base - 6}Q${mid} ${base - 6 - hgt * 1.6} ${b} ${base - 6}" class="nl-jump"/><path d="M${b} ${base - 6}l${jump > 0 ? -9 : 9} -6M${b} ${base - 6}l${jump > 0 ? -3 : 3} -11" class="nl-jump"/>`;
  }
  s += `<circle cx="${X(start)}" cy="${base}" r="8" class="nl-start"/>`;
  return `<svg class="numline" viewBox="0 0 ${W} ${base + 42}" width="${W}" role="img" aria-label="number line">${s}</svg>`;
}
function genNegatives(L) {
  let a, b, ans, visual = null, story = null, q = null, ask = null, speak;
  if (L === 1) {
    a = rand(1, 6); b = rand(a + 1, a + 6); ans = a - b;
    visual = numberLineSvg(-10, 10, a, -b); ask = 'Where does the frog land?';
    speak = `The frog starts at ${a} and jumps back ${b}. Where does it land?`;
  } else if (L === 2) {
    a = rand(0, 8); b = rand(a + 1, a + 9); ans = a - b; q = `${a} − ${b}`;
    visual = rng() < 0.5 ? numberLineSvg(-10, 10, a, 0) : null; speak = `${a} minus ${b}`;
  } else if (L === 3) {
    a = -rand(1, 9); b = rand(1, 15); ans = a + b; q = `${signed(a)} + ${b}`; speak = `negative ${-a} plus ${b}`;
  } else {
    a = rand(1, 9); b = rand(a + 2, a + 12); ans = a - b;
    story = `In the morning it was ${a} degrees outside. By night it got ${b} degrees colder. What is the temperature at night?`; speak = story;
  }
  return { skill: 'negatives', q, ask, story, visual, speak, ans, neg: true, fmt: signed,
    distract: [[-ans, 'forgot the minus sign'], [ans + 1, 'counting slip'], [ans - 1, 'counting slip'], [0, 'stopped at zero'], [a + b, 'added instead']],
    explain: ans < 0 ? `Count back past zero: ${signed(a)} ${L === 3 ? '+' : '−'} ${b} = ${signed(ans)}. Below zero is negative.` : `${signed(a)} + ${b} = ${ans}` };
}

function genBignums(L) {
  if (L === 1) {
    const n = rand(1001, 9999), th = Math.floor(n / 1000), h = Math.floor(n / 100) % 10, t = Math.floor(n / 10) % 10, o = n % 10;
    return { skill: 'bignums', visual: pvSvg(null, 4, [{ th, h, t, o }]), ask: 'What number do the blocks show?', speak: 'What number do the blocks show? A big cube is one thousand.', ans: n, fmt: commas,
      distract: [[th + h + t + o, 'counted blocks, not their values'], [h * 1000 + th * 100 + t * 10 + o, 'mixed up thousands and hundreds'], [n + 1000, 'miscounted the thousands'], [n + 100, 'miscounted the hundreds']],
      explain: `${th} thousands, ${h} hundreds, ${t} tens and ${o} ones make ${commas(n)}.` };
  }
  if (L === 2 || L === 3) {
    const digits = L === 2 ? 4 : 6;
    let n; do { n = rand(10 ** (digits - 1), 10 ** digits - 1); } while (new Set(String(n)).size < digits - 1 || String(n).includes('0'));
    const str = String(n), pos = rand(0, digits - 1), dgt = +str[pos], place = 10 ** (digits - 1 - pos);
    const names = { 1: 'ones', 10: 'tens', 100: 'hundreds', 1000: 'thousands', 10000: 'ten thousands', 100000: 'hundred thousands' };
    const shown = commas(n);
    let k = 0; const q = [...shown].map(ch => { if (ch === ',') return ch; const out = k === pos ? `<span class="hl">${ch}</span>` : ch; k++; return out; }).join('');
    return { skill: 'bignums', q, ask: 'What is the value of the circled digit?', speak: `In the number ${n}, what is the value of the circled ${dgt}?`, ans: dgt * place, fmt: commas,
      distract: [[dgt * place * 10, 'picked the wrong place'], [dgt * Math.max(1, place / 10), 'picked the wrong place'], [dgt, 'gave the digit, not its value'], [dgt * place * 100, 'picked the wrong place']],
      explain: `The ${dgt} is in the ${names[place]} place, so it is worth ${commas(dgt * place)}.` };
  }
  if (L === 4) {
    const a = rand(1000, 999999); let b = rng() < 0.5 ? a + pick([-1, 1]) * pick([10, 100, 1000, 10000]) : rand(1000, 999999); if (b < 1000) b = a + 100;
    const sym = a > b ? '>' : a < b ? '<' : '=';
    return { skill: 'bignums', q: `${commas(a)} ${BOX} ${commas(b)}`, ask: 'Which sign goes in the box?', speak: `Which sign goes between ${a} and ${b}? Greater than, less than, or equal?`, ans: sym,
      choices: [{ v: '>', ok: sym === '>', tag: 'flipped the sign', say: 'greater than' }, { v: '<', ok: sym === '<', tag: 'flipped the sign', say: 'less than' }, { v: '=', ok: sym === '=', tag: 'thought they were equal', say: 'equal' }],
      explain: `Count the digits first. Then compare from the left, place by place.` };
  }
  const th = rand(1, 9), h = rand(0, 9), t = rand(0, 9), o = rand(1, 9), n = th * 1000 + h * 100 + t * 10 + o;
  return { skill: 'bignums', ask: 'Listen! Which number did you hear?', speak: `Listen. ${n}. Which number did you hear?`, ans: n, fmt: commas,
    distract: [[th * 1000 + t * 100 + h * 10 + o, 'mixed up the places'], [th * 10000 + h * 100 + t * 10 + o, 'wrote too many zeros'], [th * 100 + h * 10 + t, 'left off a digit'], [n + 1000, 'misheard the thousands']],
    explain: `${commas(n)}: ${th} thousand, ${h} hundred${t || o ? ` and ${t * 10 + o}` : ''}.` };
}

function layersSvg(n) {
  const d = n > 6 ? 20 : 28, g = 3, W = n * (d + g) + 6;
  let s = '';
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) s += `<rect x="${3 + j * (d + g)}" y="${3 + i * (d + g)}" width="${d}" height="${d}" rx="3" class="layer l${Math.max(i, j) % 4}"/>`;
  return `<svg class="layers" viewBox="0 0 ${W} ${W}" width="${W}" role="img" aria-label="a square built from layers of ${n} odd numbers">${s}</svg>`;
}
function genOddSquares() {
  const n = rand(2, 7), odds = Array.from({ length: n }, (_, i) => 2 * i + 1), sq = n * n;
  return { skill: 'squares', q: `${odds.join(' + ')}`, visual: layersSvg(n), ask: 'Add them up. What do you notice?', speak: `${odds.join(' plus ')}. What do they add up to?`, ans: sq,
    distract: [[sq + 1, 'counting slip'], [sq - 1, 'counting slip'], [sq + n, 'one row too many'], [2 * n + 1, 'added only the last two']],
    explain: `${odds.join(' + ')} = ${sq}, which is ${n} × ${n}. Adding odd numbers in order always builds a square!` };
}

/* ---------- off the screen: hands-on ideas matched to what was practiced ---------- */
const HANDS = {
  add: 'Make two piles of acorns or chestnuts. Push them together, and every time you make ten, wrap them in a little cloth bundle.',
  sub: 'Line up 15 beeswax blocks and take some away for a gnome to "borrow." How many are left on the table?',
  place: 'Bundle sticks or straws into tens with yarn. Ten bundles tied together make a hundred. Build your child’s age, then the year.',
  patterns: 'Hop along stepping stones counting by 5s, then by 10s. Pair up socks from the laundry: even or odd?',
  arrays: 'Lay out acorns or stones in rows on a wool cloth: 3 rows of 4, then 4 rows of 3. Same number?',
  money: 'Play shop with real coins. Price a few things at the nature table and let your child pay and make change.',
  time: 'Make a clock from a paper plate with a short and a long hand. Set it to bedtime, lunch and the walk to school.',
  measure: 'Measure a foot, a leaf and a stick with a ruler or a string. Which is longest? By how much?',
  graphs: 'Count the birds or the colors of leaves on a walk. Make a picture graph together with crayons back home.',
  shapes: 'Fold paper or cut an apple into halves and fourths. Are the parts really equal?',
  words: 'Tell a story problem out loud about the day, then trade: your child makes one up for you to solve.',
  times: 'Count out loud while marching or jumping rope: the 3s on every third step, the 4s on every fourth.',
  missing: 'Hide some stones under a bowl: "There are 9 in all and I can see 5. How many are hiding?"',
  squares: 'Build squares from beeswax blocks: 1, then 4, then 9. Add one L-shaped layer of a new color each time.',
  negatives: 'Draw a chalk number line on the sidewalk with 0 in the middle. Hop forward and back, past zero.',
  bignums: 'Find big numbers in the world: a page count, a mileage sign, the year. Read them together and build one with stick bundles.',
};

const GEN = { add: genAdd, sub: genSub, place: genPlace, patterns: genPatterns, arrays: genArrays, money: genMoney, time: genTime, measure: genMeasure, graphs: genGraphs, shapes: genShapes, words: genWords, times: genTimes, missing: genMissing, squares: genSquares, negatives: genNegatives, bignums: genBignums };

function buildChoices(ans, distract, neg) {
  const seen = new Set([String(ans)]), out = [{ v: ans, ok: true }];
  const [first, ...rest] = distract;
  for (const [v, tag] of [first, ...shuffle(rest)]) {
    if (out.length >= 4) break;
    if ((v < 0 && !neg) || !Number.isInteger(v) || seen.has(String(v))) continue;
    seen.add(String(v)); out.push({ v, tag });
  }
  for (let k = 2; out.length < 4; k++) for (const v of [ans + k, ans - k]) {
    if (out.length < 4 && (v >= 0 || neg) && !seen.has(String(v))) { seen.add(String(v)); out.push({ v, tag: 'counting slip' }); }
  }
  return shuffle(out);
}
// kind: 'current' (his level), 'easier' (review a level below), 'stretch' (next level up), 'again' (spaced review of a miss)
function makeProblem(skill, level = state.levels[skill], seed = newSeed(), kind = 'current') {
  level = Math.max(1, Math.min(level, SKILLS[skill].levels.length));
  rng = seeded(seed);
  try {
    const p = GEN[skill](level);
    p.level = level; p.seed = seed; p.kind = kind;
    p.choices = p.choices ? shuffle(p.choices) : buildChoices(p.ans, p.distract, p.neg);
    if (p.choices.every(c => c.say || (typeof c.v === 'string' && !/\d/.test(c.v)))) p.speak = `${p.speak || ''} ${listOr(p.choices.map(c => c.say || c.v))}?`.trim();
    p.tries = 0; p.wrong = []; p.done = false; p.revealed = false;
    p.key = (p.q || '') + (p.story || '') + (p.visual || '') + p.ans;
    return p;
  } finally { rng = Math.random; }
}

/* ---------- session ---------- */
let screen = 'home', sess = null, lastChanges = [], confirmReset = false, confirmWipe = false, wiped = false, confirmTopic = null, castSaved = false;
/* Each round mixes four kinds of problems:
   - spaced review of missed concepts, due today (up to 30% of the round)
   - the current level (most problems)
   - an easier level now and then (about 1 in 7), to keep old skills fresh
   - a stretch problem from the next level (about 1 in 9) once the child is doing well */
const REVIEW_DAYS = [1, 3, 7, 14, 30];
const DAY = 864e5;
const startOfDay = () => new Date().setHours(0, 0, 0, 0);
const UNLOCK_ORDER = ['add', 'sub', 'place', 'arrays', 'times', 'words', 'money', 'time', 'patterns', 'measure', 'graphs', 'shapes', 'missing', 'squares', 'bignums', 'negatives'];
function readyToStretch(k) {
  const r = (state.rec[k] || []).slice(-6);
  return r.length >= 4 && r.filter(Boolean).length / r.length >= 0.75;
}
function dueCards() {
  const now = Date.now();
  return state.cards.filter(c => c.due <= now && SKILLS[c.skill]).sort((a, b) => a.due - b.due);
}
function buildSession() {
  let on = ORDER.filter(k => state.on[k]);
  if (!on.length) on = ['times'];
  const n = state.perSession, plan = [];
  for (const c of dueCards().slice(0, Math.ceil(n * 0.3))) plan.push({ skill: c.skill, level: c.level, seed: c.box === 0 ? c.seed : newSeed(), kind: 'again', card: c.id });
  let rotation = shuffle(on.filter(k => !state.mastered[k] || Math.random() < 0.5));
  if (!rotation.length) rotation = shuffle(on);
  if (on.includes(goalSkill()) && on.length > 1 && !goalMet()) rotation.push(goalSkill());
  for (let i = 0; plan.length < n; i++) {
    const k = rotation[i % rotation.length], L = state.levels[k], max = SKILLS[k].levels.length, roll = Math.random();
    if (roll < 0.15 && L > 1) plan.push({ skill: k, level: L - 1 - (L > 2 && Math.random() < 0.3 ? 1 : 0), kind: 'easier' });
    else if (roll > 0.89 && L < max && readyToStretch(k)) plan.push({ skill: k, level: L + 1, kind: 'stretch' });
    else plan.push({ skill: k, level: L, kind: 'current' });
  }
  const seen = new Set(), probs = [];
  for (const it of shuffle(plan)) {
    let p = makeProblem(it.skill, it.level, it.seed ?? newSeed(), it.kind);
    for (let tries = 0; seen.has(p.key) && tries < 8; tries++) p = makeProblem(it.skill, it.level, newSeed(), it.kind);
    p.card = it.card;
    seen.add(p.key); probs.push(p);
  }
  return { probs, i: 0, results: [], cleared: 0 };
}
function startSession() { sess = buildSession(); screen = 'play'; render(); autoSay(); }
function autoSay() {
  const p = sess.probs[sess.i];
  if (state.voice === 'off') return;
  const line = p.story || p.ask || state.voice === 'all' ? (p.speak || spoken(p.q || '')) : '';
  if (line) say(line);
}
function gotIt(p) {
  p.done = true;
  p.praise = p.tries === 0 ? pick(['Yes!', 'Right!', 'You got it!', 'Exactly!']) : 'Yes, that one!';
  record(p, p.tries === 0);
}
function missed(p, tag, nudge) {
  p.tries++;
  const key = `${p.skill}|${tag || 'other'}`;
  state.slips[key] = (state.slips[key] || 0) + 1;
  if (p.tries >= 2) { p.done = true; p.revealed = true; record(p, false); }
  else { p.nudge = nudge; save(); }
}
function answer(idx) {
  const p = sess.probs[sess.i];
  if (p.done || p.wrong.includes(idx)) return;
  const c = p.choices[idx];
  if (c.ok) gotIt(p);
  else { p.wrong.push(idx); missed(p, c.tag, 'Not quite. Have another look.'); }
  render(!c.ok && !p.done);
}
/* typing mode: numeric answers get a number pad instead of four choices */
const typeable = p => state.answerMode === 'type' && typeof p.ans === 'number' && !(p.fmt === cents && p.ans >= 100);
const unitOf = p => p.fmt ? p.fmt(p.ans).replace(/^[−$\d,.]+/, '') : '';
function keyIn(k) {
  const p = sess.probs[sess.i];
  if (p.done || !typeable(p)) return;
  const e = p.entry || '';
  if (k === 'del') p.entry = e.slice(0, -1);
  else if (k === 'neg') p.entry = e.startsWith('−') ? e.slice(1) : '−' + e;
  else if (k === 'ok') return submitTyped();
  else if (e.replace('−', '').length < 7) p.entry = e + k;
  render();
}
function submitTyped() {
  const p = sess.probs[sess.i];
  const raw = (p.entry || '').replace('−', '-');
  if (!/\d/.test(raw)) return;
  const val = Number(raw);
  if (val === p.ans) { gotIt(p); render(); return; }
  p.lastWrong = p.entry; p.entry = '';
  const tag = (p.distract || []).find(d => d[0] === val)?.[1] || (p.choices.find(c => c.v === val)?.tag) || 'other';
  missed(p, tag, `Not ${p.lastWrong}. Have another look.`);
  render(!p.done);
}
function keypadHtml(p) {
  const shown = p.done ? (p.revealed ? (p.fmt ? p.fmt(p.ans) : p.ans) : (p.entry || '')) : (p.entry || '');
  const unit = unitOf(p);
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', p.neg ? 'neg' : '', '0', 'del'];
  const label = { neg: '−', del: '⌫' };
  return `<div class="typing">
    <div class="entry ${p.done ? (p.revealed ? 'shown' : 'ok') : ''}">${shown !== '' ? esc(shown) : '<span class="ph">?</span>'}${unit && !(p.done && p.revealed) ? `<small>${esc(unit)}</small>` : ''}</div>
    ${p.done ? '' : `<div class="keypad">${keys.map(k => k ? `<button class="key-btn" data-act="key" data-k="${k}" aria-label="${k === 'del' ? 'Delete' : k === 'neg' ? 'Minus sign' : k}">${label[k] || k}</button>` : '<span></span>').join('')}
    <button class="start check" data-act="key" data-k="ok">Check</button></div>`}
  </div>`;
}
function record(p, first) {
  sess.results.push(first);
  state.total++;
  state.done[p.skill] = (state.done[p.skill] || 0) + 1;
  if (p.kind === 'current') state.rec[p.skill] = [...(state.rec[p.skill] || []), first].slice(-10);
  if (p.kind === 'stretch') state.stretch[p.skill] = [...(state.stretch[p.skill] || []), first].slice(-5);
  if (p.kind === 'again') reviewCard(p.card, first);
  else if (!first && p.kind !== 'stretch') addCard(p);
  save();
}
// A missed concept comes back tomorrow, then after 3, 7, 14 and 30 days while he keeps getting it right.
function addCard(p) {
  const due = startOfDay() + DAY * REVIEW_DAYS[0];
  const same = state.cards.find(c => c.skill === p.skill && c.level === p.level);
  if (same) { Object.assign(same, { box: 0, seed: p.seed, due, misses: same.misses + 1 }); return; }
  state.cards.push({ id: newSeed().toString(36), skill: p.skill, level: p.level, seed: p.seed, box: 0, due, misses: 1, added: Date.now() });
  if (state.cards.length > 60) state.cards.sort((a, b) => a.added - b.added).shift();
}
function reviewCard(id, first) {
  const c = state.cards.find(x => x.id === id);
  if (!c) return;
  if (!first) { Object.assign(c, { box: 0, due: startOfDay() + DAY, misses: c.misses + 1 }); return; }
  c.box++;
  if (c.box >= REVIEW_DAYS.length) { state.cards = state.cards.filter(x => x !== c); state.cleared = (state.cleared || 0) + 1; sess.cleared++; return; }
  c.due = startOfDay() + DAY * REVIEW_DAYS[c.box];
}
function next() {
  if (sess.i < sess.probs.length - 1) { sess.i++; render(); autoSay(); return; }
  const used = [...new Set(sess.probs.map(p => p.skill))];
  lastChanges = adjustLevels(used);
  state.sessions.unshift({ d: new Date().toISOString(), score: sess.results.filter(Boolean).length, n: sess.results.length, skills: used });
  state.sessions = state.sessions.slice(0, 40);
  save();
  if (tr()) sess.photo = nextPhoto();
  screen = 'done'; render();
  if (tr() && state.voice !== 'off') { const s = sess.results.filter(Boolean).length; say(`${document.querySelector('h1')?.textContent || ''} ${s} out of ${sess.results.length} on the first try.`, true); }
}
// Up: 5 in a row, 7 of the last 8, or 3 stretch problems in a row, all right on the first try.
// Down: 4 misses in the last 6. Finishing the top level masters the topic and turns on the next one.
function adjustLevels(used) {
  const changes = [];
  for (const k of used) {
    const r = state.rec[k] || [], st = state.stretch[k] || [], max = SKILLS[k].levels.length;
    const last8 = r.slice(-8), last6 = r.slice(-6), last5 = r.slice(-5);
    const up = (last8.length >= 8 && last8.filter(Boolean).length >= 7) || (last5.length === 5 && last5.every(Boolean)) || (st.length >= 3 && st.slice(-3).every(Boolean));
    if (up && state.levels[k] < max) { state.levels[k]++; state.rec[k] = []; state.stretch[k] = []; changes.push([k, 'up']); }
    else if (up && !state.mastered[k]) {
      state.mastered[k] = Date.now(); changes.push([k, 'mastered']);
      const nk = UNLOCK_ORDER.find(x => !state.on[x] && !state.mastered[x]);
      if (nk) { state.on[nk] = true; changes.push([nk, 'unlocked']); }
    }
    else if (last6.length >= 6 && last6.filter(Boolean).length <= 2 && state.levels[k] > 1) { state.levels[k]--; state.rec[k] = []; state.stretch[k] = []; changes.push([k, 'down']); }
  }
  for (const [k, dir] of changes) state.log.unshift({ d: new Date().toISOString(), k, dir, to: state.levels[k] });
  state.log = state.log.slice(0, 30);
  return changes;
}

/* ---------- rendering ---------- */
const KIND_LABEL = { again: ' · <b class="tag again">Practice again</b>', easier: ' · <b class="tag easier">Review</b>', stretch: ' · <b class="tag stretch">★ Stretch</b>' };
const app = document.getElementById('app');
const speakerIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/><path d="M19.5 5.5a9 9 0 0 1 0 13"/></svg>';
function tallySvg(filled) {
  const xs = [8, 16, 24, 32];
  const lines = xs.map((x, i) => `<line x1="${x}" y1="5" x2="${x}" y2="35" class="${i < filled ? '' : 'empty'}"/>`).join('');
  return `<svg viewBox="0 0 46 40" aria-hidden="true">${lines}<line x1="2" y1="31" x2="40" y2="9" class="slash ${filled >= 5 ? '' : 'empty'}"/></svg>`;
}
function starSvg(on) {
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 16.8l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" fill="${on ? 'var(--yellow)' : 'none'}" stroke="${on ? 'var(--yellow)' : 'var(--chalk-dim)'}" stroke-width="1.6" stroke-linejoin="round"/></svg>`;
}
function fmtDate(iso) { try { return new Date(iso).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }); } catch (e) { return ''; } }

function nameForm(label, button) {
  return `<form class="name-form" id="name-form">
    <label for="child-name">${label}</label>
    <div class="row-btns"><input id="child-name" class="pick name-input" maxlength="24" placeholder="First name" autocomplete="off" value="${esc(childName())}"><button class="ghost" type="submit">${button}</button></div>
  </form>`;
}

// One segment per level: finished levels are full, the current one fills toward the next level-up.
function levelPct(k) {
  if (state.mastered[k]) return 1;
  const r = state.rec[k] || [];
  let streak = 0;
  for (let i = r.length - 1; i >= 0 && r[i]; i--) streak++;
  const st = state.stretch[k] || [];
  let sStreak = 0;
  for (let i = st.length - 1; i >= 0 && st[i]; i--) sStreak++;
  return Math.min(0.95, Math.max(streak / 5, r.slice(-8).filter(Boolean).length / 7, sStreak / 3));
}
function levelBar(k) {
  const max = SKILLS[k].levels.length, L = state.levels[k], pct = levelPct(k);
  const segs = Array.from({ length: max }, (_, i) => {
    const fill = state.mastered[k] || i < L - 1 ? 1 : i === L - 1 ? pct : 0;
    return `<span class="seg-bar"><i style="width:${Math.round(fill * 100)}%"></i></span>`;
  }).join('');
  return `<span class="lvlbar ${state.mastered[k] ? 'done' : ''}" role="img" aria-label="Level ${L} of ${max}${state.mastered[k] ? ', mastered' : ''}">${segs}</span>`;
}

function renderHome() {
  const gk = goalSkill(), target = state.goal.target, done = Math.min(goalDone(), target);
  let tally = '';
  for (let g = 0; g < target / 5; g++) tally += tallySvg(Math.max(0, Math.min(5, done - g * 5)));
  const today = new Date().toDateString();
  const todayCount = state.sessions.filter(s => new Date(s.d).toDateString() === today).reduce((t, s) => t + s.n, 0);
  return `
  <header class="top"><h1>${esc(greet('Hello'))}</h1><button class="link" data-act="parent">For grown-ups</button></header>
  ${childName() ? '' : nameForm("Who's practicing?", 'Start')}
  <section>
    <div class="goal-head">
      <div class="goal-pick"><label for="goal-skill">Goal</label><select id="goal-skill" class="pick">${GROUPS.map(g => `<optgroup label="${g.title}">${g.keys.map(k => `<option value="${k}" ${k === gk ? 'selected' : ''}>${SKILLS[k].name}</option>`).join('')}</optgroup>`).join('')}</select></div>
      <span class="count">${goalDone()} / ${target}</span>
    </div>
    <div class="tally" role="img" aria-label="${goalDone()} of ${target} ${SKILLS[gk].name} problems done">${tally}</div>
    ${goalMet() ? `<p class="meta">Goal reached! ${SKILLS[gk].name} will keep coming up in mixed practice. Pick a new goal, or start a new ${target} on the grown-ups page.</p>` : ''}
  </section>
  <section>
    <h2>What shall we practice?</h2>
    ${GROUPS.map(g => `<div class="group"><h3>${g.title}${g.note ? ` <small>${g.note}</small>` : ''}</h3>
    <div class="chips">${g.keys.map(k => `<button class="chip" data-act="chip" data-k="${k}" aria-pressed="${!!state.on[k]}"><strong>${SKILLS[k].name}</strong><small>Level ${state.levels[k]} · ${esc(SKILLS[k].levels[state.levels[k] - 1])}</small>${levelBar(k)}</button>`).join('')}</div></div>`).join('')}
  </section>
  <button class="start" data-act="start">Start ${state.perSession} problems</button>
  <p class="meta">${todayCount ? `${todayCount} problems so far today. ` : ''}${state.total} problems solved since the start.</p>`;
}

function renderPlay() {
  const p = sess.probs[sess.i];
  const ticks = sess.probs.map((_, j) => `<span class="${j < sess.results.length ? (sess.results[j] ? 'done' : 'miss') : j === sess.i ? 'now' : ''}"></span>`).join('');
  let fb = '';
  if (p.done && !p.revealed) fb = `<span class="big good">${esc(p.praise)}</span><span class="how">${esc(p.explain)}</span>`;
  else if (p.revealed) fb = `<span class="big try">The answer is ${esc(p.fmt ? p.fmt(p.ans) : p.ans)}.</span><span class="how">${esc(p.explain)}</span>`;
  else if (p.tries) fb = `<span class="big try">${esc(p.nudge)}</span>`;
  const correctIdx = p.choices.findIndex(c => c.ok);
  const choices = p.choices.map((c, j) => {
    const cls = p.wrong.includes(j) ? 'no' : (p.done && j === correctIdx ? 'ok' : '');
    return `<button class="choice ${cls}" data-act="pick" data-i="${j}" ${p.done || p.wrong.includes(j) ? 'disabled' : ''}><span class="key">${j + 1}</span>${esc(p.fmt ? p.fmt(c.v) : c.v)}</button>`;
  }).join('');
  const last = sess.i === sess.probs.length - 1;
  return `
  <div class="play-top">
    <div class="ticks" aria-label="Problem ${sess.i + 1} of ${sess.probs.length}">${ticks}</div>
    <span class="skill-label">${SKILLS[p.skill].name} · level ${p.level}${KIND_LABEL[p.kind] || ''}${p.world ? ` · ${esc(p.world)}` : ''}</span>
    ${canSpeak ? `<button class="say" data-act="say" aria-label="Read it out loud">${speakerIcon}</button>` : ''}
  </div>
  <div class="problem" id="problem">
    ${p.story ? `<p class="story">${esc(p.story)}</p>` : ''}
    ${p.q ? `<div class="q">${p.q}</div>` : ''}
    ${p.visual || ''}
    ${p.ask ? `<div class="ask">${esc(p.ask)}</div>` : ''}
  </div>
  ${typeable(p) ? keypadHtml(p) : `<div class="choices">${choices}</div>`}
  <div class="feedback">${fb}</div>
  ${p.done ? `<div class="next-row"><button class="start" data-act="next" id="next">${last ? 'See my stars' : 'Next'}</button></div>` : ''}
  <button class="link" data-act="home" style="align-self:flex-start">Stop and go home</button>`;
}

function handsOn() {
  const counts = {};
  sess.probs.forEach(p => { counts[p.skill] = (counts[p.skill] || 0) + 1; });
  const top = Object.keys(counts).sort((a, b) => counts[b] - counts[a]).filter(k => HANDS[k]).slice(0, 2);
  if (!top.length) return '';
  return `<section class="hands"><h2>Off the screen</h2><p class="note">Something to try with your hands today:</p><ul>${top.map(k => `<li><strong>${SKILLS[k].name}:</strong> ${esc(HANDS[k])}</li>`).join('')}</ul></section>`;
}

/* paper practice: a printable round with write-in boxes and an answer key */
function printRound() {
  const { probs } = buildSession();
  const writeIn = p => typeof p.ans === 'number' && !(p.fmt === cents && p.ans >= 100);
  const item = p => `<li class="pp">
      <div class="pp-body">${p.story ? `<p class="story">${esc(p.story)}</p>` : ''}${p.q ? `<div class="q">${p.q}</div>` : ''}${p.visual || ''}${p.ask ? `<div class="ask">${esc(p.ask)}</div>` : ''}</div>
      ${writeIn(p) ? `<div class="pp-write"><span class="pp-box"></span>${esc(unitOf(p))}</div>` : `<div class="pp-circle">Circle one: ${p.choices.map(c => `<span>${esc(p.fmt ? p.fmt(c.v) : c.v)}</span>`).join('')}</div>`}
    </li>`;
  document.getElementById('print').innerHTML = `
    <header class="pp-head"><h1>${childName() ? esc(childName()) + "'s paper round" : 'Paper round'}</h1><span>${new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</span></header>
    <ol class="pp-list">${probs.map(item).join('')}</ol>
    <section class="pp-key"><h2>Answer key</h2><ol>${probs.map(p => `<li><strong>${esc(p.fmt ? p.fmt(p.ans) : p.ans)}</strong> <span>${esc(p.explain || '')}</span></li>`).join('')}</ol></section>`;
  window.print();
}

function roundNews() {
  const mastered = lastChanges.filter(c => c[1] === 'mastered'), unlocked = lastChanges.filter(c => c[1] === 'unlocked');
  const again = sess.probs.filter(p => p.kind === 'again'), againRight = again.filter((p, i) => sess.results[sess.probs.indexOf(p)]).length;
  const stretch = sess.probs.filter(p => p.kind === 'stretch'), stretchRight = stretch.filter(p => sess.results[sess.probs.indexOf(p)]).length;
  const lines = [];
  if (unlocked.length) lines.push(...unlocked.map(([k]) => `<li class="big-news">New topic unlocked: <strong>${SKILLS[k].name}</strong>!</li>`));
  if (mastered.length) lines.push(...mastered.map(([k]) => `<li>${SKILLS[k].name}: top level mastered. It will still come back now and then.</li>`));
  if (stretch.length) lines.push(`<li>★ Stretch problems: ${stretchRight} of ${stretch.length} right.</li>`);
  if (again.length) lines.push(`<li>Practiced again from earlier days: ${againRight} of ${again.length} right${sess.cleared ? `, and ${sess.cleared} ${sess.cleared === 1 ? 'is' : 'are'} learned for good` : ''}.</li>`);
  return lines.length ? `<section><h2>This round</h2><ul class="ups">${lines.join('')}</ul></section>` : '';
}

function renderDone() {
  const score = sess.results.filter(Boolean).length, n = sess.results.length;
  const head = tr()
    ? (score >= n - 1 ? greet('Bully') + ' A splendid charge!' : score >= n * 0.7 ? greet('Dee-lighted') + ' Fine work!' : greet('A good, strenuous effort'))
    : (score >= n - 1 ? greet('Wonderful work') : score >= n * 0.7 ? greet('Strong work') : greet('Good practice'));
  const ups = lastChanges.filter(c => c[1] === 'up');
  const ph = sess.photo;
  return `
  <div class="done-head">
    ${ph ? `<figure class="tr-photo"><img src="${ph.src}" alt="${esc(ph.alt)}"><figcaption>Col. Roosevelt is dee-lighted!</figcaption></figure>` : ''}
    <div class="done-text">
      <h1>${head}</h1>
      <p class="meta">${score} of ${n} right on the first try.</p>
      <div class="stars">${sess.results.map(starSvg).join('')}</div>
    </div>
  </div>
  ${roundNews()}
  ${ups.length ? `<section><h2>Moving up</h2><ul class="ups">${ups.map(([k]) => `<li>${SKILLS[k].name}: now level ${state.levels[k]}, ${esc(SKILLS[k].levels[state.levels[k] - 1])}</li>`).join('')}</ul></section>` : ''}
  ${handsOn()}
  <div class="row-btns"><button class="start" data-act="start">Another ${state.perSession}</button><button class="ghost" data-act="home">Home</button></div>`;
}

function renderParent() {
  const slips = Object.entries(state.slips).filter(([k]) => !k.endsWith('|counting slip')).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const lv = ORDER.map(k => {
    const L = state.levels[k], max = SKILLS[k].levels.length, r = state.rec[k] || [];
    return `<div class="lvl"><div><strong>${SKILLS[k].name}</strong><small>${state.mastered[k] ? '<b class="tag stretch">Mastered</b> ' : ''}${esc(SKILLS[k].levels[L - 1])}${r.length ? ` · ${r.filter(Boolean).length} of last ${r.length} right first try` : ''}</small>
      ${confirmTopic === k ? `<span class="row-btns topic-reset"><button class="link danger-text" data-act="topic-reset-yes" data-k="${k}">Yes, reset ${SKILLS[k].name}</button><button class="link" data-act="topic-reset-no">Cancel</button></span>` : `<button class="link small-link" data-act="topic-reset" data-k="${k}">Reset</button>`}</div>
      <div class="stepper"><button data-act="lvl" data-k="${k}" data-d="-1" aria-label="Lower ${SKILLS[k].name} level" ${L <= 1 ? 'disabled' : ''}>−</button><span>${L}/${max}</span><button data-act="lvl" data-k="${k}" data-d="1" aria-label="Raise ${SKILLS[k].name} level" ${L >= max ? 'disabled' : ''}>+</button></div></div>`;
  }).join('');
  return `
  <header class="top"><h1>For grown-ups</h1><button class="ghost" data-act="home">${childName() ? `Back to ${esc(childName())}` : 'Back'}</button></header>
  <section>
    <h2>Levels</h2>
    <p class="note">A topic moves up after 5 in a row, 7 of the last 8, or 3 ★ stretch problems in a row, all right on the first try. It moves back down after 4 misses in 6. Finishing the top level masters a topic and turns on the next one. You can nudge levels yourself here.</p>
    <div class="levels">${lv}</div>
  </section>
  <section>
    <h2>Settings</h2>
    ${nameForm("Child's name", 'Save')}
    <div class="row-btns"><span>Answers</span><div class="seg"><button data-act="mode" data-v="choose" aria-pressed="${state.answerMode !== 'type'}">Pick from four</button><button data-act="mode" data-v="type" aria-pressed="${state.answerMode === 'type'}">Type the number</button></div></div>
    <p class="note">Typing tests real recall and gives practice writing numerals. Problems whose answer is a word, a time or a sign still show choices.</p>
    <div class="row-btns"><span>Problems per round</span><div class="seg">${[5, 10, 15].map(n => `<button data-act="per" data-n="${n}" aria-pressed="${state.perSession === n}">${n}</button>`).join('')}</div></div>
    <div class="row-btns"><span>End-of-round cheer</span><div class="seg"><button data-act="narr" data-v="tr" aria-pressed="${tr()}">Colonel Roosevelt</button><button data-act="narr" data-v="plain" aria-pressed="${!tr()}">Plain</button></div></div>
    ${canSpeak ? `<div class="row-btns"><label for="voice">Voice</label>
      <select id="voice" class="pick">${['', ...voices.map(v => v.name)].map(nm => `<option value="${esc(nm)}" ${nm === savedVoiceName() ? 'selected' : ''}>${nm ? esc(nm) : `Automatic${chosenVoice() ? ` (${esc(chosenVoice().name)})` : ''}`}</option>`).join('')}</select>
      <button class="ghost" data-act="try-voice">Try it</button></div>
    <p class="note">Voices come from this device. On an iPad or Mac, much better ones are free under Settings → Accessibility → Spoken Content → System Voice → Manage Voices. Look for “Enhanced” or “Premium” English voices (Daniel or Arthur suit the Colonel), then pick one here. The choice is remembered on each device.</p>` : ''}
    <div class="row-btns"><span>Read aloud</span><div class="seg">${[['all', 'Every problem'], ['stories', 'Stories only'], ['off', 'Off']].map(([v, t]) => `<button data-act="read" data-v="${v}" aria-pressed="${state.voice === v}">${t}</button>`).join('')}</div></div>
    <p class="note">${state.voice === 'off' ? 'Nothing is read out on its own. The speaker button still reads a problem when tapped.' : state.voice === 'stories' ? 'Story problems and instructions are read out. Plain number problems stay quiet.' : 'Every problem is read out when it appears.'}</p>
  </section>
  ${renderStories()}
  ${renderReview()}
  <section>
    <h2>Paper practice</h2>
    <p class="note">Print ${state.perSession} problems from the topics turned on at home, with boxes for writing the answers and an answer key on the last page.</p>
    <div class="row-btns"><button class="ghost" data-act="print">Print a paper round</button></div>
  </section>
  <section>
    <h2>Common slips</h2>
    ${slips.length ? `<ul class="list">${slips.map(([k, n]) => { const [s, t] = k.split('|'); return `<li><span>${SKILLS[s] ? SKILLS[s].name : s}: ${esc(t)}</span><span>${n}×</span></li>`; }).join('')}</ul>` : '<p class="note">Wrong answers are sorted by the kind of mistake (forgot to carry, added instead of multiplied). They will show up here.</p>'}
  </section>
  <section>
    <h2>Recent rounds</h2>
    ${state.sessions.length ? `<ul class="list">${state.sessions.slice(0, 8).map(s => `<li><span>${fmtDate(s.d)} · ${s.skills.map(k => SKILLS[k] ? SKILLS[k].name : k).join(', ')}</span><span>${s.score}/${s.n}</span></li>`).join('')}</ul>` : '<p class="note">No rounds yet.</p>'}
    ${state.log.length ? `<p class="note">Level changes: ${state.log.slice(0, 5).map(l => `${SKILLS[l.k].name} ${{ up: '↑', down: '↓', mastered: '✓', unlocked: 'unlocked' }[l.dir] || ''}${l.dir === 'up' || l.dir === 'down' ? ' ' + l.to : ''} (${fmtDate(l.d)})`).join(' · ')}</p>` : ''}
  </section>
  <section>
    <h2>Goal</h2>
    <p class="note">Pick the goal topic on the home screen. It comes up more often in rounds until the goal is met.</p>
    <div class="row-btns"><span>Goal size</span><div class="seg">${GOAL_SIZES.map(n => `<button data-act="goal-size" data-n="${n}" aria-pressed="${state.goal.target === n}">${n}</button>`).join('')}</div></div>
    <div class="row-btns">
      <span>${SKILLS[goalSkill()].name}: ${goalDone()} of ${state.goal.target} done</span>
      ${confirmReset ? `<button class="ghost danger" data-act="reset-yes">Yes, start a new ${state.goal.target}</button><button class="link" data-act="reset-no">Cancel</button>` : `<button class="ghost" data-act="reset">Start a new ${state.goal.target}</button>`}
    </div>
  </section>
  <section>
    <h2>Start over</h2>
    <p class="note">Clears levels, scores, the review list, goals and recent rounds, and resets which topics are on. Keeps the name, settings and sync. ${syncAvailable && sync.code ? 'Synced devices will start over too.' : ''}</p>
    <div class="row-btns">
      ${confirmWipe ? `<button class="ghost danger" data-act="wipe-yes">Yes, erase all progress</button><button class="link" data-act="wipe-no">Cancel</button>` : `<button class="ghost danger" data-act="wipe">Reset all progress</button>`}
    </div>
    ${wiped ? '<p class="note">Progress cleared. Everything starts fresh.</p>' : ''}
  </section>
  ${renderSync()}`;
}

// Clears one topic's progress; other topics and the round history stay as they are.
function resetTopic(k) {
  state.levels[k] = defaultState().levels[k];
  delete state.rec[k]; delete state.stretch[k]; delete state.mastered[k];
  state.done[k] = 0; state.goalBase[k] = 0;
  state.cards = state.cards.filter(c => c.skill !== k);
  for (const key of Object.keys(state.slips)) if (key.startsWith(k + '|')) delete state.slips[key];
}

function renderStories() {
  const season = currentSeason();
  return `<section>
    <h2>Story worlds</h2>
    <p class="note">Story problems come from the worlds turned on here, plus the season's festival when seasonal stories are on.</p>
    <div class="chips">${Object.keys(WORLDS).map(k => `<button class="chip" data-act="world" data-k="${k}" aria-pressed="${!!state.worlds[k]}"><strong>${esc(WORLDS[k].name())}</strong></button>`).join('')}</div>
    <div class="row-btns"><span>Seasonal stories</span><div class="seg"><button data-act="seasonal" data-v="1" aria-pressed="${state.seasonal}">On</button><button data-act="seasonal" data-v="0" aria-pressed="${!state.seasonal}">Off</button></div><span class="note">This month: ${esc(season.name)}</span></div>
    <form class="name-form" id="cast-form">
      <label for="cast-friends">${esc(WORLDS.hunter.name())}: friends</label>
      <input id="cast-friends" class="pick cast-input" maxlength="200" value="${esc(state.cast.friends)}" placeholder="Fu Dog, Cool Dracula" autocomplete="off">
      <label for="cast-villains">Villains</label>
      <input id="cast-villains" class="pick cast-input" maxlength="200" value="${esc(state.cast.villains)}" placeholder="the Death Raccoon" autocomplete="off">
      <div class="row-btns"><button class="ghost" type="submit">Save characters</button>${castSaved ? '<span class="note">Saved.</span>' : ''}</div>
      <p class="note">Separate names with commas. Write "the" in front of a name if the story should say "the Death Raccoon."</p>
    </form>
  </section>`;
}

function renderReview() {
  const cards = state.cards.slice().sort((a, b) => a.due - b.due);
  const when = d => { const days = Math.round((d - startOfDay()) / DAY); return days <= 0 ? 'today' : days === 1 ? 'tomorrow' : `in ${days} days`; };
  return `<section>
    <h2>Coming back for review</h2>
    <p class="note">Anything missed comes back tomorrow, then after 3, 7, 14 and 30 days while it keeps getting answered right. The first time it's the same problem, after that new numbers. ${state.cleared ? `${state.cleared} learned for good so far.` : ''}</p>
    ${cards.length ? `<ul class="list">${cards.slice(0, 12).map(c => `<li><span>${SKILLS[c.skill] ? SKILLS[c.skill].name : c.skill} · ${esc(SKILLS[c.skill]?.levels[c.level - 1] || '')}</span><span>${when(c.due)} · step ${c.box + 1} of ${REVIEW_DAYS.length}</span></li>`).join('')}</ul>${cards.length > 12 ? `<p class="note">and ${cards.length - 12} more</p>` : ''}` : '<p class="note">Nothing to review yet.</p>'}
  </section>`;
}

function renderSync() {
  if (!syncAvailable) return '<p class="note">Progress is saved on this device.</p>';
  if (!sync.code) return `
  <section>
    <h2>Sync between devices</h2>
    <p class="note">Progress is saved on this device. Turn on sync to share it with another iPad, phone or laptop. You get a private code to type in on the other device.</p>
    <div class="row-btns"><button class="ghost" data-act="sync-new">Turn on sync</button></div>
    <div class="row-btns">
      <label for="join-code">Already have a code?</label>
      <input id="join-code" class="pick code-input" placeholder="ABCD-EFGH-JKMN" autocomplete="off" autocapitalize="characters" spellcheck="false">
      <button class="ghost" data-act="sync-join">Join</button>
    </div>
    ${sync.error === 'bad-code' ? '<p class="note danger-text">That code should be 12 letters and numbers, like ABCD-EFGH-JKMN.</p>' : ''}
  </section>`;
  const when = sync.lastAt ? new Date(sync.lastAt).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) : '';
  const status = sync.status === 'ok' ? `Synced${when ? ' at ' + when : ''}.`
    : sync.status === 'syncing' ? 'Syncing…'
    : sync.error === 'offline' ? 'Offline. Progress is safe on this device and will sync when you are back online.'
    : `Could not sync (${esc(sync.error)}). Progress is safe on this device.`;
  return `
  <section>
    <h2>Sync between devices</h2>
    <p class="note">Type this code into the grown-ups page on another device to share progress. Keep it private.</p>
    <div class="row-btns"><strong class="sync-code" id="sync-code">${esc(sync.code)}</strong><button class="ghost" data-act="sync-copy">Copy</button></div>
    <p class="note">${status}</p>
    <div class="row-btns"><button class="ghost" data-act="sync-now">Sync now</button><button class="link" data-act="sync-off">Stop syncing on this device</button></div>
  </section>`;
}

function render(shake) {
  app.innerHTML = screen === 'play' ? renderPlay() : screen === 'done' ? renderDone() : screen === 'parent' ? renderParent() : renderHome();
  if (shake) { const el = document.querySelector('.choices'); el && el.classList.add('shake'); }
  if (screen === 'play' && sess.probs[sess.i].done) document.getElementById('next')?.focus();
}

app.addEventListener('click', e => {
  const b = e.target.closest('[data-act]');
  if (!b) return;
  const act = b.dataset.act;
  if (act === 'start') startSession();
  else if (act === 'pick') answer(+b.dataset.i);
  else if (act === 'key') keyIn(b.dataset.k);
  else if (act === 'mode') { state.answerMode = b.dataset.v; save(); render(); }
  else if (act === 'print') printRound();
  else if (act === 'next') next();
  else if (act === 'say') { const p = sess.probs[sess.i]; say(p.speak || spoken(p.q || '')); }
  else if (act === 'home') { screen = 'home'; confirmReset = false; confirmWipe = false; wiped = false; confirmTopic = null; render(); }
  else if (act === 'parent') { screen = 'parent'; render(); }
  else if (act === 'chip') { state.on[b.dataset.k] = !state.on[b.dataset.k]; save(); render(); }
  else if (act === 'lvl') { const k = b.dataset.k; state.levels[k] = Math.max(1, Math.min(SKILLS[k].levels.length, state.levels[k] + +b.dataset.d)); state.rec[k] = []; save(); render(); }
  else if (act === 'per') { state.perSession = +b.dataset.n; save(); render(); }
  else if (act === 'narr') { state.narrator = b.dataset.v; save(); render(); say(tr() ? 'Bully! Colonel Roosevelt, reporting for arithmetic duty!' : `${greet('Hello')} Ready for some math?`, true); }
  else if (act === 'try-voice') say('Seven times eight is fifty-six.');
  else if (act === 'read') { state.voice = b.dataset.v; save(); render(); }
  else if (act === 'sync-new') { startSync(newCode()); render(); }
  else if (act === 'sync-join') {
    const code = cleanCode(document.getElementById('join-code')?.value || '');
    if (!code) { sync.error = 'bad-code'; render(); return; }
    sync.error = ''; startSync(code); render();
  }
  else if (act === 'sync-now') { sync.status = 'syncing'; render(); pullRemote(); }
  else if (act === 'sync-off') { stopSync(); render(); }
  else if (act === 'sync-copy') {
    navigator.clipboard?.writeText(sync.code).then(() => { b.textContent = 'Copied'; }, () => {
      const r = document.createRange(); r.selectNodeContents(document.getElementById('sync-code'));
      const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r);
    });
  }
  else if (act === 'world') { state.worlds[b.dataset.k] = !state.worlds[b.dataset.k]; save(); render(); }
  else if (act === 'seasonal') { state.seasonal = b.dataset.v === '1'; save(); render(); }
  else if (act === 'topic-reset') { confirmTopic = b.dataset.k; render(); }
  else if (act === 'topic-reset-no') { confirmTopic = null; render(); }
  else if (act === 'topic-reset-yes') { resetTopic(b.dataset.k); confirmTopic = null; save(); render(); }
  else if (act === 'wipe') { confirmWipe = true; wiped = false; render(); }
  else if (act === 'wipe-no') { confirmWipe = false; render(); }
  else if (act === 'wipe-yes') {
    const keep = { childName: state.childName, voice: state.voice, answerMode: state.answerMode, narrator: state.narrator, perSession: state.perSession };
    state = Object.assign(defaultState(), keep);
    confirmWipe = false; wiped = true; sess = null; lastChanges = [];
    save(); render();
  }
  else if (act === 'reset') { confirmReset = true; render(); }
  else if (act === 'reset-no') { confirmReset = false; render(); }
  else if (act === 'reset-yes') { state.goalBase[goalSkill()] = state.done[goalSkill()] || 0; confirmReset = false; save(); render(); }
  else if (act === 'goal-size') { state.goal.target = +b.dataset.n; save(); render(); }
});
app.addEventListener('submit', e => {
  if (e.target.id === 'cast-form') {
    e.preventDefault();
    state.cast = { friends: document.getElementById('cast-friends').value.trim(), villains: document.getElementById('cast-villains').value.trim() };
    castSaved = true; save(); render();
    return;
  }
  if (e.target.id !== 'name-form') return;
  e.preventDefault();
  state.childName = (document.getElementById('child-name')?.value || '').trim().slice(0, 24);
  save(); render();
});
app.addEventListener('change', e => {
  if (e.target.id === 'goal-skill') { state.goal.skill = e.target.value; state.on[e.target.value] = true; save(); render(); return; }
  if (e.target.id !== 'voice') return;
  try { if (e.target.value) localStorage.setItem(VOICE_KEY, e.target.value); else localStorage.removeItem(VOICE_KEY); } catch (err) {}
  render();
  say('How does this voice sound?');
});
document.addEventListener('keydown', e => {
  if (screen !== 'play') return;
  const p = sess.probs[sess.i];
  if (p.done) return;
  if (typeable(p)) {
    if (/^[0-9]$/.test(e.key)) keyIn(e.key);
    else if (e.key === 'Backspace') keyIn('del');
    else if (e.key === '-' && p.neg) keyIn('neg');
    else if (e.key === 'Enter') { e.preventDefault(); keyIn('ok'); }
  } else if (['1', '2', '3', '4'].includes(e.key) && +e.key <= p.choices.length) answer(+e.key - 1);
});
render();
initSync();
if (canSpeak) { loadVoices(); try { speechSynthesis.addEventListener('voiceschanged', loadVoices); } catch (e) {} }
