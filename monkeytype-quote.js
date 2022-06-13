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

const lengths = {
	short: [0, 100],
	medium: [101, 300],
	long: [301, 600],
	thicc: [601, Infinity]
}

function go(ex) {
	fields = parseQueryString(document.location.search)
	let hints = initializeHints(fields.hints, fields.floating_hints)
	if(ex == null) {
		if(!fields.length) {
			fields.lo = fields.lo || 0
			fields.hi = fields.hi || Infinity
		} else {
			if(!Array.isArray(fields.length)) fields.length = [fields.length]
			fields.lo = Infinity
			fields.hi = 0
			for(const L of fields.length) if(lengths[L]) {
				const [lo, hi] = lengths[L]
				fields.lo = Math.min(lo, fields.lo)
				fields.hi = Math.max(hi, fields.hi)
			}
			if(fields.lo === Infinity) fields.lo = 0
			if(fields.hi === 0) fields.hi = Infinity
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
