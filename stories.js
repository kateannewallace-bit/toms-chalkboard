/* ---------- story problems: worlds, seasons and the cast ----------
   Each world has one template per kind of problem. A template gets the numbers (n) and the cast (c)
   and returns the story. Kinds by level:
     1–2: add, sub (take away), more (compare), need (how many more are needed)
     3:   groups (multiply)
     4:   share (divide), groupsPlus and addSub (two steps)
   These run only when a problem is made, so they can use rand/pick/N/state from app.js. */

const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

const WORLDS = {
  hunter: {
    name: () => `${N()} the Hunter`,
    t: {
      add: ({ a, b }, c) => `${c.H} found ${a} silver arrows by the Bone Bridge. ${c.F} found ${b} more in the Whispering Woods. How many arrows do they have now?`,
      sub: ({ a, b }, c) => `${c.H} had ${a} glowing mushrooms. ${cap(c.V)} snatched ${b} of them and ran off into the Moonlit Marsh! How many mushrooms are left?`,
      more: ({ a, b }, c) => `${c.F} counted ${a} muddy footprints left by ${c.V}. ${c.H} counted ${b}. How many more footprints did ${c.F} count?`,
      need: ({ T, a }, c) => `To build a trap for ${c.V}, ${c.H} needs ${T} sticks. ${c.F} has gathered ${a}. How many more sticks are needed?`,
      groups: ({ a, b }, c) => `${c.F} brought ${a} pouches with ${b} magic acorns in each pouch. How many magic acorns is that?`,
      share: ({ N, g }, c) => `${c.H} found ${N} gold coins in the hideout of ${c.V} and shared them equally among ${g} friends. How many coins does each friend get?`,
      groupsPlus: ({ a, b, c: x }, c) => `${c.H} filled ${a} quivers with ${b} arrows each. Then ${c.F} added ${x} more arrows. How many arrows altogether?`,
      addSub: ({ a, b, c: x }, c) => `${c.H} had ${a} gold coins and found ${b} more. Then the troll under the Bone Bridge charged ${x} coins to cross. How many coins are left?`,
    },
  },
  knights: {
    name: () => 'Knights & dragons',
    t: {
      add: ({ a, b }, c) => `${cap(c.D)} keeps ${a} golden eggs in one cave and ${b} in another. How many golden eggs does ${c.D} guard?`,
      sub: ({ a, b }, c) => `${c.K} found ${a} gems in the hoard of ${c.D}. The dragon woke with a ROAR, and ${b} gems tumbled down a crack in the rock! How many gems are left?`,
      more: ({ a, b }) => `There are ${a} knights at the round table and ${b} squires by the fire. How many more knights than squires?`,
      need: ({ T, a }, c) => `The castle wall needs ${T} stones before ${c.D} comes back. The builders have set ${a}. How many more stones do they need?`,
      groups: ({ a, b }, c) => `${a} knights ride out to face ${c.D}. Each knight carries ${b} apples for the long road. How many apples is that?`,
      share: ({ N, g }, c) => `${cap(c.D)} gave back ${N} stolen shields. The knights shared them equally among ${g} castles. How many shields does each castle get?`,
      groupsPlus: ({ a, b, c: x }) => `The king's archers stand in ${a} rows of ${b}. Then ${x} more archers gallop in. How many archers are ready?`,
      addSub: ({ a, b, c: x }, c) => `${cap(c.D)} breathed ${a} puffs of fire on Monday and ${b} on Tuesday. ${c.K} blocked ${x} of them with a shield. How many puffs of fire got past?`,
    },
  },
  pixies: {
    name: () => 'Cornish pixies',
    t: {
      add: ({ a, b }) => `The Cornish pixies baked ${a} saffron buns for the moonlight dance and ${b} more for breakfast. How many saffron buns did they bake?`,
      sub: ({ a, b }) => `A knocker deep in the tin mine had ${a} shiny tin nuggets. Knock, knock! ${b} of them rolled away down the dark tunnel. How many nuggets are left?`,
      more: ({ a, b }) => `Out on Bodmin Moor, ${a} pixies are dancing in a fairy ring and ${b} are watching from the heather. How many more are dancing than watching?`,
      need: ({ T, a }) => `Joan the Wad, queen of the pixies, needs ${T} glow-worms to light the way home. She has ${a}. How many more glow-worms does she need?`,
      groups: ({ a, b }) => `The pixies hung ${a} strings of acorn-cap cups under the hawthorn, with ${b} cups on each string. How many acorn cups?`,
      share: ({ N, g }, c) => `${c.me} left ${N} crumbs of pasty on the windowsill. ${g} pixies shared them equally. How many crumbs did each pixie get?`,
      groupsPlus: ({ a, b, c: x }) => `There are ${a} pixie houses under the hawthorn tree with ${b} pixies in each. Then ${x} more pixies come home from the moor. How many pixies are there now?`,
      addSub: ({ a, b, c: x }) => `The pixies led a lost traveller in circles. He walked ${a} steps, then ${b} more, then ${x} steps back again. How many steps is he from where he started?`,
    },
  },
  tailypo: {
    name: () => 'The Tailypo',
    t: {
      add: ({ a, b }) => `Way down in the holler, the old man's hound Uno barked ${a} times and his hound Ino barked ${b} times. How many barks in all?`,
      sub: ({ a, b }) => `The old man had ${a} corn cakes for supper. Then the Tailypo crept in and ate ${b}! How many corn cakes were left?`,
      more: ({ a, b }) => `"Tailypo, tailypo!" The creature scratched at the door ${a} times and at the window ${b} times. How many more scratches were at the door?`,
      need: ({ T, a }) => `The old man needs ${T} logs to keep the fire bright till morning. He has ${a}. How many more logs does he need?`,
      groups: ({ a, b }) => `The old man's ${a} hounds each found ${b} tracks in the snow. How many tracks did they find?`,
      share: ({ N, g }) => `The old man shared ${N} biscuits equally among his ${g} hounds. How many biscuits did each hound get?`,
      groupsPlus: ({ a, b, c: x }) => `The Tailypo left ${a} rows of footprints with ${b} prints in each row, and then ${x} more right by the door. How many footprints?`,
      addSub: ({ a, b, c: x }) => `The old man counted ${a} stars over the holler, then ${b} more. Then clouds rolled in and hid ${x}. How many stars can he still see?`,
    },
  },
  greek: {
    name: () => 'Greek myths & the Odyssey',
    t: {
      add: ({ a, b }) => `Odysseus and his crew rowed ${a} miles on Monday and ${b} miles on Tuesday. How far did they row?`,
      sub: ({ a, b }) => `The Cyclops Polyphemus had ${a} sheep in his cave. Odysseus's men escaped clinging underneath ${b} of them! How many sheep stayed in the cave?`,
      more: ({ a, b }) => `Medusa has ${a} snakes for hair. Her sister has ${b}. How many more snakes does Medusa have?`,
      need: ({ T, a }) => `Athena's owl must carry ${T} messages before dawn. It has carried ${a}. How many more messages are left to carry?`,
      groups: ({ a, b }) => `Odysseus has ${a} ships, and each ship has ${b} oars. How many oars is that?`,
      share: ({ N, g }) => `Odysseus shared ${N} olives equally among ${g} hungry sailors. How many olives did each sailor get?`,
      groupsPlus: ({ a, b, c: x }) => `Hercules carried ${a} baskets with ${b} golden apples in each from the Garden of the Hesperides, plus ${x} more tucked in his lion-skin cloak. How many golden apples?`,
      addSub: ({ a, b, c: x }) => `Penelope wove ${a} rows of her weaving on one day and ${b} rows the next. Then, secretly at night, she unpicked ${x} rows. How many rows were left?`,
    },
  },
  egypt: {
    name: () => 'Egyptian gods',
    t: {
      add: ({ a, b }) => `Set, god of storms, whipped up ${a} sandstorms in the red desert, then ${b} more. How many sandstorms did Set make?`,
      sub: ({ a, b }) => `Ra's sun boat carried ${a} lamps through the night. The serpent Apophis swallowed ${b} before Set speared the serpent! How many lamps were left?`,
      more: ({ a, b }) => `Thoth, the wise ibis-headed god of writing, wrote ${a} scrolls. Anubis wrote ${b}. How many more scrolls did Thoth write?`,
      need: ({ T, a }) => `The builders need ${T} stone blocks to finish the top of the pyramid. They have ${a}. How many more blocks do they need?`,
      groups: ({ a, b }) => `There are ${a} sacred cats in the temple of Bastet, and each cat has ${b} kittens. How many kittens?`,
      share: ({ N, g }) => `Set shared ${N} desert dates equally among ${g} jackals. How many dates did each jackal get?`,
      groupsPlus: ({ a, b, c: x }) => `${a} boats sail down the Nile, each carrying ${b} jars of honey. Then ${x} more jars arrive by donkey. How many jars of honey?`,
      addSub: ({ a, b, c: x }) => `Set's storm blew ${a} scorpions into the temple, then ${b} more. The priests swept ${x} back out the door. How many scorpions are still inside?`,
    },
  },
  shakespeare: {
    name: () => 'Shakespeare',
    t: {
      add: ({ a, b }) => `In the enchanted forest, Puck played ${a} tricks before midnight and ${b} tricks after. How many tricks did Puck play?`,
      sub: ({ a, b }) => `The three witches had ${a} bat wings. "Double, double, toil and trouble!" They dropped ${b} into the cauldron. How many bat wings are left?`,
      more: ({ a, b }) => `On Prospero's island, Ariel sang ${a} songs and Caliban grumbled ${b} grumbles. How many more songs than grumbles?`,
      need: ({ T, a }) => `Titania, the fairy queen, needs ${T} flower crowns for the fairy ball. Her fairies have made ${a}. How many more crowns do they need?`,
      groups: ({ a, b }) => `The players acted their play ${a} times, with ${b} actors on stage each time. How many times did an actor walk on stage?`,
      share: ({ N, g }) => `Bottom, who has a donkey's head, shared ${N} oat cakes equally among ${g} fairies. How many oat cakes did each fairy get?`,
      groupsPlus: ({ a, b, c: x }) => `The fairies hung ${a} strings of ${b} glowing lanterns in the forest. Then Puck added ${x} more. How many lanterns are glowing?`,
      addSub: ({ a, b, c: x }) => `Prospero's storm sent ${a} big waves, then ${b} more. Ariel calmed ${x} of them. How many waves are still crashing?`,
    },
  },
  nature: {
    name: () => 'The nature table',
    t: {
      add: ({ a, b }, c) => `${c.me} found ${a} acorns under the oak tree, then ${b} more. How many acorns is that now?`,
      sub: ({ a, b }) => `There were ${a} beeswax candles on the nature table. ${b} burned down. How many are still burning?`,
      more: ({ a, b }) => `The hens laid ${a} eggs and the ducks laid ${b}. How many more eggs did the hens lay?`,
      need: ({ T, a }) => `The garden gnome needs ${T} stones for a wall around the herb bed. He has ${a}. How many more stones does he need?`,
      groups: ({ a, b }) => `There are ${a} baskets with ${b} pears in each basket. How many pears?`,
      share: ({ N, g }) => `${N} strawberries are shared equally among ${g} gnomes. How many strawberries does each gnome get?`,
      groupsPlus: ({ a, b, c: x }, c) => `${c.me} has ${a} bags with ${b} marbles in each bag, then finds ${x} more. How many marbles now?`,
      addSub: ({ a, b, c: x }, c) => `${c.me} picked ${a} blackberries, then ${b} more, then ate ${x}. How many blackberries are in the basket?`,
    },
  },
};

