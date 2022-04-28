function clamp_top_n(top_n) {
    // round up
    top_n = Math.floor((top_n + 99) / 100) * 100
    if (top_n < 100) {
        top_n = 100
    }
    if (top_n > 8000) {
        top_n = 8000
    }
    return top_n
}


/**
 * Generate an exercise based on gutenberg-data.js (make sure to import that)
 *
 * @param {number} word_count The exercise will contain this many words
 * @param {number} top_n Sentences will contain only the top N number of words (clamped between 100 and 8000)
 * @param {function} rng A seed for the RNG
 */
function generateExercise(word_count, top_n, rng) {
    top_n = clamp_top_n(top_n)
    let words = [], sentence
    let chars_left = word_count * 5 + 1
    let top_n_bucket = window.sentences_by_top_100[top_n / 100 - 1]
    while (chars_left > 0) {
        sentence = top_n_bucket[Math.floor(rng() * top_n_bucket.length)]
        chars_left -= 1 + sentence.length
        words.splice(words.length, 0, ...sentence.split(' '))
    }

    return new TypeJig.Exercise(words, 0, false, 'ordered');
}

window.addEventListener('load', () => loadExercisePage(args => {
	const topN = clamp_top_n(args.top==null ? 100 : parseInt(args.top))
	const nWords = args.word_count==null ? 100 : parseInt(args.word_count)

	return {
		generate: (rnd, opt) => generateExercise(nWords, topN, rnd),
		options: { name: "Project Gutenberg sentences for words "+(topN-99)+" to "+topN+"." }
	}
}))
