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
	let [h,q] = href.split('?')
	q = (q||'').split('&').filter(x => !/^id=/.test(x))
	if(id) q.push('id='+id)
	return h+'?'+q.join('&')
}

loadSettings()

let jig, exercise, fields

function go(ex) {
	fields = parseQueryString(document.location.search)
	let hints = initializeHints(fields.hints, fields.floating_hints)
	if(ex == null) {
		switch(fields.length) {
			case 'short': fields.lo = 0; fields.hi = 100; break
			case 'medium': fields.lo = 101; fields.hi = 300; break
			case 'long': fields.lo = 301; fields.hi = 600; break
			case 'thicc': fields.lo = 601; fields.hi = Infinity; break
			case 'all':
			default:
				fields.lo = 0; fields.hi = Infinity; break
		}
		exercise = generateExercise(fields.id, fields.lo, fields.hi)
	} else exercise = ex

	jig = setExercise(exercise.name, exercise, hints, fields, jig)
}

window.addEventListener('load', function() {
	go()
	window.history.replaceState(null, '', replaceID(document.location.href, exercise.quote.id))

	let another = document.getElementById('new')
	another.href = replaceID(document.location.href)
})
window.addEventListener('popstate', function(){ go() })