// Waldorf festival year: one seasonal set per month
const SEASONS = {
  1: { name: 'Winter', things: 'snowballs', place: 'in the snowy garden', containers: 'buckets', helper: 'Jack Frost', event: 'the snow fort', lose: b => `The winter sun melted ${b} of them.` },
  2: { name: 'Candlemas', things: 'beeswax candles', place: 'at the candle-dipping table', containers: 'boxes', helper: 'Grandmother', event: 'Candlemas', lose: b => `${b} of them snapped in the cold.` },
  3: { name: 'Spring', things: 'seeds', place: 'in the garden beds', containers: 'seed packets', helper: 'the garden gnome', event: 'spring planting', lose: b => `The blackbirds gobbled up ${b}!` },
  4: { name: 'Easter', things: 'painted eggs', place: 'in the meadow', containers: 'baskets', helper: 'the Easter hare', event: 'the egg hunt', lose: b => `The Easter hare hid ${b} of them all over again!` },
  5: { name: 'May Day', things: 'spring flowers', place: 'in the meadow', containers: 'garlands', helper: 'the May Queen', event: 'the Maypole dance', lose: b => `The wind blew ${b} of them away.` },
  6: { name: 'Midsummer', things: 'fireflies', place: 'in the twilight garden', containers: 'jars', helper: 'Puck', event: 'the Midsummer bonfire', lose: b => `${b} of them blinked away into the dark.` },
  7: { name: 'Summer', things: 'seashells', place: 'on the beach', containers: 'pails', helper: 'a friendly seal', event: 'the sandcastle contest', lose: b => `A big wave washed ${b} of them away.` },
  8: { name: 'Late summer', things: 'blackberries', place: 'along the hedgerow', containers: 'bowls', helper: 'Grandpa', event: 'the blackberry pie', lose: b => `The birds pecked ${b} of them.` },
  9: { name: 'Michaelmas', things: 'loaves of dragon bread', place: 'in the bakery', containers: 'baskets', helper: 'Saint Michael', event: 'the Michaelmas feast', lose: b => `A hungry dragon gobbled up ${b}!` },
  10: { name: 'Halloween', things: "jack-o'-lanterns", place: 'in the haunted hollow', containers: 'wagons', helper: 'Cool Dracula', event: 'the Halloween parade', lose: b => `A swarm of bats carried ${b} of them away!` },
  11: { name: 'Martinmas', things: 'paper lanterns', place: 'on the lantern walk', containers: 'strings', helper: 'Saint Martin', event: 'the lantern walk', lose: b => `The wind blew out ${b} of them.` },
  12: { name: 'Advent', things: 'straw stars', place: 'by the Advent spiral', containers: 'boxes', helper: 'Saint Nicholas', event: 'the Advent garden', lose: b => `The cat batted ${b} of them under the sofa!` },
};
function seasonWorld(m) {
  const v = SEASONS[m], t = v.things;
  return {
    name: () => v.name,
    t: {
      add: ({ a, b }, c) => `${c.me} gathered ${a} ${t} ${v.place}. ${cap(v.helper)} brought ${b} more. How many ${t} are there now?`,
      sub: ({ a, b }, c) => `${c.me} had ${a} ${t}. ${v.lose(b)} How many ${t} are left?`,
      more: ({ a, b }, c) => `${cap(v.helper)} has ${a} ${t}, and ${c.me} has ${b}. How many more does ${v.helper} have?`,
      need: ({ T, a }, c) => `${c.me} needs ${T} ${t} for ${v.event} and has ${a} so far. How many more are needed?`,
      groups: ({ a, b }) => `There are ${a} ${v.containers} with ${b} ${t} in each. How many ${t} is that?`,
      share: ({ N, g }, c) => `${c.me} shared ${N} ${t} equally among ${g} friends at ${v.event}. How many did each friend get?`,
      groupsPlus: ({ a, b, c: x }, c) => `${c.me} filled ${a} ${v.containers} with ${b} ${t} each, then found ${x} more. How many ${t} altogether?`,
      addSub: ({ a, b, c: x }, c) => `${c.me} had ${a} ${t} and found ${b} more ${v.place}. ${v.lose(x)} How many ${t} now?`,
    },
  };
}
const currentSeason = () => SEASONS[new Date().getMonth() + 1];

