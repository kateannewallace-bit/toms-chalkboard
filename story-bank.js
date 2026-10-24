/* ---------- story bank: more scenarios for every world, plus a Spooky world ----------
   Loaded after stories.js. Each entry is one scenario; the numbers change every time.
   Exciting, scary and battle stories are welcome — monsters, sieges, narrow escapes — but no gore.
   Cast in templates: c.H hero ("Tom the Hunter"), c.me the child's name, c.F a friend, c.V a villain
   (any), c.V1 a single villain (for "has" sentences), c.K "Tom the knight", c.D a legendary dragon.
   Numbers: add/sub/more {a, b} · need {T, a} · groups {a, b} · share {N, g} · groupsPlus/addSub {a, b, c}. */

const STORY_BANK = {
  hunter: {
    add: [
      ({ a, b }, c) => `${c.H} and ${c.F} fought off ${a} rats sent by ${c.V} at the Bone Bridge. Then ${b} more rats swarmed out of the sewer! How many rats did they fight?`,
      ({ a, b }, c) => `${cap(c.V)} set ${a} traps in the Whispering Woods and ${b} more by the river. How many traps must ${c.H} find?`,
      ({ a, b }, c) => `${c.H} shot ${a} flaming arrows at the haunted windmill, then ${b} more. How many flaming arrows did ${c.me} shoot?`,
      ({ a, b }, c) => `In the first battle, ${c.F} knocked out ${a} skeleton guards. In the second battle, ${c.F} knocked out ${b} more. How many skeleton guards were knocked out?`,
    ],
    sub: [
      ({ a, b }, c) => `${cap(c.V)} kidnapped ${a} villagers and locked them in a cage. ${c.H} picked the lock and freed ${b} of them. How many villagers are still trapped?`,
      ({ a, b }, c) => `${c.H} had ${a} arrows at the start of the battle and fired ${b} at the charging wolves. How many arrows are left in the quiver?`,
      ({ a, b }, c) => `A swarm of ${a} vampire bats attacked the camp. ${cap(c.F)} scared away ${b} with a torch. How many bats are still attacking?`,
      ({ a, b }, c) => `The castle of ${c.V} had ${a} guards. ${c.H} snuck past ${b} of them. How many guards are still in the way?`,
    ],
    more: [
      ({ a, b }, c) => `${cap(c.V1)} has ${a} henchmen. ${c.H} has ${b} brave friends. How many more henchmen than friends?`,
      ({ a, b }, c) => `${cap(c.F)} won ${a} sword fights this year. ${c.H} won ${b}. How many more sword fights did ${c.F} win?`,
      ({ a, b }, c) => `The swamp monster has ${a} teeth. ${cap(c.V1)} has ${b} teeth. How many more teeth does the swamp monster have?`,
      ({ a, b }, c) => `${c.H} climbed ${a} steps up the Tower of Doom. ${cap(c.F)} climbed ${b}. How many more steps did ${c.me} climb?`,
    ],
    need: [
      ({ T, a }, c) => `The Tower of Doom has ${T} steps, and ${c.V1} is waiting at the top! ${c.H} has climbed ${a}. How many more steps are left?`,
      ({ T, a }, c) => `${c.H} needs ${T} silver arrows to stop the werewolf before midnight. ${cap(c.F)} has made ${a}. How many more silver arrows are needed?`,
      ({ T, a }, c) => `To break the curse, ${c.H} must find ${T} dragon teeth. ${c.me} has found ${a}. How many more teeth must ${c.me} find?`,
      ({ T, a }, c) => `${c.H} must row ${T} miles across the Black Lake to reach the hideout of ${c.V}. ${c.me} has rowed ${a} miles. How many more miles to go?`,
    ],
    groups: [
      ({ a, b }, c) => `${a} giant spiders crawled out of the cave, and each one spat ${b} globs of sticky web at ${c.H}. How many globs of web?`,
      ({ a, b }, c) => `${cap(c.V)} sent ${a} boats full of pirates, with ${b} pirates in each boat. How many pirates are coming?`,
      ({ a, b }, c) => `${c.H} found ${a} treasure chests, each stuffed with ${b} gold crowns. How many gold crowns?`,
      ({ a, b }) => `${a} ogres stomped toward the village, and each ogre carried ${b} boulders to throw. How many boulders?`,
    ],
    share: [
      ({ N, g }, c) => `After the battle, ${c.H} split ${N} gold coins equally among ${g} brave fighters. How many coins did each fighter get?`,
      ({ N, g }, c) => `${c.H} has ${N} arrows and ${g} quivers, and puts the same number of arrows in each quiver. How many arrows go in each one?`,
      ({ N, g }) => `${N} zombies shambled out of the graveyard in ${g} equal groups. How many zombies were in each group?`,
      ({ N, g }, c) => `${cap(c.V)} hid ${N} stolen jewels equally in ${g} secret caves. How many jewels are in each cave?`,
    ],
    groupsPlus: [
      ({ a, b, c: x }, c) => `${a} catapults each threw ${b} stones at the castle of ${c.V}. Then ${c.F} threw ${x} more stones by hand. How many stones hit the castle?`,
      ({ a, b, c: x }, c) => `${c.H} defeated ${a} packs of wolves with ${b} wolves in each pack, plus ${x} lone wolves. How many wolves did ${c.me} defeat?`,
      ({ a, b, c: x }, c) => `There are ${a} dungeon cells with ${b} prisoners in each, and ${x} more prisoners chained in the hall. How many prisoners must ${c.H} free?`,
    ],
    addSub: [
      ({ a, b, c: x }, c) => `${cap(c.V1)} had ${a} minions, then hired ${b} more. ${c.H} chased ${x} of them away. How many minions are left?`,
      ({ a, b, c: x }, c) => `${c.H} had ${a} healing potions and found ${b} more. During the fight with the troll, ${c.me} drank ${x}. How many potions are left?`,
      ({ a, b, c: x }, c) => `${a} goblins attacked from the north and ${b} from the south. ${cap(c.F)} trapped ${x} in a net. How many goblins are still loose?`,
    ],
  },

  tailypo: {
    add: [
      ({ a, b }) => `On the first night, the Tailypo scratched at the cabin ${a} times. On the second night it scratched ${b} times. How many scratches in all?`,
      ({ a, b }) => `The old man's hounds chased the Tailypo ${a} miles up the mountain and ${b} miles back down. How far did they run?`,
      ({ a, b }) => `"Tailypo, tailypo, all I want's my tailypo!" The creature whispered it ${a} times at the window and ${b} times down the chimney. How many times did it whisper?`,
      ({ a, b }) => `${a} pairs of glowing eyes watched the cabin from the woods. Then ${b} more pairs appeared. How many pairs of eyes were watching?`,
    ],
    sub: [
      ({ a, b }) => `The old man had ${a} logs for the fire. The Tailypo dragged ${b} of them out into the dark. How many logs are left?`,
      ({ a, b }) => `There were ${a} candles lit in the cabin. A cold wind howled down the chimney and blew out ${b}. How many candles are still lit?`,
      ({ a, b }) => `The hounds had ${a} bones buried under the porch. The Tailypo dug up ${b}. How many bones are still buried?`,
      ({ a, b }) => `The Tailypo had ${a} long, sharp claws. It broke ${b} of them scratching at the old man's door. How many claws are left?`,
    ],
    more: [
      ({ a, b }) => `The Tailypo's tail was ${a} inches long. The old man's hound had a tail ${b} inches long. How much longer was the Tailypo's tail?`,
      ({ a, b }) => `When the Tailypo came, Uno barked ${a} times and Ino barked ${b} times. How many more times did Uno bark?`,
      ({ a, b }) => `The Tailypo climbed ${a} feet up the old oak. The hound jumped ${b} feet after it. How much higher did the Tailypo go?`,
    ],
    need: [
      ({ T, a }) => `The old man needs ${T} nails to board up every window before dark. He has hammered in ${a}. How many more nails does he need?`,
      ({ T, a }) => `The hounds must run ${T} miles to chase the Tailypo off the mountain. They have run ${a}. How many more miles?`,
      ({ T, a }) => `It will be ${T} hours until sunrise, and the Tailypo is still outside. ${a} hours have passed. How many more hours until morning?`,
    ],
    groups: [
      ({ a, b }) => `${a} Tailypos crept out of the holler, and each one had ${b} sharp claws on its front paw. How many claws?`,
      ({ a, b }) => `The old man boarded up ${a} windows with ${b} boards on each. How many boards did he use?`,
      ({ a, b }) => `${a} hounds each chased the Tailypo ${b} times around the cabin. How many chases?`,
      ({ a, b }) => `The Tailypo left ${a} rows of muddy footprints on the porch, with ${b} prints in each row. How many footprints?`,
      ({ a, b }) => `When the Tailypo crept past, ${a} owls hooted from the trees, and each owl hooted ${b} times. How many hoots?`,
    ],
    share: [
      ({ N, g }) => `Before the long night, the old man split ${N} pieces of cornbread equally among his ${g} hounds. How many pieces did each hound get?`,
      ({ N, g }) => `The Tailypo hid ${N} stolen socks in ${g} hollow logs, the same number in each. How many socks are in each log?`,
      ({ N, g }) => `The old man nailed ${N} boards over his ${g} windows, the same number on each window. How many boards are on each window?`,
    ],
    groupsPlus: [
      ({ a, b, c: x }) => `The Tailypo scratched ${b} times at each of the ${a} windows, then ${x} more times at the door. How many scratches?`,
      ({ a, b, c: x }) => `The old man lit the cabin with ${a} jars of ${b} fireflies each, plus ${x} fireflies that got loose. How many fireflies?`,
    ],
    addSub: [
      ({ a, b, c: x }) => `The old man had ${a} biscuits, then baked ${b} more. The Tailypo crept in and stole ${x}. How many biscuits are left?`,
      ({ a, b, c: x }) => `${a} hounds were sleeping by the fire, and ${b} more came in from the cold. When the Tailypo howled, ${x} ran under the bed. How many hounds are still by the fire?`,
      ({ a, b, c: x }) => `The Tailypo's tail grew back ${a} inches, then ${b} more inches. Then a hound bit off ${x} inches! How long is the tail now?`,
    ],
  },

  spooky: {
    add: [
      ({ a, b }) => `${a} zombies lurched out of the swamp, and ${b} more crawled up out of their graves. How many zombies are coming?`,
      ({ a, b }) => `The haunted house groaned ${a} times before midnight and ${b} times after. How many groans?`,
      ({ a, b }) => `A werewolf left ${a} claw marks on the barn door and ${b} on the gate. How many claw marks?`,
      ({ a, b }) => `A vampire sank its fangs into ${a} pumpkins on Monday night and ${b} on Tuesday night. How many pumpkins did it bite?`,
    ],
    sub: [
      ({ a, b }) => `A ghost ship had ${a} skeleton sailors. A huge wave washed ${b} of them overboard! How many skeleton sailors are left?`,
      ({ a, b }) => `The mad scientist had ${a} jars of glowing goo. ${b} jars exploded! How many jars are left?`,
      ({ a, b }) => `${a} ghosts haunted the old school. A ghost hunter trapped ${b} in a jar. How many ghosts are still haunting?`,
      ({ a, b }) => `The mummy had ${a} feet of bandages. ${b} feet unravelled as it chased the explorers. How many feet of bandages does it have left?`,
    ],
    more: [
      ({ a, b }) => `A troll has ${a} warts on its nose. A goblin has ${b}. How many more warts does the troll have?`,
      ({ a, b }) => `The kraken has ${a} suckers on one arm. The giant squid has ${b}. How many more suckers does the kraken have?`,
      ({ a, b }) => `${a} rats live in the dungeon and ${b} live in the tower. How many more rats live in the dungeon?`,
      ({ a, b }) => `The witch's cauldron holds ${a} eyeballs. The wizard's holds ${b}. How many more eyeballs are in the witch's cauldron?`,
    ],
    need: [
      ({ T, a }) => `A hungry zombie wants to munch ${T} turnips. It has eaten ${a}. How many more turnips will it munch?`,
      ({ T, a }) => `The vampire has to fly ${T} miles to reach its coffin before sunrise. It has flown ${a}. How many more miles?`,
      ({ T, a }) => `The ghost hunters need ${T} jars to trap every ghost in the castle. They have ${a}. How many more jars do they need?`,
      ({ T, a }) => `Frankenstein's monster needs ${T} bolts of lightning to wake up. The storm has sent ${a}. How many more bolts?`,
    ],
    groups: [
      ({ a, b }) => `${a} haunted houses stand on Shadow Street, and each one has ${b} ghosts. How many ghosts?`,
      ({ a, b }) => `${a} witches each brewed ${b} pots of poison. How many pots of poison?`,
      ({ a, b }) => `${a} vampires each have ${b} pet bats. How many bats?`,
      ({ a, b }) => `The kraken grabbed ${a} ships, and each ship had ${b} sailors aboard. How many sailors did the kraken catch?`,
    ],
    share: [
      ({ N, g }) => `${N} eyeballs were shared equally among ${g} hungry ogres. How many eyeballs did each ogre get?`,
      ({ N, g }) => `${N} werewolves split into ${g} equal packs. How many werewolves are in each pack?`,
      ({ N, g }) => `${N} ghosts must squeeze equally into ${g} haunted rooms. How many ghosts haunt each room?`,
    ],
    groupsPlus: [
      ({ a, b, c: x }) => `${a} coffins each hold ${b} vampires, and ${x} more vampires hang from the ceiling. How many vampires?`,
      ({ a, b, c: x }) => `The graveyard has ${a} rows of ${b} zombies, plus ${x} zombies by the gate. How many zombies?`,
    ],
    addSub: [
      ({ a, b, c: x }) => `${a} skeletons rattled into the castle, then ${b} more. ${x} fell apart on the stairs! How many skeletons made it to the top?`,
      ({ a, b, c: x }) => `The witch had ${a} warts, grew ${b} more, then zapped ${x} away with a spell. How many warts does she have now?`,
    ],
  },

  knights: {
    add: [
      ({ a, b }) => `In the great battle, the knights defeated ${a} goblins in the morning and ${b} in the afternoon. How many goblins were defeated?`,
      ({ a, b }, c) => `${cap(c.D)} burned ${a} haystacks on Monday and ${b} on Tuesday. How many haystacks did the dragon burn?`,
      ({ a, b }, c) => `${c.K} jousted ${a} times at the spring tournament and ${b} times at the summer tournament. How many jousts?`,
    ],
    sub: [
      ({ a, b }, c) => `${a} knights charged at ${c.D}. The dragon's tail swept ${b} of them off their horses! How many knights are still charging?`,
      ({ a, b }) => `The castle had ${a} arrows for the siege. The archers fired ${b}. How many arrows are left?`,
      ({ a, b }, c) => `${cap(c.D)} had ${a} scales of armor on its chest. ${c.K} knocked off ${b} with a lance. How many scales are left?`,
    ],
    more: [
      ({ a, b }, c) => `${cap(c.D)} is ${a} feet long. A sea serpent is ${b} feet long. How much longer is the dragon?`,
      ({ a, b }) => `The Black Knight's army has ${a} soldiers and the king's army has ${b}. How many more soldiers does the Black Knight have?`,
      ({ a, b }, c) => `${c.K} has won ${a} battles. The old knight has won ${b}. How many more battles has ${c.me} won?`,
    ],
    need: [
      ({ T, a }, c) => `${c.K} needs ${T} pieces of armor before facing ${c.D}. The blacksmith has made ${a}. How many more pieces are needed?`,
      ({ T, a }) => `The army must march ${T} miles to reach the dragon's lair. They have marched ${a}. How many more miles?`,
      ({ T, a }, c) => `${c.K} must climb ${T} steps to the top of the dragon's tower. ${c.me} has climbed ${a}. How many more steps?`,
    ],
    groups: [
      ({ a, b }) => `${a} dragons attacked the city, and each dragon breathed ${b} fireballs. How many fireballs?`,
      ({ a, b }) => `The castle has ${a} towers with ${b} archers in each. How many archers?`,
      ({ a, b }, c) => `${a} catapults each hurled ${b} boulders at ${c.D}. How many boulders?`,
      ({ a, b }) => `${a} knights each defeated ${b} giant rats in the castle cellar. How many rats?`,
      ({ a, b }) => `${a} trolls attacked the bridge, and each troll swung its club ${b} times. How many swings?`,
    ],
    share: [
      ({ N, g }) => `The knights captured ${N} enemy swords and shared them equally among ${g} squires. How many swords did each squire get?`,
      ({ N, g }) => `${N} soldiers lined up in ${g} equal rows for battle. How many soldiers are in each row?`,
      ({ N, g }, c) => `The hoard of ${c.D} held ${N} rubies, split equally among ${g} brave knights. How many rubies did each knight get?`,
    ],
    groupsPlus: [
      ({ a, b, c: x }) => `${a} knights each carried ${b} spears into battle, and the king carried ${x} more. How many spears?`,
      ({ a, b, c: x }) => `The dragon's lair had ${a} piles of ${b} bones, plus ${x} bones scattered by the entrance. How many bones?`,
    ],
    addSub: [
      ({ a, b, c: x }, c) => `${c.K} had ${a} arrows, and the blacksmith made ${b} more. ${c.me} fired ${x} at ${c.D}. How many arrows are left?`,
      ({ a, b, c: x }) => `${a} goblins attacked the gate and ${b} climbed the wall. The knights captured ${x}. How many goblins are still fighting?`,
    ],
  },

  greek: {
    add: [
      ({ a, b }) => `The Hydra had ${a} heads, and when Hercules attacked, it grew ${b} more! How many heads does the Hydra have?`,
      ({ a, b }) => `Perseus flew ${a} miles on his winged sandals to find Medusa, then ${b} miles home. How far did he fly?`,
      ({ a, b }) => `Deep in the labyrinth, the Minotaur roared ${a} times before Theseus found it, then ${b} more times during the fight. How many roars?`,
    ],
    sub: [
      ({ a, b }) => `The Hydra had ${a} heads. Hercules chopped off ${b} and burned the stumps so they couldn't grow back. How many heads are left?`,
      ({ a, b }) => `${a} sailors rowed Odysseus's ship past Scylla. The six-headed monster snatched ${b} of them! How many sailors are left?`,
      ({ a, b }) => `The sirens lured ${a} ships toward the rocks, and ${b} ships crashed. How many ships sailed safely past?`,
    ],
    more: [
      ({ a, b }) => `Zeus hurled ${a} lightning bolts at the Titans. His brother Hades hurled ${b}. How many more did Zeus hurl?`,
      ({ a, b }) => `Athena's army has ${a} soldiers. Ares's army has ${b}. How many more soldiers does Athena have?`,
      ({ a, b }) => `Achilles fought ${a} battles at Troy, and Hector fought ${b}. How many more battles did Achilles fight?`,
    ],
    need: [
      ({ T, a }) => `Theseus must walk ${T} steps through the labyrinth to reach the Minotaur. He has walked ${a}. How many more steps?`,
      ({ T, a }) => `Jason needs ${T} heroes to row the Argo. He has found ${a}. How many more heroes does he need?`,
      ({ T, a }) => `Hercules must clean ${T} filthy stables in one day. He has cleaned ${a}. How many more stables?`,
    ],
    groups: [
      ({ a, b }) => `${a} Greek ships sailed to Troy with ${b} soldiers in each. How many soldiers?`,
      ({ a, b }) => `The wooden horse hid ${a} rows of soldiers, with ${b} soldiers in each row. How many soldiers were inside?`,
      ({ a, b }) => `${a} harpies swooped down on the feast, and each one grabbed ${b} grapes. How many grapes?`,
      ({ a, b }) => `The Argo had ${a} benches with ${b} heroes rowing on each. How many heroes rowed?`,
      ({ a, b }) => `Cerberus guarded ${a} gates of the underworld, and at each gate he snapped at ${b} ghosts. How many ghosts did he snap at?`,
    ],
    share: [
      ({ N, g }) => `After escaping the Cyclops, Odysseus split ${N} silver coins equally among ${g} sailors. How many coins did each sailor get?`,
      ({ N, g }) => `Hades sent ${N} ghosts equally into ${g} caves of the underworld. How many ghosts are in each cave?`,
      ({ N, g }) => `${N} Argonauts sat in ${g} equal rows on the Argo. How many Argonauts were in each row?`,
    ],
    groupsPlus: [
      ({ a, b, c: x }) => `The wooden horse hid ${a} rows of ${b} soldiers, plus ${x} more crammed into its head. How many soldiers?`,
      ({ a, b, c: x }) => `Medusa turned ${a} groups of ${b} soldiers to stone, plus ${x} more who peeked. How many stone statues?`,
    ],
    addSub: [
      ({ a, b, c: x }) => `Hercules faced ${a} monsters in his first year and ${b} in his second. ${x} of them ran away. How many did he defeat?`,
      ({ a, b, c: x }) => `${a} Trojans guarded the gate, and ${b} more came running. The Greeks captured ${x}. How many Trojans are still guarding the gate?`,
    ],
  },

  egypt: {
    add: [
      ({ a, b }) => `Set battled the serpent Apophis ${a} times on Monday night and ${b} times on Tuesday night. How many battles?`,
      ({ a, b }) => `Sobek, the crocodile god, snapped up ${a} fish in the morning and ${b} in the evening. How many fish?`,
      ({ a, b }) => `Anubis weighed ${a} hearts on his scale in the morning and ${b} in the afternoon. How many hearts did he weigh?`,
    ],
    sub: [
      ({ a, b }) => `A mummy's tomb had ${a} traps. The explorers set off ${b} of them! How many traps are left?`,
      ({ a, b }) => `The pharaoh had ${a} chariots. Set's sandstorm buried ${b} in the sand. How many chariots are left?`,
      ({ a, b }) => `${a} scarab beetles crawled out of the tomb. Bastet's cats pounced on ${b}. How many scarabs got away?`,
    ],
    more: [
      ({ a, b }) => `Set's storm lasted ${a} days. Ra's sunny spell lasted ${b} days. How many more days did the storm last?`,
      ({ a, b }) => `The great pyramid has ${a} secret rooms. The small pyramid has ${b}. How many more secret rooms does the great pyramid have?`,
      ({ a, b }) => `The serpent Apophis is ${a} feet long. A Nile crocodile is ${b} feet long. How much longer is Apophis?`,
    ],
    need: [
      ({ T, a }) => `The mummy needs ${T} magic amulets to protect it in the afterlife. It has ${a}. How many more amulets does it need?`,
      ({ T, a }) => `Set must cross ${T} sand dunes to reach the temple. He has crossed ${a}. How many more dunes?`,
      ({ T, a }) => `The builders must drag ${T} stone blocks to the pyramid today. They have dragged ${a}. How many more blocks?`,
    ],
    groups: [
      ({ a, b }) => `${a} chariots raced across the desert, each pulled by ${b} horses. How many horses?`,
      ({ a, b }) => `${a} tombs each held ${b} golden statues. How many statues?`,
      ({ a, b }) => `Set sent ${a} sandstorms, and each one buried ${b} tents. How many tents were buried?`,
      ({ a, b }) => `${a} cobras guarded the pharaoh's tomb, and each cobra hissed ${b} times. How many hisses?`,
      ({ a, b }) => `${a} jackals guarded the gates of the underworld, and each one howled ${b} times for Anubis. How many howls?`,
    ],
    share: [
      ({ N, g }) => `The pharaoh shared ${N} gold rings equally among ${g} brave soldiers. How many rings did each soldier get?`,
      ({ N, g }) => `${N} mummies were placed equally in ${g} tombs. How many mummies are in each tomb?`,
    ],
    groupsPlus: [
      ({ a, b, c: x }) => `${a} rows of ${b} soldiers guarded the temple, plus ${x} soldiers at the gate. How many soldiers?`,
      ({ a, b, c: x }) => `There are ${a} tombs with ${b} mummies in each, and ${x} mummies wandering the halls! How many mummies?`,
    ],
    addSub: [
      ({ a, b, c: x }) => `Set had ${a} storm clouds and made ${b} more. Ra burned away ${x}. How many storm clouds are left?`,
      ({ a, b, c: x }) => `${a} explorers entered the tomb, and ${b} more followed. ${x} ran out screaming when the mummy woke up. How many are still inside?`,
    ],
  },

  pixies: {
    add: [
      ({ a, b }) => `Deep in the tin mine, the knockers knocked ${a} times to warn of a flood, then ${b} more times. How many knocks?`,
      ({ a, b }) => `The spriggans, the pixies' fierce guards, chased ${a} robbers off the moor in the morning and ${b} at night. How many robbers?`,
    ],
    sub: [
      ({ a, b }) => `${a} travellers crossed Bodmin Moor at night. The pixies led ${b} of them astray into the bog! How many got home?`,
      ({ a, b }) => `Joan the Wad's lantern had ${a} sparks. A gust of moor wind blew away ${b}. How many sparks are left?`,
    ],
    more: [
      ({ a, b }) => `When spriggans get angry, they swell up to ${a} feet tall. When they are calm, they are ${b} feet tall. How much taller are they when angry?`,
      ({ a, b }) => `The Beast of Bodmin left ${a} pawprints in the mud on Monday and ${b} on Tuesday. How many more pawprints did it leave on Monday?`,
    ],
    need: [
      ({ T, a }) => `The knockers need ${T} candles to light the deepest tunnel. They have ${a}. How many more candles do they need?`,
      ({ T, a }) => `The pixies need ${T} acorn helmets before they face the Beast of Bodmin. They have ${a}. How many more helmets?`,
    ],
    groups: [
      ({ a, b }) => `${a} spriggans each guarded ${b} buried treasure chests. How many treasure chests?`,
      ({ a, b }) => `The pixies rode ${a} stolen ponies across the moor at midnight, with ${b} pixies on each pony. How many pixies?`,
      ({ a, b }) => `${a} knockers each dug ${b} tunnels in the tin mine. How many tunnels?`,
      ({ a, b }) => `Joan the Wad lit ${a} lanterns with ${b} glow-worms inside each. How many glow-worms?`,
      ({ a, b }) => `${a} piskies each stole ${b} buttons from the farmer's coat. How many buttons?`,
    ],
    share: [
      ({ N, g }) => `The knockers split ${N} tin nuggets equally among ${g} miners who had left them pasty crusts. How many nuggets did each miner get?`,
    ],
    groupsPlus: [
      ({ a, b, c: x }) => `${a} spriggans each threw ${b} pebbles at a robber, and Joan the Wad threw ${x} more. How many pebbles?`,
    ],
    addSub: [
      ({ a, b, c: x }) => `The Beast of Bodmin chased ${a} sheep, then ${b} more. ${x} escaped into a fairy ring. How many sheep is it still chasing?`,
    ],
  },

  shakespeare: {
    add: [
      ({ a, b }) => `Macbeth's witches tossed ${a} toads into the cauldron, then ${b} more. How many toads?`,
      ({ a, b }) => `The ghost of Hamlet's father walked the castle walls for ${a} nights, then ${b} more nights. How many nights did the ghost walk?`,
    ],
    sub: [
      ({ a, b }) => `Macbeth's army had ${a} soldiers. When Birnam Wood came marching toward the castle, ${b} ran away! How many soldiers stayed?`,
      ({ a, b }) => `${a} ships sailed past Prospero's island. His magic storm wrecked ${b} of them. How many ships sailed on?`,
    ],
    more: [
      ({ a, b }) => `Macbeth's witches cast ${a} spells, and the fairy queen cast ${b}. How many more spells did the witches cast?`,
    ],
    need: [
      ({ T, a }) => `The witches need ${T} eyes of newt for their potion. They have ${a}. How many more eyes of newt do they need?`,
    ],
    groups: [
      ({ a, b }) => `${a} witches each threw ${b} bat wings into the cauldron. How many bat wings?`,
      ({ a, b }) => `The ghost appeared on ${a} nights, and each night it moaned ${b} times. How many moans?`,
      ({ a, b }) => `${a} ghosts haunted the castle, and each ghost rattled ${b} chains. How many chains?`,
      ({ a, b }) => `The fairies of the enchanted wood danced in ${a} rings, with ${b} fairies in each ring. How many fairies?`,
      ({ a, b }) => `Puck led ${a} travellers astray, and each one wandered ${b} miles in the dark. How many miles did they wander in all?`,
    ],
    share: [
      ({ N, g }) => `Puck shared ${N} love-potion flowers equally among ${g} sleeping lovers. How many flowers did each lover get?`,
    ],
    groupsPlus: [
      ({ a, b, c: x }) => `${a} witches each stirred the cauldron ${b} times, and Hecate stirred it ${x} more times. How many stirs?`,
    ],
    addSub: [
      ({ a, b, c: x }) => `${a} ghosts crowded into Macbeth's banquet hall, then ${b} more drifted in. ${x} vanished at dawn. How many ghosts are left?`,
    ],
  },

  nature: {
    add: [
      ({ a, b }) => `A hawk caught ${a} mice in the meadow and ${b} by the barn. How many mice did the hawk catch?`,
      ({ a, b }) => `${a} wild geese landed on the pond, then ${b} more splashed down. How many geese?`,
    ],
    sub: [
      ({ a, b }) => `A fox crept into the henhouse when there were ${a} hens inside. ${b} hens flapped out the window to escape! How many hens are still in the henhouse?`,
      ({ a, b }) => `There were ${a} bees in the hive. ${b} flew off to find flowers. How many bees are still in the hive?`,
    ],
    more: [
      ({ a, b }) => `The old oak has ${a} squirrels in it and the young oak has ${b}. How many more squirrels are in the old oak?`,
    ],
    need: [
      ({ T, a }) => `The beaver needs ${T} sticks to finish its dam before the flood. It has ${a}. How many more sticks does it need?`,
    ],
    groups: [
      ({ a, b }) => `${a} spiders each caught ${b} flies in their webs. How many flies?`,
      ({ a, b }) => `${a} owls each caught ${b} mice in the night. How many mice?`,
      ({ a, b }) => `${a} beehives each have ${b} honeycombs. How many honeycombs?`,
    ],
    share: [
      ({ N, g }) => `${g} squirrels buried ${N} acorns, the same number each. How many acorns did each squirrel bury?`,
    ],
    groupsPlus: [
      ({ a, b, c: x }) => `${a} bird nests each have ${b} eggs, and the duck's nest has ${x} more. How many eggs?`,
    ],
    addSub: [
      ({ a, b, c: x }) => `${a} ants carried crumbs to the anthill, and ${b} more joined them. A hungry toad gobbled ${x}! How many ants are left?`,
    ],
  },
};

// Add the Spooky world (after the Tailypo) and merge the bank into every world.
(function mergeStoryBank() {
  const order = Object.keys(WORLDS), after = order.slice(order.indexOf('tailypo') + 1), saved = {};
  for (const k of after) { saved[k] = WORLDS[k]; delete WORLDS[k]; }
  WORLDS.spooky = { name: () => 'Spooky things', t: {} };
  Object.assign(WORLDS, saved);
  const kinds = ['add', 'sub', 'more', 'need', 'groups', 'share', 'groupsPlus', 'addSub'];
  for (const [wid, w] of Object.entries(WORLDS)) {
    for (const kind of kinds) {
      w.t[kind] = [].concat(w.t[kind] || [], (STORY_BANK[wid] || {})[kind] || []);
      w.t[kind].forEach((f, i) => { f.storyId = `${wid}.${kind}.${i}`; });
    }
    (w.extra || []).forEach((x, i) => { x.f.storyId = `${wid}.x${i}`; });
  }
  for (const [m, list] of Object.entries(SEASON_STORIES)) list.forEach((x, i) => { x.f.storyId = `season${m}.${i}`; });
})();
