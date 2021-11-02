function generateFingerDrill(pair, iterations) {
	let words = [];
	for(let i=0; i<iterations; ++i) words.push.apply(words, pair);
	words.push(pair[0]);

	var exercise = new TypeJig.Exercise(words, 0, false, 'ordered');
	exercise.name = "Finger Drill: " + pair[0] + ', ' + pair[1]
	return exercise
}

function generateDreadedDuoDrill(section, drill, iterations) {
	let exercise = generateFingerDrill(dreadedDuo[section-1][drill-1], iterations)
	let n = dreadedDuo[section-1].length

	exercise.name = "Da Dreaded Dueling Digit Duo Drills";
	exercise.name += ' (Section ' + section + ', #' + drill + ' of ' + n + ')';
	return exercise;
}

function linkNextDrill(link, fields, updateFields) {
	var section = fields.section, drill = fields.drill;
	if(drill === dreadedDuo[section-1].length) {
		drill = 1;
		if(section === dreadedDuo.length) section = 1;
		else ++section;
	} else ++drill;
	let url = updateURLParameter(window.location.href, 'section', section);
	url = updateURLParameter(url, 'drill', drill);
	link.href = url;
	if(updateFields) {
		fields.section = section;
		fields.drill = drill;
	}
}

window.onload = function() {
	var fields = parseQueryString(document.location.search)
	fields.iterations = fields.iterations || 20;

	var speed = {wpm: fields.wpm, cpm: fields.cpm};

	var exercise;
	if(fields.strokes) {
		exercise = generateFingerDrill(fields.strokes.split('/'), fields.iterations);
	} else {
		fields.section = Math.max(1, Math.min(fields.section || 1, dreadedDuo.length))
		fields.drill = Math.max(1, Math.min(fields.drill || 1, dreadedDuo[fields.section-1].length))
		exercise = generateDreadedDuoDrill(fields.section, fields.drill, fields.iterations);
	}

	var jig = setExercise(exercise.name, exercise, null, speed);

	var back = document.getElementById('back');
	var again = document.getElementById('again');
	var next = document.getElementById('new');
	if(fields.a && fields.b) next.parentNode.removeChild(next);
	else linkNextDrill(next, fields);
	back.href = back.href.replace('finger-drills', 'form');
	again.addEventListener('click', function(evt) {
		evt.preventDefault();
		jig.reset();
	})
}

setTheme()