// Worlds that come up more often in their season
const WORLD_BOOST = { 6: ['shakespeare'], 7: ['greek'], 8: ['greek'], 9: ['knights'], 10: ['tailypo', 'shakespeare', 'hunter'], 11: ['tailypo'] };

// Dragons from real legends: Norse, English, Sussex and Welsh
const DRAGONS = ['Fafnir', 'the Lambton Worm', 'the Knucker', 'Y Ddraig Goch'];
function storyCast() {
  const list = s => String(s || '').split(',').map(x => x.trim()).filter(Boolean);
  const friends = list(state.cast.friends), villains = list(state.cast.villains);
  return { me: N(), H: `${N()} the Hunter`, K: `${N()} the knight`, D: pick(DRAGONS), F: pick(friends.length ? friends : ['Fu Dog']), V: pick(villains.length ? villains : ['the Death Raccoon']) };
}
function pickWorld() {
  const m = new Date().getMonth() + 1;
  if (state.seasonal && rng() < 0.35) return seasonWorld(m);
  let ids = Object.keys(WORLDS).filter(k => state.worlds[k]);
  if (!ids.length) ids = ['nature'];
  return WORLDS[pick(ids.flatMap(k => (WORLD_BOOST[m] || []).includes(k) ? [k, k, k] : [k]))];
}
function storyNums(kind, L) {
  const big = L >= 2;
  switch (kind) {
    case 'add': { const a = big ? rand(14, 48) : rand(3, 9), b = big ? rand(12, 45) : rand(2, 9); return { a, b }; }
    case 'sub': { const a = big ? rand(30, 90) : rand(8, 18), b = big ? rand(11, a - 12) : rand(2, a - 2); return { a, b }; }
    case 'more': { const a = big ? rand(25, 80) : rand(6, 15), b = big ? rand(11, a - 5) : rand(2, a - 1); return { a, b }; }
    case 'need': { const T = big ? rand(30, 90) : rand(8, 18), a = big ? rand(11, T - 8) : rand(2, T - 2); return { T, a }; }
    case 'groups': return { a: rand(2, 6), b: rand(3, 9) };
    case 'share': { const g = rand(2, 5), e = rand(2, 7); return { g, e, N: g * e }; }
    case 'groupsPlus': return { a: rand(2, 5), b: rand(3, 6), c: rand(2, 9) };
    default: { const a = rand(5, 15), b = rand(3, 12); return { a, b, c: rand(2, a + b - 2) }; }
  }
}
function storyAnswer(kind, n) {
  const { a, b, c, T, N: total, g, e } = n;
  switch (kind) {
    case 'add': return { ans: a + b, d: [[Math.abs(a - b), 'took away instead of adding'], ...(a >= 10 && (a % 10) + (b % 10) >= 10 ? [[a + b - 10, 'forgot to carry']] : [])], explain: `${a} + ${b} = ${a + b}` };
    case 'sub': return { ans: a - b, d: [[a + b, 'added instead of taking away']], explain: `${a} − ${b} = ${a - b}` };
    case 'more': return { ans: a - b, d: [[a + b, 'added instead of comparing'], [a, 'gave just one number']], explain: `${a} − ${b} = ${a - b}` };
    case 'need': return { ans: T - a, d: [[T + a, 'added instead of finding the gap'], [T, 'gave the total']], explain: `${a} + ${T - a} = ${T}, so ${T - a} more.` };
    case 'groups': return { ans: a * b, d: [[a + b, 'added instead of multiplied'], [a * (b + 1), 'next fact over']], explain: `${a} groups of ${b}: ${a} × ${b} = ${a * b}` };
    case 'share': return { ans: e, d: [[total - g, 'took away instead of sharing'], [g, 'picked the number of groups']], explain: `${g} × ${e} = ${total}, so each gets ${e}.` };
    case 'groupsPlus': return { ans: a * b + c, d: [[a * b, 'stopped after one step'], [a + b + c, 'added everything']], explain: `${a} × ${b} = ${a * b}, then ${a * b} + ${c} = ${a * b + c}` };
    default: return { ans: a + b - c, d: [[a + b, 'stopped after one step'], [a + b + c, 'added instead of taking away']], explain: `${a} + ${b} = ${a + b}, then ${a + b} − ${c} = ${a + b - c}` };
  }
}
const STORY_KINDS = { 1: ['add', 'sub', 'more', 'need'], 2: ['add', 'sub', 'more', 'need'], 3: ['groups'], 4: ['share', 'groupsPlus', 'addSub'] };

function genWords(L) {
  const kind = pick(STORY_KINDS[L] || STORY_KINDS[4]);
  const world = pickWorld(), n = storyNums(kind, L), cast = storyCast();
  const story = world.t[kind](n, cast);
  const { ans, d, explain } = storyAnswer(kind, n);
  return {
    skill: 'words', story, speak: story, ans, world: world.name(), explain,
    distract: [...d, [ans + 1, 'counting slip'], [ans - 1, 'counting slip'], [ans + 10, 'off by ten']],
  };
}
