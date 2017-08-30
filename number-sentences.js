// Number Sentences
// ================

// Takes `timeLimit` parameter (floating-point minutes).
function numberSentences(params) {
	var seconds = Math.round(60 * params.timeLimit);
	exercise = new TypeJig.Exercise([], seconds);
	exercise.nouns = TypeJig.WordSets.Nouns.slice();
	exercise.actions = [].concat(
		TypeJig.WordSets.TransitiveVerbs.map(function(v){return [v, 'v'];}),
		TypeJig.WordSets.Adjectives.map(function(a){return [a, 'a'];})
	);
	exercise.sentence = [];
	randomize(exercise.nouns);
	randomize(exercise.actions);
	exercise.nextWord = nextNumberWord;
	exercise.nextSentence = nextNumberSentence;
	exercise.nextClause = nextNumberClause;
	exercise.name = 'Number Sentences';
	return exercise;
}

function nextNumberWord() {
	if(this.sentence.length === 0) {
		this.sentence = this.nextSentence();
	}
	return this.sentence.shift();
}

function nextNumberSentence() {
	var type = ['.', '!', '?', ','][randomIntLessThan(4)];
	var num = 2 + randomIntLessThan(98);
	var noun = pluralize(rotateAndShuffle(this.nouns));
	var action = rotateAndShuffle(this.actions);
	var tense;
	if(type === '?') tense = 0;
	else tense = randomIntLessThan(2);
	var s = this.nextClause(num, noun, action, tense);
	s[s.length-1] += type;
	if(type === '?') {
		if(action[1] === 'v') {
			s.unshift(['Do', 'Did'][randomIntLessThan(2)]);
		} else if(action[1] === 'a') {
			var verb = ['Are', 'Were'][randomIntLessThan(2)];
			s.splice(2, 1);
			s.unshift(verb);
		}
	} else if(type === ',') {
		var conj = ['but', 'while', 'so', 'and', 'or'];
		s.push(conj[randomIntLessThan(conj.length)]);
		var num = 2 + randomIntLessThan(98);
		var noun = pluralize(rotateAndShuffle(this.nouns));
		var action = rotateAndShuffle(this.actions);
		s = s.concat(this.nextClause(num, noun, action, tense));
		s[s.length-1] += '.';
	}
	return s;
}

function nextNumberClause(num, noun, action, tense) {
	if(action[1] === 'v') {
		var verb = action[0][tense].split(' ');
		var num2 = 1 + randomIntLessThan(99);
		var noun2 = rotateAndShuffle(this.nouns);
		if(num2 > 1) noun2 = pluralize(noun2);
		return [].concat(num+'', noun, verb, num2+'', noun2);
	} else {
		verb = ["are", "were"];
		var adjective = action[0].split(' ');
		return [].concat(num+'', noun, verb[tense], adjective);
	}
}

