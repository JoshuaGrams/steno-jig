// Wrap everything in a function to avoid polluting the global namespace.
(function() {
	let Intro = {}
	TypeJig.WordSets.Intro = Intro

	// pep weapon help rep
	// pet wet het ret
	// pip WIP hip rip
	// pill will hill rill

	Intro.LeftIndex = [ 'hip', 'rip' ]

	Intro.LeftIndexAlt = Intro.LeftIndex.slice()
	Intro.LeftIndexAlt.alternate = 'was'

	Intro.LeftMiddle = [ 'pip', 'WIP' ]

	Intro.LeftMiddleAlt = Intro.LeftMiddle.slice()
	Intro.LeftMiddleAlt.alternate = 'is'

	Intro.LeftIndexMiddle = ['pet', 'wet', 'het', 'ret']
	Intro.LeftIndexMiddle.alternate = 'or'

	Intro.LeftRingPinky = ['sip', 'tip', 'kip']

	Intro.LeftRingPinkyAlt = Intro.LeftRingPinky.slice()
	Intro.LeftRingPinkyAlt.alternate = 'was'

	Intro.Left = ['sat', 'tat', 'cat', 'pat', 'watt', 'hat', 'rat']
	Intro.Left.alternate = 'or'

})();  // Execute the code in the wrapper function.
