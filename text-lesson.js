function textLesson(url) {
	const name = url
	fetch(url).then(function(r) {
		if(!r.ok) throw new Error('Failed to load, status: ' + r.status + ' ' + r.statusText)
		else return r.text()
	}).then(function(text) {
		const words = text.trim().split(/\s+/)
		exercise = new TypeJig.Exercise(words, 0, false, 'ordered')
		setExercise(name, exercise, hints, fields)
	}).catch(function(error) {
		changeName(error)
	})
}

loadSettings()

const another = document.getElementById('new')
// Exercise isn't randomized, so there's no sense asking for another.
another.parentNode.remove()

const fields = parseQueryString(document.location.search)
const hints = initializeHints(fields.hints, fields.floating_hints)
let exercise, jig
textLesson(fields.url)
