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
      add: ({ a, b }, c) => `${c.H} found ${a} silver arrows by the Bone Bridge. ${cap(c.F)} found ${b} more in the Whispering Woods. How many arrows do they have now?`,
      sub: ({ a, b }, c) => `${c.H} had ${a} glowing mushrooms. ${cap(c.V)} snatched ${b} of them and ran off into the Moonlit Marsh! How many mushrooms are left?`,
      more: ({ a, b }, c) => `${cap(c.F)} counted ${a} muddy footprints left by ${c.V}. ${c.H} counted ${b}. How many more footprints did ${c.F} count?`,
      need: ({ T, a }, c) => `To build a trap for ${c.V}, ${c.H} needs ${T} sticks. ${cap(c.F)} has gathered ${a}. How many more sticks are needed?`,
      groups: ({ a, b }, c) => `${cap(c.F)} brought ${a} pouches with ${b} magic acorns in each pouch. How many magic acorns is that?`,
      share: ({ N, g }, c) => `${c.H} found ${N} gold coins in the hideout of ${c.V} and shared them equally among ${g} friends. How many coins does each friend get?`,
      groupsPlus: ({ a, b, c: x }, c) => `${c.H} filled ${a} quivers with ${b} arrows each. Then ${c.F} added ${x} more arrows. How many arrows altogether?`,
      addSub: ({ a, b, c: x }, c) => `${c.H} had ${a} gold coins and found ${b} more. Then the troll under the Bone Bridge charged ${x} coins to cross. How many coins are left?`,
    },
    // Stories for particular characters. Each is used only while a cast name contains its keyword.
    extra: [
      { kind: 'add', needs: 'gremlin', f: ({ a, b }) => `The gremlins stapled bacon to ${a} machines in the old workshop, then to ${b} more! How many machines have bacon stapled to them?` },
      { kind: 'sub', needs: 'gremlin', f: ({ a, b }, c) => `The gremlins stapled bacon to ${a} machines to ruin them. ${c.H} pulled the bacon off ${b}. How many machines still have bacon on them?` },
      { kind: 'groups', needs: 'gremlin', f: ({ a, b }) => `${a} gremlins each stapled bacon to ${b} machines. How many machines did the gremlins ruin?` },
      { kind: 'groups', needs: 'anansi', f: ({ a, b }) => `Anansi has ${a} sons, and each son spun ${b} webs in the baobab tree. How many webs did they spin?` },
      { kind: 'share', needs: 'anansi', f: ({ N, g }) => `Anansi tricked the sky god out of ${N} stories and shared them equally among ${g} of his sons. How many stories did each son get?` },
      { kind: 'more', needs: 'anansi', f: ({ a, b }) => `Anansi told ${a} tricky tales at the fire, and his sons told ${b}. How many more tales did Anansi tell?` },
      { kind: 'add', needs: 'kappa', f: ({ a, b }) => `Kappa the friendly yokai ate ${a} cucumbers at lunch and ${b} at supper. How many cucumbers did Kappa eat?` },
      { kind: 'need', needs: 'kappa', f: ({ T, a }) => `Kappa must keep the water dish on his head full, or he loses his strength! It holds ${T} drops and has ${a}. How many more drops does Kappa need?` },
      { kind: 'need', needs: 'asclepius', f: ({ T, a }) => `Asclepius, god of medicine, needs ${T} healing herbs to cure a sick griffin. He has ${a}. How many more herbs does he need?` },
      { kind: 'groupsPlus', needs: 'asclepius', f: ({ a, b, c: x }) => `Asclepius mixed ${a} bottles of medicine with ${b} drops of honey in each, then added ${x} more drops for luck. How many drops of honey did he use?` },
      { kind: 'add', needs: 'tommyknocker', f: ({ a, b }) => `Deep in the mine, the Tommyknocker knocked ${a} times to warn of a cave-in, then ${b} more times. How many knocks?` },
      { kind: 'addSub', needs: 'tommyknocker', f: ({ a, b, c: x }) => `The Tommyknocker found ${a} silver nuggets, then ${b} more, and left ${x} as a gift for the miners. How many nuggets does he have left?` },
      { kind: 'add', needs: 'huspalim', f: ({ a, b }) => `The Huspalim took ${a} giant steps across the river and ${b} more up the hill. How many giant steps?` },
      { kind: 'groups', needs: 'huspalim', f: ({ a, b }) => `The Huspalim carried ${a} armfuls of firewood with ${b} logs in each. How many logs?` },
      { kind: 'sub', needs: 'cave witch', f: ({ a, b }, c) => `The Somalian Cave Witch had ${a} jars of bad spells. ${c.H} smashed ${b} of them! How many jars of spells are left?` },
      { kind: 'more', needs: 'cave witch', f: ({ a, b }, c) => `The Somalian Cave Witch has ${a} bats in her cave. ${c.H} has ${b} lanterns to chase them out. How many more bats than lanterns?` },
      { kind: 'add', needs: 'bigfoot', f: ({ a, b }) => `Black Bigfoot, the Death Raccoon's sidekick, left ${a} giant footprints in the mud and ${b} more in the snow. How many footprints?` },
      { kind: 'need', needs: 'bigfoot', f: ({ T, a }, c) => `${c.H} needs ${T} feet of rope to tie up Black Bigfoot. ${cap(c.F)} brought ${a} feet. How many more feet of rope are needed?` },
      { kind: 'sub', needs: 'church vampire', f: ({ a, b }, c) => `The Church Vampires crept toward ${a} sleeping pets. ${c.H} rescued ${b} of them just in time! How many pets still need rescuing?` },
      { kind: 'share', needs: 'church vampire', f: ({ N, g }, c) => `${c.H} hid ${N} rescued pets from the Church Vampires, sharing them equally among ${g} secret hiding places. How many pets are in each hiding place?` },
      { kind: 'groups', needs: 'blue-eyed', f: ({ a, b }) => `${a} blue-eyed Tailypos came to the birthday party, and each one made ${b} presents with its two tails. How many presents?` },
      { kind: 'groupsPlus', needs: 'blue-eyed', f: ({ a, b, c: x }) => `The blue-eyed Tailypos wrapped ${a} birthday presents with ${b} bows on each, then tied ${x} extra bows on the biggest one. How many bows?` },
      { kind: 'addSub', needs: 'tailypo', f: ({ a, b, c: x }) => `Nobody knows if the Tailypo is good or bad. On Monday it took ${a} socks from the clothesline, on Tuesday ${b} more, and on Wednesday it gave ${x} back. How many socks does the Tailypo still have?` },
    ],
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
// Hand-written seasonal stories for every month: Waldorf festivals, nature and folklore.
// The simple pattern stories above are an occasional extra (at most once a round).
const SEASON_STORIES = {
  1: [
    { kind: 'add', f: ({ a, b }) => `Jack Frost painted ${a} ferns of ice on the kitchen window and ${b} more on the door. How many frost ferns did he paint?` },
    { kind: 'add', f: ({ a, b }) => `The frost giants of the North stomped ${a} times on Monday and ${b} times on Tuesday, shaking snow off the mountains. How many stomps?` },
    { kind: 'sub', f: ({ a, b }, c) => `${c.me} built an army of ${a} snowmen. The winter sun came out and melted ${b}. How many snowmen are still standing guard?` },
    { kind: 'more', f: ({ a, b }) => `${a} sparrows came to the bird feeder and ${b} chickadees. How many more sparrows than chickadees?` },
    { kind: 'need', f: ({ T, a }) => `Old Man Winter needs ${T} snowflakes to finish his white blanket over the meadow. He has sent down ${a}. How many more snowflakes must fall?` },
    { kind: 'groups', f: ({ a, b }) => `${a} sleds raced down Gnome Hill, each carrying ${b} gnomes in red caps. How many gnomes went sledding?` },
    { kind: 'share', f: ({ N, g }, c) => `${c.me} shared ${N} roasted chestnuts equally among ${g} friends by the fire. How many chestnuts did each friend get?` },
    { kind: 'groupsPlus', f: ({ a, b, c: x }) => `The snow fort has ${a} walls with ${b} snowballs stacked on each, plus ${x} in the secret stash. How many snowballs?` },
    { kind: 'addSub', f: ({ a, b, c: x }) => `${a} icicles hung from the barn roof, and ${b} more grew overnight. At noon, ${x} melted and dripped away. How many icicles are left?` },
  ],
  2: [
    { kind: 'add', f: ({ a, b }) => `For Candlemas, Grandmother dipped ${a} beeswax candles in the morning and ${b} in the afternoon. How many candles did she dip?` },
    { kind: 'sub', f: ({ a, b }) => `Saint Brigid's cows gave ${a} pails of milk. A hungry fox tipped over ${b}. How many pails are left?` },
    { kind: 'more', f: ({ a, b }) => `The badger peeked out of its den ${a} times this week, and the hedgehog peeked out ${b} times. How many more peeks did the badger take?` },
    { kind: 'need', f: ({ T, a }, c) => `${c.me} needs ${T} candles to light the long February evening and has ${a}. How many more candles are needed?` },
    { kind: 'groups', f: ({ a, b }) => `${a} snowdrops pushed up through the snow, and each one had ${b} tiny green leaves. How many leaves?` },
    { kind: 'share', f: ({ N, g }) => `Saint Brigid shared ${N} loaves of bread equally among ${g} hungry travellers. How many loaves did each traveller get?` },
    { kind: 'groupsPlus', f: ({ a, b, c: x }) => `${a} boxes hold ${b} candles each, and ${x} more candles stand on the windowsill. How many candles?` },
    { kind: 'addSub', f: ({ a, b, c: x }) => `${a} geese flew north, then ${b} more joined them, but ${x} turned back because of a snowstorm. How many geese kept flying north?` },
  ],
  3: [
    { kind: 'add', f: ({ a, b }) => `Persephone came back from the underworld, and flowers bloomed wherever she stepped: ${a} crocuses and ${b} daffodils. How many flowers bloomed?` },
    { kind: 'sub', f: ({ a, b }, c) => `${c.me} planted ${a} pea seeds. The blackbirds gobbled up ${b}! How many seeds are left in the ground?` },
    { kind: 'more', f: ({ a, b }) => `The mad March hares boxed ${a} rounds in the meadow, and the rabbits hopped ${b} rounds. How many more rounds did the hares box?` },
    { kind: 'need', f: ({ T, a }) => `The robin needs ${T} twigs to build her nest. She has gathered ${a}. How many more twigs does she need?` },
    { kind: 'groups', f: ({ a, b }) => `There are ${a} rows in the garden with ${b} seeds planted in each row. How many seeds?` },
    { kind: 'share', f: ({ N, g }) => `Saint Patrick shared ${N} shamrocks equally among ${g} friends. How many shamrocks did each friend get?` },
    { kind: 'groupsPlus', f: ({ a, b, c: x }) => `The garden gnome planted ${a} rows of ${b} carrots, then ${x} radishes by the fence. How many plants did he plant?` },
    { kind: 'addSub', f: ({ a, b, c: x }) => `The March wind lifted ${a} kites into the sky, then ${b} more. ${x} got tangled in the old oak. How many kites are still flying?` },
  ],
  4: [
    { kind: 'add', f: ({ a, b }) => `The Easter hare hid ${a} painted eggs under the hedge and ${b} in the tall grass. How many eggs did the hare hide?` },
    { kind: 'sub', f: ({ a, b }, c) => `${c.me} found ${a} eggs in the egg hunt. A sneaky magpie flew off with ${b}! How many eggs are left in the basket?` },
    { kind: 'more', f: ({ a, b }) => `April showers left ${a} puddles in the lane and ${b} puddles in the garden. How many more puddles are in the lane?` },
    { kind: 'need', f: ({ T, a }) => `The Easter hare needs ${T} eggs for the hunt. He has painted ${a}. How many more eggs must he paint?` },
    { kind: 'groups', f: ({ a, b }) => `${a} hens each laid ${b} eggs this week. How many eggs?` },
    { kind: 'share', f: ({ N, g }, c) => `${c.me} shared ${N} chocolate eggs equally among ${g} cousins. How many eggs did each cousin get?` },
    { kind: 'groupsPlus', f: ({ a, b, c: x }) => `The Green Man woke the forest: ${a} trees each grew ${b} new buds, and ${x} more buds popped out on the bushes. How many buds?` },
    { kind: 'addSub', f: ({ a, b, c: x }) => `${a} ducklings swam behind their mother, then ${b} more paddled out of the reeds. ${x} hopped up onto the bank. How many are still swimming?` },
  ],
  5: [
    { kind: 'add', f: ({ a, b }) => `${a} children danced around the Maypole, then ${b} more joined the ring. How many children are dancing?` },
    { kind: 'sub', f: ({ a, b }) => `The May Queen's crown had ${a} flowers. On the way home, ${b} fell off. How many flowers are left on her crown?` },
    { kind: 'more', f: ({ a, b }) => `The Maypole has ${a} red ribbons and ${b} white ribbons. How many more red ribbons than white?` },
    { kind: 'need', f: ({ T, a }) => `The fairies need ${T} dewdrops to wash their wings on May morning. They have collected ${a}. How many more dewdrops do they need?` },
    { kind: 'groups', f: ({ a, b }) => `There are ${a} flower garlands, each made of ${b} daisies. How many daisies?` },
    { kind: 'share', f: ({ N, g }) => `${N} honey cakes were shared equally among ${g} fairies at the May Day feast. How many cakes did each fairy get?` },
    { kind: 'groupsPlus', f: ({ a, b, c: x }) => `The bees visited ${a} apple trees with ${b} blossoms on each, then ${x} more blossoms on the hawthorn. How many blossoms did they visit?` },
    { kind: 'addSub', f: ({ a, b, c: x }) => `The Beltane bonfire had ${a} logs, and ${b} more were added at dusk. By midnight, ${x} had burned away. How many logs are left?` },
  ],
  6: [
    { kind: 'add', f: ({ a, b }) => `On Midsummer Eve, ${a} fireflies glowed in the meadow and ${b} more by the stream. How many fireflies were glowing?` },
    { kind: 'sub', f: ({ a, b }) => `Puck led ${a} travellers astray in the midsummer woods. ${b} found their way out. How many are still lost?` },
    { kind: 'more', f: ({ a, b }) => `The St John's bonfire shot up ${a} sparks, and the little campfire shot up ${b}. How many more sparks came from the bonfire?` },
    { kind: 'need', f: ({ T, a }) => `Titania needs ${T} rose petals for her Midsummer bed. Her fairies have gathered ${a}. How many more petals do they need?` },
    { kind: 'groups', f: ({ a, b }) => `${a} strawberry plants each had ${b} ripe strawberries. How many strawberries?` },
    { kind: 'share', f: ({ N, g }, c) => `${c.me} shared ${N} strawberries equally among ${g} friends on Midsummer Day. How many did each friend get?` },
    { kind: 'groupsPlus', f: ({ a, b, c: x }) => `There are ${a} jars with ${b} fireflies in each, and ${x} more fireflies blinking in the grass. How many fireflies?` },
    { kind: 'addSub', f: ({ a, b, c: x }) => `${a} swallows swooped over the hayfield, then ${b} more. ${x} flew back to their nests in the barn. How many are still swooping?` },
  ],
  7: [
    { kind: 'add', f: ({ a, b }, c) => `${c.me} found ${a} seashells in the morning and ${b} more at sunset. How many seashells?` },
    { kind: 'sub', f: ({ a, b }) => `${a} selkies came ashore and hid their seal-skins in the rocks. A fisherman found ${b} of the skins. How many skins are still hidden?` },
    { kind: 'more', f: ({ a, b }) => `Poseidon stirred up ${a} giant waves, and his son Triton blew up ${b} with his conch shell. How many more waves did Poseidon make?` },
    { kind: 'need', f: ({ T, a }, c) => `${c.me} needs ${T} buckets of sand for a giant sandcastle and has carried ${a}. How many more buckets?` },
    { kind: 'groups', f: ({ a, b }) => `${a} sandcastles each have ${b} towers. How many towers?` },
    { kind: 'share', f: ({ N, g }) => `A mermaid shared ${N} pearls equally among ${g} sea turtles. How many pearls did each turtle get?` },
    { kind: 'groupsPlus', f: ({ a, b, c: x }) => `There are ${a} tide pools with ${b} starfish in each, and ${x} more starfish on the rocks. How many starfish?` },
    { kind: 'addSub', f: ({ a, b, c: x }) => `${a} gulls stood on the pier and ${b} more landed. ${x} flew off after a fishing boat. How many gulls are still on the pier?` },
  ],
  8: [
    { kind: 'add', f: ({ a, b }, c) => `On a shooting-star night, ${c.me} counted ${a} shooting stars before bedtime and ${b} after. How many shooting stars?` },
    { kind: 'sub', f: ({ a, b }, c) => `${c.me} picked ${a} blackberries. The birds pecked ${b}! How many are left for the pie?` },
    { kind: 'more', f: ({ a, b }) => `The farmer cut ${a} rows of wheat and the neighbors cut ${b}. How many more rows did the farmer cut?` },
    { kind: 'need', f: ({ T, a }) => `The baker needs ${T} sheaves of wheat to bake the Lammas loaf for the harvest feast. She has ${a}. How many more sheaves does she need?` },
    { kind: 'groups', f: ({ a, b }) => `${a} bushes each had ${b} ripe blackberries. How many blackberries?` },
    { kind: 'share', f: ({ N, g }) => `${N} ears of corn were shared equally among ${g} families at the harvest feast. How many did each family get?` },
    { kind: 'groupsPlus', f: ({ a, b, c: x }) => `The farmer tied ${a} bundles of wheat with ${b} stalks each, plus ${x} loose stalks. How many stalks?` },
    { kind: 'addSub', f: ({ a, b, c: x }) => `${a} sunflowers stood tall, then ${b} more opened. The goldfinches ate the seeds from ${x}. How many sunflowers still have their seeds?` },
  ],
  9: [
    { kind: 'add', f: ({ a, b }) => `For Michaelmas, the class baked ${a} loaves of dragon bread in the morning and ${b} in the afternoon. How many loaves of dragon bread?` },
    { kind: 'sub', f: ({ a, b }) => `The dragon had ${a} flames in its belly. Saint Michael's sword of light put out ${b}! How many flames are left?` },
    { kind: 'more', f: ({ a, b }) => `${a} apples fell from the old tree and ${b} from the young tree. How many more fell from the old tree?` },
    { kind: 'need', f: ({ T, a }, c) => `${c.me} needs ${T} sticks to build a dragon for the Michaelmas play and has ${a}. How many more sticks are needed?` },
    { kind: 'groups', f: ({ a, b }) => `The dragon had ${a} spikes on its back, with ${b} sparks flying off each spike. How many sparks?` },
    { kind: 'share', f: ({ N, g }) => `${N} harvest apples were shared equally among ${g} brave knights before the dragon play. How many apples did each knight get?` },
    { kind: 'groupsPlus', f: ({ a, b, c: x }) => `Saint Michael's shield had ${a} rows of ${b} shining stars, and ${x} more stars around the edge. How many stars?` },
    { kind: 'addSub', f: ({ a, b, c: x }) => `${a} children set off on the courage march, then ${b} more joined. ${x} stayed behind to guard the dragon bread. How many marched to face the dragon?` },
  ],
  10: [
    { kind: 'add', f: ({ a, b }) => `At midnight, ${a} skeletons climbed out of the old graveyard. Then ${b} more rattled out from under the crooked gate. How many skeletons are dancing in the moonlight?` },
    { kind: 'add', f: ({ a, b }) => `The Headless Horseman galloped past ${a} dark houses in Sleepy Hollow, then ${b} more. How many houses did he thunder past?` },
    { kind: 'add', f: ({ a, b }) => `${a} ghosts drifted out of the haunted mill, and ${b} more floated up from the bottom of the old well. How many ghosts are haunting tonight?` },
    { kind: 'sub', f: ({ a, b }) => `A witch kept ${a} spiders in a jar. In the night, ${b} crept out through a crack in the lid! How many spiders are still in the jar?` },
    { kind: 'sub', f: ({ a, b }) => `${a} candles flickered in the haunted house. An icy wind moaned through the halls, and ${b} went out. How many are still burning in the dark?` },
    { kind: 'sub', f: ({ a, b }) => `Stingy Jack wandered the dark with a turnip lantern holding ${a} glowing coals. ${b} of them went cold. How many coals still glow?` },
    { kind: 'more', f: ({ a, b }) => `There are ${a} bats in the bell tower and ${b} owls in the dead oak tree. How many more bats than owls?` },
    { kind: 'more', f: ({ a, b }) => `The werewolf howled ${a} times at the full moon. Its pup howled ${b} times. How many more howls did the werewolf make?` },
    { kind: 'need', f: ({ T, a }) => `The witch needs ${T} toadstools for her midnight brew. She has picked ${a}. How many more toadstools before the clock strikes twelve?` },
    { kind: 'need', f: ({ T, a }) => `The mummy needs ${T} feet of bandages to wrap itself up again. It has found ${a} feet. How many more feet of bandages does it need?` },
    { kind: 'groups', f: ({ a, b }) => `There are ${a} coffins in the vampire's cellar, with ${b} bats hanging upside down over each one. How many bats?` },
    { kind: 'groups', f: ({ a, b }) => `${a} witches flew across the moon, each with ${b} black cats riding on her broom. How many cats?` },
    { kind: 'groups', f: ({ a, b }) => `A spider spun ${a} webs in the haunted attic, with ${b} moths stuck in each web. How many moths?` },
    { kind: 'share', f: ({ N, g }) => `A ghost stole ${N} silver spoons from the kitchen and hid them equally in ${g} dusty cupboards. How many spoons are in each cupboard?` },
    { kind: 'share', f: ({ N, g }) => `${N} trick-or-treat candies were shared equally among ${g} little monsters. How many candies did each monster get?` },
    { kind: 'groupsPlus', f: ({ a, b, c: x }) => `The graveyard has ${a} rows of tombstones with ${b} in each row, plus ${x} crooked ones by the gate. How many tombstones?` },
    { kind: 'groupsPlus', f: ({ a, b, c: x }) => `The witch dropped ${b} frog legs into each of her ${a} cauldrons, then tossed in ${x} more for luck. How many frog legs went in?` },
    { kind: 'addSub', f: ({ a, b, c: x }) => `${a} will-o'-the-wisps glowed over the swamp, then ${b} more flickered awake. ${x} drifted away into the fog. How many are still glowing?` },
    { kind: 'addSub', f: ({ a, b, c: x }, c) => `The banshee wailed ${a} times on Monday night and ${b} times on Tuesday. ${c.me} hid under the covers for ${x} of the wails. How many wails did ${c.me} hear?` },
  ],
  11: [
    { kind: 'add', f: ({ a, b }) => `On the lantern walk, ${a} lanterns glowed at the front and ${b} at the back. How many lanterns lit the dark path?` },
    { kind: 'add', f: ({ a, b }) => `On a dark November night, ${a} owls hooted in the churchyard and ${b} more answered from the woods. How many owls hooted?` },
    { kind: 'sub', f: ({ a, b }, c) => `${c.me} made ${a} paper lanterns. The cold November wind blew out ${b}. How many lanterns are still glowing?` },
    { kind: 'more', f: ({ a, b }) => `When Saint Martin tried to hide, ${a} geese honked and gave him away, and ${b} ducks quacked. How many more geese than ducks?` },
    { kind: 'need', f: ({ T, a }) => `The gnomes need ${T} crystals to light their caves under the hill for winter. They have ${a}. How many more crystals do they need?` },
    { kind: 'groups', f: ({ a, b }) => `${a} strings of lanterns hang in the garden with ${b} lanterns on each. How many lanterns?` },
    { kind: 'share', f: ({ N, g }, c) => `Saint Martin cut his cloak in two to share with a beggar. ${c.me} shares ${N} warm rolls equally among ${g} hungry travellers. How many rolls does each traveller get?` },
    { kind: 'groupsPlus', f: ({ a, b, c: x }) => `The gnomes stored ${a} baskets of ${b} acorns each deep under the hill, plus ${x} acorns in their pockets. How many acorns?` },
    { kind: 'addSub', f: ({ a, b, c: x }) => `${a} children sang on the lantern walk, then ${b} more joined in. ${x} got sleepy and went home. How many are still singing?` },
  ],
  12: [
    { kind: 'add', f: ({ a, b }, c) => `On Saint Nicholas Eve, ${c.me} found ${a} walnuts in one shoe and ${b} in the other. How many walnuts?` },
    { kind: 'sub', f: ({ a, b }, c) => `${c.me} baked ${a} gingerbread gnomes. Overnight, ${b} mysteriously disappeared! How many are left?` },
    { kind: 'more', f: ({ a, b }) => `Saint Lucia's crown has ${a} candles, and her helper's crown has ${b}. How many more candles are on Lucia's crown?` },
    { kind: 'need', f: ({ T, a }) => `The Advent spiral needs ${T} green branches. The children have laid ${a}. How many more branches are needed?` },
    { kind: 'groups', f: ({ a, b }) => `${a} windows each have ${b} paper stars. How many stars?` },
    { kind: 'share', f: ({ N, g }) => `Saint Nicholas shared ${N} oranges equally among ${g} children's shoes. How many oranges went in each shoe?` },
    { kind: 'groupsPlus', f: ({ a, b, c: x }) => `There are ${a} trays with ${b} cookies on each, plus ${x} cookies left out for the reindeer. How many cookies?` },
    { kind: 'addSub', f: ({ a, b, c: x }) => `On the longest night of the year, ${a} stars came out, then ${b} more. Clouds covered ${x}. How many stars shine on the winter solstice?` },
  ],
};

