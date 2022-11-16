// Wrap everything in a function to avoid polluting the global namespace.
(function() {

	TypeJig.WordSets.LearnPlover = {};

	TypeJig.WordSets.LearnPloverOrder = [
		"One Syllable Words",
		"Consonant Clusters",
		"Where's the TRUFT?",
		"Dropping Unstressed Vowels",
		"Inversion",
		"The Fifth Vowel Key",
		"Long Vowel Chords",
		"Diphthong Chords",
		"Vowel Disambiguator Chords",
		"The Missing Keys",
		"The Remaining Missing Letters",
		"Review Through Missing Letters",
		"Digraphs",
		"Review Through Digraphs",
		"Common Compound Clusters",
		"Review Through Common Compound Clusters",
		"Common Briefs 1-20",
		"Common Briefs 21-40",
		"Common Briefs 41-60",
		"Common Briefs 61-80",
		"Common Briefs 81-100",
	];

	var Plover = TypeJig.WordSets.LearnPlover;

	Plover["One Syllable Words"] = [
		'sap', 'sag', 'sat', 'sass', 'sad',
		'sop', 'sob', 'sell', 'set', 'says',
		'tar', 'tap', 'tab', 'tag', 'tad', 'tour',
		'top', 'toll', 'tell', 'tough', 'tub', 'tug',
		'car', 'cap', 'cab', 'cat', 'cad', 'core',
		'cop', 'cog', 'cot', 'cod', 'keg', 'cuff',
		'cur', 'cup', 'cub', 'cull', 'cut', 'cuss',
		'pal', 'pat', 'pass', 'pad', 'pour', 'poll',
		'pot', 'pod', 'pep', 'peg', 'pet', 'puff',
		'pup', 'pub', 'pull', 'pug', 'put', 'pus',
		'war', 'wag', 'wad', 'was', 'wore',
		'web', 'well', 'wet', 'wed',
		'half', 'hag', 'hat', 'has', 'hop',
		'hog', 'hot', 'her', 'hell', 'head',
		'huff', 'hub', 'hull', 'hug', 'hut',
		'rap', 'rag', 'rat', 'roar', 'rob', 'roll', 'rot',
		'rod', 'red', 'rough', 'rub', 'rug', 'rut'
	];

	Plover["Consonant Clusters"] = [
		'course', 'cover', 'hover', 'rabble', 'refer',
		'rebel', 'robbed', 'rubbed', 'rubble', 'straps',
		'strapped', 'trouble', 'troubles', 'waft', 'webbed'
	];

	Plover["Where's the TRUFT?"] = [
		'past', 'castle', 'stressed', 'pressed',
		'passed', 'test', 'tussle', 'crossed'
	];

	Plover["Dropping Unstressed Vowels"] = [
		'several', 'suppress', 'averages', 'tablet',
		'tepid', 'superb', 'scaffold', 'scarlet',
		'starlet', 'started', 'ruffled', 'scuffled',
		'corrupted', 'spotted', 'horrible', 'effort'
	];

	Plover["Inversion"] = [
		'edit', 'elves', 'twelve', 'credit', 'portal'
	];

	Plover["The Fifth Vowel Key"] = [
		'still', 'rig', 'hit', 'sip',
		'sir', 'skirt',
		'crypt', 'syrup',
		'pig', 'rift', 'scribble', 'rid', 'river',
		'hid', 'wilt', 'wig', 'wit', 'spill'
	];

	Plover["Long Vowel Chords"] = [
		'aids', 'ace', 'ate', 'able', 'ape',
		'raid', 'raise', 'rail', 'rate', 'race', 'pay',
		'paid', 'pace', 'tape', 'spray', 'praise',
		'weaver', 'trees', 'eel', 'eat', 'evil',
		'ear', 'heat', 'heap', 'wield', 'weird',
		'peer', 'priest', 'tree', 'tweeze', 'tweed',
		'seat', 'cease', 'seed', 'seize', 'secrete',
		'ire', "I'll", 'ice', 'rife', 'ripe',
		'right', 'height', 'wild', 'pipe', 'pride',
		'prize', 'kite', 'type', 'spite',
		'hope', 'spore', 'post', 'sold', 'prose',
		'ode', 'oat', 'over', 'robe', 'rope',
		'roar', 'rove', 'host', 'wove', 'wrote', 'pole',
		'pose', 'cope', 'coat', 'code', 'crow', 'told',
		'cube', 'use', 'rude', 'rule', 'pure',
		'prude', 'Proust', 'cure', 'cruel', 'crude',
		'cruise', 'truce', 'truth', 'spew', 'skew',
	];

	Plover["Diphthong Chords"] = [
		'all', 'awful', 'raw', 'call', 'caught', 'crawl',
		'sprawl', 'scald', 'straw', 'halt', 'hall', 'wall',
		'out', 'how', 'howl', 'house', 'pout', 'power',
		'prowl', 'tower', 'spouse', 'sprout', 'scour',
		'soy', 'oil', 'coil', 'toil', 'soil'
	];

	Plover["Vowel Disambiguator Chords"] = [
		'wheel', 'wheal', 'read', 'reed', 'reel',
		'real', 'heel', 'heal', 'hear', 'here',
		'ware', 'wear', 'pea', 'pee', 'peace',
		'piece', 'tee', 'tea', 'sea', 'see',
		'tail', 'tale', 'sale', 'sail',
		'stare', 'stair', 'waist', 'waste',
		'hood', 'rude', 'pool', 'crew',
		'soot', 'truce', 'school', 'ruse',
		'road', 'rode', 'roar', 'toad', 'soar', 'sore'
	];

	Plover["The Missing Keys"] = [
		'due', 'duffer', 'deferral', 'devil', 'double',
		'drug', 'depress', 'desire', 'dessert', 'destroyed',
		'feral', 'ford', 'for', 'phrase', 'fierce',
		'fable', 'feeble', 'sphere', 'fries',
		'leader', 'lace', 'letter', 'lust', 'lovers',
		'glad', 'glare', 'glides', 'give', 'get', 'group',
		'guest', 'guide', 'gravel', 'cigarette', 'goblet',
		'bored', 'board', 'bruise', 'buyer', 'bobble', 'brutal',
		'zest', 'zap', 'zag',
		'vile', 'vase', 'virus',
		'eke', 'rockets', 'correct', 'quake', 'task'
	];

	Plover["The Remaining Missing Letters"] = [
		'nag', 'nap', 'nab', 'nut', 'never',
		'nestle', 'nod', 'nest', 'nerd',
		'pent', 'parent', 'went', 'earns', 'rant',
		'hunt', 'hand', 'panel', 'stun',
		'must', 'muffle', 'maggot', 'mallet', 'smuggle', 'morals',
		'arm', 'rum', 'harm', 'tempt', 'term',
		'calmed', 'palm', 'qualms',
		'jut', 'jug', 'just', 'jest', 'jets',
		'job', 'jostle', 'jazz', 'jagged',
		'urge', 'edge', 'average', 'purge', 'trudge', 'storage',
		'yard', 'yet', 'yurt'
	];

	Plover["Review Through Missing Letters"] = [
		'noun', 'inhibit', 'nudge', 'notes', 'knack',
		'enacts', 'neck', 'known', 'knock', 'gnome',
		'noise', 'novice', 'named', 'neural', 'snide', 'announce',
		'loin', 'donor', 'winner', 'dinner', 'learned', 'lend',
		'allowance', 'flaunt', 'deference', 'different', 'dance', 'diner',
		'demand', 'grunt', 'grant', 'gleans', 'severance', 'cement', 'design',
		'mound', 'mourn', 'maim', 'matter', 'commit',
		'commend', 'smudge', 'smuggle', 'semester',
		'forms', 'primed', 'serum', 'time', 'hermit',
		'maim', 'plumb', 'dream', 'gym', 'germ',
		'jam', 'blame', 'bottom', 'grammar',
		'balm', 'psalm',
		'judge', 'journal', 'join', 'joyful', 'jam', 'genders',
		'forge', 'budgets', 'average', 'leverage', 'merge',
		'beige', 'carriage', 'fidget', 'frigid', 'digit',
		'gadget', 'garage', 'grudge', 'turgid',
		'year', 'yearn', 'yolk'
	];

	Plover["Digraphs"] = [
		'thefts', 'thud', 'thus', 'thug',
		'hath', 'earth', 'oath', 'health',
		'wealth', 'worth', 'path', 'troth',
		'chess', 'chest', 'chart', 'chat',
		'chop', 'chore', 'chaff',
		'touch', 'etch', 'ratchet', 'hutch',
		'hatch', 'watch', 'patch', 'catch', 'crutch',
		'such', 'sketch', 'stretch', 'retch',
		'shell', 'shuffled', 'shall',
		'ash', 'rush', 'rash', 'hush', 'hash',
		'wash', 'push', 'posh', 'crush', 'crash',
		'trash', 'squash', 'stash',
		'anger', 'storing', 'rung', 'rang', 'prong',
		'tongue', 'twang', 'song', 'stung', 'strong',
		'sponge', 'orange'
	];

	Plover["Review Through Digraphs"] = [
		'thing', 'thence', 'them', 'thumb',
		'thrill', 'throng', 'thrash',
		'seethe', 'method', 'math', 'birth', 'breath',
		'fifth', 'death', 'sleuth', 'blithe', 'growth',
		'choose', 'chasm', 'chuck', 'check',
		'churn', 'cherub', 'chin', 'channel',
		'chant', 'chance', 'chive', 'charm',
		'bleach', 'much', 'latch', 'leech', 'match',
		'botch', 'fetch', 'ditch', 'glitch', 'vouch',
		'slouch', 'smooch', 'splotch',
		'shim', 'slime', 'shrewd', 'shrine', 'shuck',
		'shark', 'shock', 'sheesh', 'shrivel', 'sugar',
		'lash', 'mesh', 'mash', 'plush', 'bush',
		'brush', 'fish', 'fresh', 'flush', 'flesh',
		'flash', 'dash', 'delish', 'gosh', 'gash',
		'shush', 'slash', 'smush', 'slosh', 'splash',
		'squish', 'Irish',
		'anger', 'finger', 'dung', 'lung', 'ping',
		'pong', 'among', 'bring', 'young', 'fang',
		'flung', 'gang', 'belong',
		'change', 'range', 'hinge', 'lounge', 'plunge',
		'cringe', 'tinge', 'fringe', 'derange', 'grunge', 'syringe'
	];

	Plover["Common Compound Clusters"] = [
		'hemp', 'trump', 'rump', 'romp', 'ramp',
		'pump', 'camp', 'cramp', 'tamp', 'pomp',
		'curve', 'carve', 'serve', 'swerve', 'starve',
		'squelch',
		'hulk', 'calc', 'sulk', 'talc',
		'rank', 'honk', 'wonk', 'prank', 'crank', 'tank',
		'session', 'option', 'ration', 'portion',
		'passion', 'cushion', 'caption', 'suppression',
		'section', 'correction', 'suction',
		'arch', 'ranch', 'hunch', 'porch', 'crunch',
		'quench', 'torch', 'trench', 'stench', 'starch', 
	];

	Plover["Review Through Common Compound Clusters"] = [
		'limp', 'blimp', 'chomp', 'clamp',
		'damp', 'slump', 'shrimp', 'jump',
		'nerve', 'verve', 'marvel',
		'village', 'mulch', 'bulge', 'belch',
		'bilge', 'gulch', 'pillage',
		'ilk', 'milk', 'bulk', 'silk', 'bilk',
		'wink', 'mink', 'plank', 'brink', 'blink',
		'blank', 'flank', 'flunk', 'dank', 'drink',
		'gunk', 'junk', 'link', 'chunk',
		'lesion', 'provision', 'fusion', 'lotion',
		'operation', 'mission', 'motion', 'pollution',
		'election', 'auction', 'correction', 'collection',
		'fraction', 'friction', 'depiction', 'selection', 'seduction',
		'finch', 'clench', 'branch', 'march', 'lurch',
		'lynch', 'birch', 'brunch', 'church', 'drench'
	];

	Plover["Common Briefs 1-20"] = [
		"the", "of", "to", "in", "a",
		"is", "that", "with", "be", "by",
		"he", "I", "this", "are", "which",
		"have", "they", "you", "you'd", "you'll"
	];

	Plover["Common Briefs 21-40"] = [
		"you're", "you've", "were", "can", "there",
		"been", "if", "would", "who", "other",
		"what", "only", "do", "new", "about",
		"two", "any", "could", "after", "said"
	];

	Plover["Common Briefs 41-60"] = [
		"very", "many", "even", "where", "through",
		"being", "because", "before", "upon", "without",
		"another", "against", "every", "within", "example",
		"others", "therefore", "having", "become", "whether"
	];

	Plover["Common Briefs 61-80"] = [
		"somebody", "somehow", "someone", "someplace", "something",
		"sometimes", "somewhere", "question", "almost", "interest",
		"ever", "became", "probably", "include", "includes",
		"included", "including", "amount", "receive", "received"
	];

	Plover["Common Briefs 81-100"] = [
		"describe", "described", "anything", "continue", "continued",
		"beginning", "understand", "understanding", "today", "opinion",
		"becomes", "yes", "idea", "ideas", "actually",
		"move", "ask", "unless", "easy", "otherwise"
	];

})();  // Execute the code in the wrapper function.
