function parseQueryString(query) {
	var vars = {};
	query = query.substring(1);  // remove leading '?'
	var pairs = query.replace(/\+/g,'%20').split('&');
	for(var i=0; i<pairs.length; ++i) {
		var name, value='';
		var n = pairs[i].indexOf('=');
		if(n === -1) name = decodeURIComponent(pairs[i]);
		else {
			name = decodeURIComponent(pairs[i].substring(0, n));
			value = decodeURIComponent(pairs[i].substring(n+1));
		}
		if(vars.hasOwnProperty(name)) {
			if(!Array.isArray(vars[name])) vars[name] = [vars[name]];
			vars[name].push(value);
		} else vars[name] = value;
	}
	return vars;
}

function getFormFields(form) {
	var fields = {};
	for(var i=0; i<form.elements.length; ++i) {
		var input = form.elements[i];
		if(input.type === 'checkbox' && !input.checked) continue;
		fields[input.name] = input.value
	}
	return fields;
}

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
    return function () {
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

function initializeHints(hints, floating_hints) {
    if (!hints) return null;

    var strokes = document.getElementById('strokes');
    if (floating_hints) {
        strokes.style.position = 'fixed';
    }
    var translations = TypeJig.shortestTranslations(TypeJig.Translations.Plover);
    return new StenoDisplay(strokes, translations, true);
}

function changeName(name) {
	var h = document.getElementById('lesson-name')
	if(h.lastChild) h.removeChild(h.lastChild)
	h.appendChild(document.createTextNode(name))
	document.title = name + ' - ' + document.title.replace(/^.*? - /, '')
}

function setExercise(name, exercise, hints, options, jig) {
	var h = document.getElementById('lesson-name');
	h.textContent = name;
	document.title = name + ' - Steno Jig';

	if(jig == null) {
		jig = new TypeJig(exercise, 'exercise', 'results', 'input', 'clock', hints, options);

		var back = document.getElementById('back');
		back.href = document.location.href.replace(/\?.*$/, '').replace(/\/[^\/]*$/,'') + '/' + (options.menu || 'form') + '.html';
		var again = document.getElementById('again');
		again.href = document.location.href;
		again.addEventListener('click', function(evt) {
			evt.preventDefault();
			jig.reset();
		})
	} else jig.exercise = exercise;
	window.setTimeout(function(){jig.reset()}, 0)
	return jig
}

function setExercise2(exercise, options, jig) {
	return setExercise(options.name, exercise, options.hintObj, options, jig)
}

function URLSetSeed(seed, url) {
	return updateURLParameter(url || window.location.href, 'seed', seed)
}

function URLGetSeed(url) {
	let fields = parseQueryString(url || window.location.search)
	return fields.seed
}

function prepareNextSeed(link, rnd) {
    let seed = (rnd ? rnd() : Math.random()).toString()
	if(link) link.href = URLSetSeed(seed)
    return seed;
}

function loadExercisePage(initialize) {
	setTheme()
	const fields = parseQueryString(window.location.search)
	if(fields.seed == null) {
		fields.seed = prepareNextSeed()
		window.history.replaceState(null, '', URLSetSeed(fields.seed))
	}

	const another = document.getElementById('new')
	function generateExercise(generate, options, jig) {
		const rnd = new_rng(URLGetSeed())
		prepareNextSeed(another, rnd)
		return setExercise2(generate(rnd, options), options, jig)
	}

	const pg = initialize(fields)
	pg.options = {...fields, ...pg.options}
	pg.options.hintObj = initializeHints(fields.hints, fields.floatingHints)
	const jig = generateExercise(pg.generate, pg.options)

	another.addEventListener('click', function(evt) {
		evt.preventDefault()
		window.history.pushState(null, '', evt.target.href)
		generateExercise(pg.generate, pg.options, jig)
	})
	window.addEventListener('popstate', function(evt) {
		generateExercise(pg.generate, pg.options, jig)
	})
	return jig
}

function storageAvailable(type) {
    var storage;
    try {
        storage = window[type];
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}

function setTheme() {
	if(storageAvailable('localStorage')) {
		if(localStorage.theme == null) {
			document.body.removeAttribute('data-theme')
		} else {
			document.body.setAttribute('data-theme', localStorage.theme)
		}
	}
}
function loadSetting(elementID,settingName) {
	const element = document.getElementById(elementID)
	if(element && element.nodeName === "INPUT" && element.type === "checkbox") {
		if(localStorage[settingName] != null) {
			element.checked = JSON.parse(localStorage[settingName])
		}
		element.addEventListener("input", function(evt) {
			localStorage[settingName] = !!element.checked
		})
	}
}

function loadSettings() {
	if(!storageAvailable('localStorage')) return

	// Theme
	if(localStorage.theme == null) {
		document.body.removeAttribute('data-theme')
	} else {
		document.body.setAttribute('data-theme', localStorage.theme)
	}

	// Hints
	const hints = document.getElementsByName('hints');
	for(const hint of hints) {
		hint.addEventListener('click', function(e) {
			localStorage.hints = e.target.value
		})
		if(localStorage.hints === hint.value) hint.checked = true
	}

	loadSetting("live_wpm","live_wpm");
	loadSetting("show_timer", "show_timer");
	loadSetting("show_stats", "show_stats")

	// CPM
	const cpm = document.getElementById('cpm')
	if(cpm && cpm.nodeName === 'INPUT' && cpm.type === 'checkbox') {
		if(localStorage.cpm != null) {
			cpm.checked = JSON.parse(localStorage.cpm)
		}
		cpm.addEventListener('input', function(evt) {
			localStorage.cpm = !!cpm.checked
		})
	}

	// WPM
	const wpm = document.getElementById('wpm')
	if(wpm && wpm.nodeName === 'INPUT' && wpm.type === 'number') {
		if(localStorage.wpm != null) wpm.value = localStorage.wpm
		wpm.addEventListener('input', function(evt) {
			localStorage.wpm = wpm.value
		})
	}

	// ALTERNATE
	const alt = document.getElementById('alternate')
	if(alt && alt.nodeName === 'INPUT' && alt.type === 'text') {
		if(localStorage.alternate != null) alt.value = localStorage.alternate
		alt.addEventListener('input', function(evt) {
			localStorage.alternate = alt.value
		})
	}
}

/**
 * Update a URL parameter and return the new URL.
 * Note that if handling anchors is needed in the future,
 * this function will need to be extended. See the link below.
 *
 * http://stackoverflow.com/a/10997390/11236
 */
function updateURLParameter(url, param, paramVal){
    var newAdditionalURL = "";
    var tempArray = url.split("?");
    var baseURL = tempArray[0];
    var additionalURL = tempArray[1];
    var temp = "";
    if (additionalURL) {
        tempArray = additionalURL.split("&");
        for (var i=0; i<tempArray.length; i++){
            if(tempArray[i].split('=')[0] != param){
                newAdditionalURL += temp + tempArray[i];
                temp = "&";
            }
        }
    }

    var rows_txt = temp + "" + param + "=" + paramVal;
    return baseURL + "?" + newAdditionalURL + (paramVal==null?'':rows_txt);
}

function displayOnly(show) {
	const tabs = ['form', 'lesson']
	for (const tab of tabs) {
		const displayType = tab === 'lesson' ? 'flex' : 'block';
		document.getElementById(tab).style.display = tab === show ? displayType : 'none'
	}
}

// ---------------------------------------------------------------------
// Add attributes, properties, and children to a DOM node
// (possibly creating it first).
// args:
//     target: an Element or a tag name (e.g. "div")
//     then optional in any order (type determines function)
//         Element: child
//         string: text node child
//         array: values are treated as args
//         null/undefined: ignored
//         object: set attributes and properties of `target`.
//             string: set attribute
//             array: set property to array[0]
//             object: set property properties. example: N('span', {style: {color: 'red'}})
//             function: add event listener.

function N(target, ...args) {
	const el = typeof target === 'string' ?
		document.createElement(target) : target;
	for(const arg of args) {
		if(arg instanceof Element || arg instanceof Text) {
			el.appendChild(arg);
		} else if(Array.isArray(arg)) {
			N(el, ...arg);
		} else if(typeof arg === 'string') {
			el.appendChild(document.createTextNode(arg));
		} else if(arg instanceof Object) {
			for(const k in arg) {
				const v = arg[k];
				if(Array.isArray(v)) {
					el[k] = v[0];
				} else if(v instanceof Function) {
					el.addEventListener(k, v)
				} else if(v instanceof Object) {
					for(const vk in v) el[k][vk] = v[vk];
				} else {
					el.setAttribute(k, v);
				}
			}
		}
	}
	return el;
}

function hiddenField(form, name, value) {
	if(value === '') return
	if(form.elements[name]) form.elements[name].value = value
	else N(form, N('input', {type: 'hidden', name: name, value: value}))
}

function tokenize(string, parsed) {
	parsed ||= {}
	parsed.tokens ||= []
	parsed.spaceBefore ||= ''
	parsed.string ||= ''
	if(parsed.spaceBefore === '' && parsed.string != '' && !/^(\s|$)/.test(string)) {
		parsed.spaceBefore = ' '
	}
	parsed.string += parsed.spaceBefore + string

	const addToken = t => {
		parsed.tokens.push({text: t, spaceBefore: parsed.spaceBefore})
		parsed.spaceBefore = ''
	}

	const isWhite = /^\s+$/
	const isSteno = /^S?T?K?P?W?H?R?(A?O?\*?E?U?|-)F?R?P?B?L?G?T?S?D?Z?$/
	const wsWords = /\S+|\s+/g
	const pWords = /(\p{Punctuation}|(?:\P{Punctuation}|')+)/gu
	const words = string.match(wsWords) || []
	for(const word of words) {
		if(isWhite.test(word)) parsed.spaceBefore += word
		else if(parsed.wsOnly || tokenize.keepWhole.has(word)) addToken(word)
		else if(isSteno.test(word)) addToken(word)
		else word.match(pWords).forEach(addToken)
	}

	return parsed
}

tokenize.keepWhole = new Set(["Mr.", "Mrs.", "Dr."])

function yyyy_mm_dd(now) {
	if(now == null) now = new Date()
	const yyyy = now.getFullYear()
	const mm = (1+now.getMonth()+'').padStart(2, '0')
	const dd = (now.getDate()+'').padStart(2, '0')
	return yyyy+'_'+mm+'_'+dd
}

function recordExercise(store, strokes, stats) {
	try {
		let n = +(store.count || 0)
		const loc = window.location
		const file = loc.pathname.replace(/^.*\//, '')
		const args = loc.search
		store[n] = JSON.stringify({
			time: Date.now(),
			title: document.getElementById('lesson-name').textContent,
			location: file+args,
			strokes: strokes,
			stats: stats
		})
		store.count = n+1
	} catch(e) { return false }
	return true
}

function clearExercises(store) {
	const n = +(store.count || 0)
	for(let i=0; i<n; ++i) store.removeItem(i)
	store.removeItem('count')
}

function linkExercises(store, parentElement) {
	const n = +(store.count || 0)
	const exercises = []
	for(let i=0; i<n; ++i) exercises.push(JSON.parse(store[i]))
	const data = encodeURIComponent(JSON.stringify(exercises))
	const url = 'data:application/json,'+data
	const name = 'Download steno_jig_'+yyyy_mm_dd()+'.json'
	N(parentElement, '\n[', N('a', name, {
		href: url, download: name
	}), '] [', N('a', 'Clear Stats', {
		href: '#',
		click: evt => {
			evt.preventDefault()
			clearExercises(store)
		}
	}), ']')
}

function listExercises(store, parentElement) {
	const n = +(store.count || 0)
	if(n === 0) return
	const list = N('ul')
	const loc = window.location
	const thisfile = loc.pathname.replace(/^.*\//, '')
	const extra = loc.search.length + thisfile.length
	const baseurl = loc.href.substr(0, loc.href.length - extra)
	N(parentElement, N('h3', "Recorded Exercises"))
	for(let i=0; i<n; ++i) {
		const ex = JSON.parse(store[i])
		const item = N('li', N('a',
			ex.title, {href: baseurl+ex.location}
		), ': '+(new Date(ex.time)))
		N(list, item)
	}
	N(parentElement, list)
}

function renderChart(strokes, elt) {
	const msTotal = strokes[strokes.length-1][0]
	const msStrokeAvg = strokes.length === 0 ? 250 : msTotal/(strokes.length-1)
	strokes.forEach((x,i,a) =>
		a[i].dt = a[i][0] - (a[i-1]||[-msStrokeAvg])[0])

	smoothed = movingAvg(strokes)
	const lo = smoothed.reduce((a,b) => Math.min(a,b.y), 0)
	const hi = smoothed.reduce((a,b) => Math.max(a,b.y), 0)
	const actualRange = hi - lo
	const margin = 0.07 * actualRange
	const minWPM = Math.round(Math.max(0, lo - margin))
	const maxWPM = Math.round(hi + margin)
	momentary = strokes.map(s => {
		return { x: s[0]/1000, y: 1000/s.dt, delta: changeToString(...s) }
	})

	const colors = document.body.getAttribute('data-theme') === 'dark' ? {
		words: '#cc5',
		strokes: '#242',
		strokesHover: '#aa4'
	} : {
		words: '#000',
		strokes: '#accae8',
		strokesHover: '#000'
	}

	const data = {
		datasets: [
			{
				data: smoothed,
				fill: false,
				showLine: true,
				borderColor: colors.words,
				backgroundColor: colors.words,
				pointRadius: 0,
				pointHoverRadius: 0,
				tension: 0.4,
				yAxisID: 'wpm',
			},
			{
				data: momentary,
				fill: true,
				backgroundColor: colors.strokes,
				borderWidth: 0,
				pointRadius: 0,
				pointHoverBorderColor: colors.strokesHover,
				yAxisID: 'sps',
			}
		],
	}

	const round05 = x => (Math.round(x/0.05)*0.05).toFixed(2)

	const config = {
		type: "scatter",
		data: data,
		options: {
			animation: false,
			responsive: false,
			interaction: {
				includeInvisible: true,
				intersect: false,
				axis: 'x',
				mode: 'nearest',
			},
			plugins: {
				legend: {display: false},
				tooltip: {
					callbacks: {
						title: item => item[1] && item[1].raw.delta,
						label: item => item.datasetIndex === 1 ?
							round05(item.raw.y)+' strokes/second' :
							Math.round(item.raw.y)+' wpm'
					}
				}
			},
			scales: {
				x: {
					min: 0, max: msTotal/1000,
					ticks: {
						stepSize: 5,
						callback: (s,i,a) => msToString(s*1000)
					}
				},
				wpm: {
					type: 'linear', position: 'left',
					min: minWPM, max: maxWPM
				},
				sps: {
					type: 'linear', position: 'right',
					// average stroke in the middle of the graph
					min: 0, max: 2 * 1000/msStrokeAvg,
					grid: {drawOnChartArea: false}
				},
			},
			responsive: true,
			maintainAspectRatio: false,
		}
	}

	const outer = N('div', {
		id: 'chart', style: {position: 'relative', overflow: 'auto'},
	}, N('div', N('canvas'), {style: {position: 'absolute'}}))
	N(elt, outer)
	const inner = outer.firstElementChild
	const canvas = inner.firstElementChild
	const containerWidth = outer.parentNode.clientWidth
	outer.style.width = containerWidth+'px'
	const width = Math.max(containerWidth, msTotal/75)
	inner.style.width = width+'px'; inner.style.height = 300+'px'
	outer.style.height = (width<containerWidth ? 300 : 325)+'px'
	return new Chart(canvas.getContext('2d'), config)
}

function renderResults(stats, strokes, elt, jig) {
	var results = 'Time: ' + stats.time + ' - ' + Math.floor(stats.WPM)
	if(stats.unit) {
		results += ' ' + stats.unit
	} else {
		var plural = stats.errorCount===1 ? '' : 's'
		results += ' WPM (chars per minute/5)'
		if(stats.errorCount === 0) results += ' with no uncorrected errors!'
		else results += ', adjusting for ' + stats.errorCount + ' incorrect word' + plural
			+ ' (' + Math.floor(100*stats.accuracy) + '%) gives ' + Math.floor(stats.correctedWPM) + ' WPM.'

		results = strokeStats(strokes, stats.minutes) + '\n' + results
	}
	results = '\n' + results
	var start = elt.textContent.length
	var end = start + results.length
	elt.textContent += results

	N(elt, N('h3', 'Corrected errors'))
	errorsInContext(strokes, 2).forEach(s => {
		renderStrokes(s, elt)
		N(elt, N('hr'))
	})
	N(elt, "\n")

	const chart = renderChart(strokes, elt)

	elt.scrollIntoView(true)

	return chart
}
