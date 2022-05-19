function compute_ngrams(sentences, order) {
    const ngrams = { "": [] };
    for (let i = 0; i < sentences.length; ++i) {
        const words = sentences[i].split(/\s+/);
        for (let j = 0; j < words.length - order; ++j) {
            const Gram = words.slice(j, j + order).join(" ");
            if (j === 0) ngrams[""].push(Gram);
            const gram = Gram.toLowerCase();
            const next = words[j + order];
            if (ngrams[gram] == null) ngrams[gram] = [];
            ngrams[gram].push(next);
        }
    }
    return ngrams;
}

function generate_sentence(ngrams, rnd) {
    const choose = (a) => a[Math.floor(rnd() * a.length)];
    let sentence = choose(ngrams[""]).split(" ");
    const order = sentence.length;
    while (true) {
        const last = sentence.slice(-order).join(" ").toLowerCase();
        const following = ngrams[last];
        if (following == null) break;
        sentence.push(choose(following));
    }
    return sentence;
}

function generateMarkovExercise(ngrams, word_count, rnd) {
    let words = [];
    let chars_left = word_count * 5 + 1;
    while (chars_left > 0) {
        const sentence = generate_sentence(ngrams, rnd);
        chars_left -= 1 + sentence.join(" ").length;
        words.splice(words.length, 0, ...sentence);
    }
    return new TypeJig.Exercise(words, 0, false, "ordered");
}

window.onload = function () {
    var fields = parseQueryString(document.location.search);

    var rng = new_rng(fields.seed);

    var word_count =
        fields.word_count == null ? 100 : parseInt(fields.word_count);

    var name = "Markov-chain generated sentences";
    const ngrams = compute_ngrams(sentences, 3);
    var exercise = generateMarkovExercise(ngrams, word_count, rng);

    var jig = setExercise(name, exercise, null, fields);

    var back = document.getElementById("back");
    var again = document.getElementById("again");
    var end = document.getElementById("end");
    var another = document.getElementById("new");
    var nextSeed = this.prepareNextSeed(another);
    back.href = back.href.replace("markov", "form");
    again.addEventListener("click", function (evt) {
        evt.preventDefault();
        jig.reset();
    });
    end.addEventListener("click", function (evt) {
        evt.preventDefault();
        jig.endExercise();
    });
    another.addEventListener("click", function (evt) {
        evt.preventDefault();
        window.history.replaceState(
            "",
            "",
            updateURLParameter(window.location.href, "seed", nextSeed)
        );
        let rng = new_rng(nextSeed);
        let exercise = generateMarkovExercise(ngrams, word_count, rng);
        jig.exercise = exercise;
        jig.reset();
        nextSeed = prepareNextSeed(another);
    });
};

setTheme();
