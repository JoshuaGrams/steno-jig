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

window.addEventListener('load', () => loadExercisePage(args => {
	const nWords = args.word_count==null ? 100 : parseInt(args.word_count)
	return {
		generate: (rng, options) => generateExercise(nWords, rng),
		options: { name: "Short Sentences" }
	}
}))
