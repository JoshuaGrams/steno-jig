// Word-based drills
// =================

// Takes parameters:
//
// - `drill`: look up in TypeJig.WordSets.  Can have multiple
// drills which will be merged together.
//
// - `timeLimit`: floating-point minutes.
//
// - `type`:
//   - not present: drill words once in order (normal text).
//   - `randomly`: drill words in random order until `timeLimit`.
//   - `shuffled`: drill words once in a random order.

function wordDrill(params) {
	var words = getDrillWords(params.drill);
	if(!words.length) return;
	var name = words.name;

	var timeLimit = 0;

	var first = +params.first || 0;
	var count = +params.count || words.length;
	if(first !== 0 || count !== words.length) {
		words = words.slice(first, first+count);
		name += ' ' + first + ' to ' + (first+count);
	}
	var randomly = (params.type === 'randomly');

	if(params.type === 'randomly') {
		timeLimit = Math.round(60 * params.timeLimit);
		name = timeString(params.timeLimit) + ' of Random ' + name;
	} else if(params.type === 'shuffled') {
		name = 'Randomized ' + name;
		shuffleTail(words, words.length);
	}

	exercise = new TypeJig.Exercise(words, timeLimit, randomly, params.select);
	exercise.name = name;
	return exercise;
}

function getDrillWords(drills) {
	if(!Array.isArray(drills)) drills = [drills];
	var name = ''; words = [];
	for(let i=0; i<drills.length; ++i) {
		var w = TypeJig.WordSets[drills[i]]
		if(w) {
			var last = (i === drills.length-1);
			name = nameAnd(name, last, drills[i]);
			words = words.concat(w);
		}
	}
	words.name = name;
	return words;
}

function nameAnd(name, last, clause) {
	if(name.length) {
		name += ', ';
		if(last) name += 'and ';
	}
	return name + clause;
}

function timeString(minutes) {
	var seconds = Math.round(60 * (minutes % 1));
	if(seconds < 10) seconds = '0' + seconds;
	minutes = Math.floor(minutes);
	return minutes + ':' + seconds;
}
