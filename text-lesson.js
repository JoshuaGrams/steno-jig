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

const back = document.getElementById('back')
const again = document.getElementById('again')
const another = document.getElementById('new')
back.href = back.href.replace('text-lesson', 'form')
again.addEventListener('click', function(evt) {
	evt.preventDefault()
	jig.reset()
})
// Exercise isn't randomized, so there's no sense asking for another.
another.parentNode.remove()

const fields = parseQueryString(document.location.search)

let exercise, jig
textLesson(fields.url)
