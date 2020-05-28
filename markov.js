function new_rng(seed_txt) {
	var s, i, j, tmp
	s = new Array(256);
	for (i = 0; i < 256; ++i) {
		s[i] = i;
	}
	if (seed_txt == null) {
		seed_txt = Math.random().toString()
	}
	for (i = j = 0; i < 256; ++i) {
		j += s[i] + seed_txt.charCodeAt(i % seed_txt.length);
		j %= 256;
		tmp = s[i]; s[i] = s[j]; s[j] = tmp;
	}
	return function() {
		var p, ret = 0
		for (p = 0; p < 7; ++p) {
			ret *= 256
			i = (i + 1) % 256;
			j = (j + s[i]) % 256;
			tmp = s[i]; s[i] = s[j]; s[j] = tmp;
			ret += s[(s[i] + s[j]) % 256];
		}
		return ret / 72057594037927935.0
	}
}

function compute_ngrams(sentences, order) {
	const ngrams = {"": []}
	for(let i=0; i<sentences.length; ++i) {
		const words = sentences[i].split(/\s+/)
		for(let j=0; j<words.length-order; ++j) {
			const Gram = words.slice(j, j+order).join(' ')
			if(j === 0) ngrams[""].push(Gram)
			const gram = Gram.toLowerCase()
			const next = words[j+order]
			if(ngrams[gram] == null) ngrams[gram] = []
			ngrams[gram].push(next)
		}
	}
	return ngrams
}

function generate_sentence(ngrams, rnd) {
	const choose = (a) => a[Math.floor(rnd()*a.length)]
	let sentence = choose(ngrams['']).split(' ')
	const order = sentence.length
	while(true) {
		const last = sentence.slice(-order).join(' ').toLowerCase()
		const following = ngrams[last]
		if(following == null) break
		sentence.push(choose(following))
	}
	return sentence
}

function generateMarkovExercise(ngrams, word_count, rnd) {
	let words = []
	let chars_left = word_count * 5
	while (chars_left > 0) {
		const sentence = generate_sentence(ngrams, rnd)
		chars_left -= sentence.join(' ').length
		words.splice(0, 0, ...sentence)
	}
	return new TypeJig.Exercise(words, 0, false, 'ordered');
}

window.onload = function() {
	var fields = parseQueryString(document.location.search)

	var rng = new_rng(fields.seed)

	var word_count = fields.word_count == null ? 100 : parseInt(fields.word_count)

	var name = "Markov-chain generated sentences";
	var hints = null;

	if(fields.hints) {
		var strokes = document.getElementById('strokes');
		if(fields.floating_hints) {
			strokes.style.position = 'fixed';
		}
		var translations = TypeJig.shortestTranslations(TypeJig.Translations.Plover);
		hints = new StenoDisplay(strokes, translations, true);
	}

	const ngrams = compute_ngrams(top_2k_sentences, 3);
	var exercise = generateMarkovExercise(ngrams, word_count, rng);

	var jig = setExercise(name, exercise, hints);

	var back = document.getElementById('back');
	var again = document.getElementById('again');
	var another = document.getElementById('new');
	another.href = document.location.href.toString().replace(/seed=([^&#]*)/, 'seed=' + Math.random().toString());
	back.href = back.href.replace('markov', 'form');
	again.addEventListener('click', function(evt) {
		evt.preventDefault();
		jig.reset();
	})
	another.addEventListener('click', function(evt) {
		evt.preventDefault();
		let seed = Math.random().toString();
		window.history.replaceState('', '', updateURLParameter(window.location.href, 'seed', seed));
		let rng = new_rng(seed);
		let exercise = generateMarkovExercise(ngrams, word_count, rng);
		jig.exercise = exercise;
		jig.reset();
	})
}

setTheme()
