const choose = (a,rnd) => a[Math.floor(rnd()*a.length)]

function generateExercise(wordCount, rnd) {
	let prevElements = [], element
	let words = []
	let charsLeft = wordCount * 5 + 1
	while (charsLeft > 0) {
		do {
			element = choose(shortSentences, rnd)
		} while(prevElements.includes(element))
		if(prevElements.length > 20) prevElements.shift()
		prevElements.push(element)
		const string = typeof element === 'string' ? element : element.join(' ')
		const array = Array.isArray(element) ? element : element.split(/\s+/)
		charsLeft -= 1 + string.length
		words.splice(words.length, 0, ...array)
	}
	return new TypeJig.Exercise(words, 0, false, 'ordered')
}

window.onload = function() {
	var fields = parseQueryString(document.location.search)

	if(!fields.seed) {
		fields.seed = ''+Math.random()
		window.history.replaceState('', '', updateURLParameter(window.location.href, 'seed', fields.seed))
	}
	var rng = PRNG(fields.seed)

	var wordCount = fields.word_count == null ? 100 : parseInt(fields.word_count)

	var name = "Short Sentences"
	var hints = initializeHints(fields.hints, fields.floating_hints)

	var exercise = generateExercise(wordCount, rng)

	var jig = setExercise(name, exercise, hints, fields)

	var back = document.getElementById('back')
	var again = document.getElementById('again')
	var another = document.getElementById('new')
	var nextSeed = this.prepareNextSeed(another)
	back.href = back.href.replace('short-sentences', 'form')
	again.addEventListener('click', function(evt) {
		evt.preventDefault()
		jig.reset()
	})
	another.addEventListener('click', function(evt) {
		evt.preventDefault()
		window.history.replaceState('', '', updateURLParameter(window.location.href, 'seed', nextSeed))
		let exercise = generateExercise(wordCount, PRNG(nextSeed))
		jig.exercise = exercise
		jig.reset()
		nextSeed = prepareNextSeed(another)
	})
}

setTheme()
