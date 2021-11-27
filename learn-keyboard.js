// Wrap everything in a function to avoid polluting the global namespace.
(function() {

	let E = {};
	TypeJig.WordSets.LearnKeyboard = E;

	/**
	 * Randomize array element order in-place.
	 * Using Durstenfeld shuffle algorithm.
	 */
	function shuffle(a) {
		for (var i=a.length-1; i>=1; i--) {
			var j = Math.floor(Math.random() * (i+1));
			var a_i=a[i]; a[i]=a[j];  a[j]=a_i;
		}
		return a;
	}

	function IndividualChords(chords, count, intro, line_length) {
		const reversed = [...chords].reverse()
		const shuffled = shuffle([...chords])
		if(intro === false) intro = []
		else {
			intro = [].concat(chords, chords, reversed, reversed)
			intro[2*chords.length] = '\n'+intro[2*chords.length]
			for(const ch of shuffled) {
				for(let i=0; i<3; ++i) intro.push((i===0?'\n':'')+ch)
			}
		}
		return (function() {
			if(this.i < this.intro.length) {
				return this.intro[this.i++]
			} else if(this.i<count) {
				const N = line_length || 2*this.chords.length
				const i = this.i - this.intro.length
				++this.i
				const r = i%N === 0 && this.i>1 && this.i<count? '\n' : ''
				const c = Math.floor(this.chords.length * Math.random())
				return r + this.chords[c]
			} else this.i = 0
		}).bind({chords: chords, intro: intro, i: 0})
	}

	function ChordCombos(groups, count) {
		return (function() {
			const nl = this.i%8 === 0 && this.i>0 && this.i<count-1? '\n' : ''
			if(this.i<count) {
				++this.i
				let chord = nl
				for(const g of groups) {
					chord += g[Math.floor(g.length * Math.random())]
				}
				return chord
			} else this.i = 0
		}).bind({i: 0})
	}

	E["Left hand, bottom row"] = IndividualChords(['S','K','W','R'],100)
	E["Right hand, bottom row"] = IndividualChords(['-S','-G','-B','-R'],100)
	E["Left hand, top row"] = IndividualChords(['S','T','P','H'],100)
	E["Right hand, top row"] = IndividualChords(['-F','-P','-L','-T'],100)
	E["Right hand, full bottom row"] = IndividualChords(['-Z','-S','-G','-B','-R'],100)
	E["Right hand, full top row"] = IndividualChords(['-F','-P','-L','-T','-D'],100)
	E["Vowels"] = IndividualChords(['A','O','E','U'],100)
	// E['"Long" vowels'] = IndividualChords(['AEU','OEU','AOE','AOU','AOEU'],100)
	// E["Diphthongs and Disambiguators"] = IndividualChords(['AO','OE','AE','OU','AU'],100)
	E["Left hand"] = IndividualChords(['S','T','K','P','W','H','R'],100,false,20)
	E["Right hand"] = IndividualChords(['-F','-R','-P','-B','-L','-G','-T','-S','-D','-Z'],100,false,20)
	E["All keys"] = IndividualChords(['S','T','K','P','W','H','R','A','O','E','U','-F','-R','-P','-B','-L','-G','-T','-S','-D','-Z'],100,false,20)
	E["Left + Right"] = ChordCombos([
		['S','T','K','P','W','H','R'],
		['-F','-R','-P','-B','-L','-G','-T','-S','-D','-Z']
	], 104, false)
	E["Left + Vowel"] = ChordCombos([
		['S','T','K','P','W','H','R'],
		['A','O','E','U']
	], 104, false)
	E["Vowel + Right"] = ChordCombos([
		['A','O','E','U'],
		['F','R','P','B','L','G','T','S','D','Z']
	], 104, false)
	E["Left + Vowel + Right"] = ChordCombos([
		['S','T','K','P','W','H','R'],
		['A','O','E','U'],
		['F','R','P','B','L','G','T','S','D','Z']
	], 104, false)
	E["Columns: D, B, L, -N"] = IndividualChords(['D-','B-','L-','-N'],100)
	E["Rows (2-key): F, M, Q, -M, -K"] = IndividualChords(['F-', 'M-', 'Q-', '-M', '-K'],100)
	E["Rows: N, Y, J, C, V"] = IndividualChords(['N-', 'Y-', 'J-', 'C-', 'V-'], 100)
	E["Other chords: G, X, Z, -J"] = IndividualChords(['G-', 'X-', 'Z-', '-J'], 100)

})();  // Execute the code in the wrapper function.
