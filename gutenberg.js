/**
 * Generate an exercise based on gutenberg-data.js (make sure to import that)
 * 
 * @param {number} word_count The exercise will contain this many words
 * @param {number} top_n Sentences will contain only the top N number of words (clamped between 100 and 8000)
 * @param {function} rng A seed for the RNG
 */
function generateExercise(word_count, top_n, rng) {
    // round up
    top_n = Math.floor((top_n + 99) / 100) * 100
    if (top_n < 100) {
        top_n = 100
    }
    if (top_n > 8000) {
        top_n = 8000
    }

    let words = [], sentence
    let chars_left = word_count * 5
    let top_n_bucket = window.sentences_by_top_100[top_n / 100 - 1]
    while (chars_left > 0) {
        sentence = top_n_bucket[Math.floor(rng() * top_n_bucket.length)]
        chars_left -= sentence.length
        words.splice(0, 0, ...sentence.split(' '))
    }

    return new TypeJig.Exercise(words, 0, false, 'ordered');
}

window.onload = function () {
    var fields = parseQueryString(document.location.search)

    var rng = new_rng(fields.seed)

    var top_n = fields.top == null ? 100 : parseInt(fields.top)
    var word_count = fields.word_count == null ? 100 : parseInt(fields.word_count)

    var name = "Sentences from Project Gutenberg that contain only the top " + top_n + " words.";
    var hints = initializeHints(fields.hints, fields.floating_hints);
    var exercise = generateExercise(word_count, top_n, rng);

    var jig = setExercise(name, exercise, hints);

    var back = document.getElementById('back');
    var again = document.getElementById('again');
    var another = document.getElementById('new');
    var nextSeed = prepareNextSeed(another);
    back.href = back.href.replace('gutenberg', 'form');
    again.addEventListener('click', function (evt) {
        evt.preventDefault();
        jig.reset();
    })
    another.addEventListener('click', function (evt) {
        evt.preventDefault();
        window.history.replaceState('', '', updateURLParameter(window.location.href, 'seed', nextSeed));
        let rng = new_rng(nextSeed);
        let exercise = generateExercise(word_count, top_n, rng);
        jig.exercise = exercise;
        jig.reset();
        nextSeed = prepareNextSeed(another);
    })
}

setTheme()