const seasonCache = {};
function seasonWorld(m) {
  if (seasonCache[m]) return seasonCache[m];
  const v = SEASONS[m], t = v.things;
  return seasonCache[m] = {
    name: () => v.name,
    season: true,
    extra: SEASON_STORIES[m] || [],
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
// Story templates already used this round
const storyMemory = new Set();
function storyCast() {
  const list = s => String(s || '').split(',').map(x => x.trim()).filter(Boolean);
  const friends = list(state.cast.friends), villains = list(state.cast.villains);
  storyCast.text = [state.cast.friends, state.cast.villains, state.cast.others].join(',').toLowerCase();
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
  const n = storyNums(kind, L), cast = storyCast();
  // Character and seasonal stories mix with each world's main story. No story repeats within a round:
  // if the pick was already used, try another world.
  const unused = fs => fs.filter(f => !storyMemory.has(f));
  let world, f;
  for (let tries = 0; tries < 12; tries++) {
    world = pickWorld();
    const extras = (world.extra || []).filter(x => x.kind === kind && (!x.needs || storyCast.text.includes(x.needs))).map(x => x.f);
    const pool = unused(extras);
    f = extras.length && rng() < (world.season ? 0.9 : 0.6) ? pick(pool.length ? pool : extras) : world.t[kind];
    if (storyMemory.has(f) && pool.length) f = pick(pool);
    // the plain seasonal story (the month's one object, like jack-o'-lanterns) shows up at most once a round
    const plainSeason = world.season && f === world.t[kind];
    if (plainSeason && storyMemory.has(world)) { if (pool.length) f = pick(pool); else continue; }
    if (!storyMemory.has(f)) break;
  }
  storyMemory.add(f);
  if (world.season && f === world.t[kind]) storyMemory.add(world);
  const story = f(n, cast);
  const { ans, d, explain } = storyAnswer(kind, n);
  return {
    skill: 'words', story, speak: story, ans, world: world.name(), explain,
    distract: [...d, [ans + 1, 'counting slip'], [ans - 1, 'counting slip'], [ans + 10, 'off by ten']],
  };
}
