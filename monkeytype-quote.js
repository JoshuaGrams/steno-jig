function getQuoteById(id) {
	id = +id
	const quotes = monkeytype.quotes
	for(let i=0; i<quotes.length; ++i) {
		if(quotes[i].id === id) return quotes[i]
	}
}

function getQuoteByLength(lo, hi) {
	const quotes = monkeytype.quotes.filter(q => q.text.length >= lo && q.text.length <= hi)
	return quotes[Math.floor(quotes.length * Math.random())]
}

function getQuote(id, lo, hi) {
	if(id != null) return getQuoteById(id)
	else return getQuoteByLength(lo, hi)
}

function generateExercise(id, lo, hi) {
	const quote = getQuote(id, lo, hi)
	const words = quote.text.trim().split(/\s+/)
	const exercise = new TypeJig.Exercise(words, 0, false, 'ordered')
	exercise.name = "Monkeytype English Quote #" + quote.id + " (from " + quote.source + ")"
	exercise.quote = quote
	return exercise
}

function replaceID(href, id) {
	href = href.split('&').filter(x => !/^id=/.test(x)).join('&')
	let sep = document.location.search==='' ? '?' : '&'
	return href + sep + 'id=' + id
}

loadSettings()

window.onload = function() {
	var fields = parseQueryString(document.location.search)
	switch(fields.length) {
		case 'short': fields.lo = 0; fields.hi = 100; break
		case 'medium': fields.lo = 101; fields.hi = 300; break
		case 'long': fields.lo = 301; fields.hi = 600; break
		case 'thicc': fields.lo = 601; fields.hi = Infinity; break
		case 'all':
		default:
			fields.lo = 0; fields.hi = Infinity; break
	}

	var hints = initializeHints(fields.hints, fields.floating_hints)
	var speed = {wpm: fields.wpm, cpm: fields.cpm}

	var exercise = generateExercise(fields.id, fields.lo, fields.hi)
	window.history.replaceState(null, '', replaceID(document.location.href, exercise.quote.id))

	var jig = setExercise(exercise.name, exercise, hints, speed)

	var back = document.getElementById('back')
	back.href = back.href.replace('monkeytype-quote', 'form')
	var again = document.getElementById('again')
	again.addEventListener('click', function(evt) {
		evt.preventDefault()
		jig.reset()
	})
	var another = document.getElementById('new')
	another.href = document.location.href.split('&').filter(x => !/^id=/.test(x)).join('&')
	another.addEventListener('click', function(evt) {
		evt.preventDefault()
		let exercise = generateExercise(null, fields.lo, fields.hi)
		jig.exercise = exercise
		changeName(exercise.name)
		window.history.pushState(null, '', replaceID(document.location.href, exercise.quote.id))
		jig.reset()
	})
}
