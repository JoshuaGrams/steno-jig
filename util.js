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
	console.log('options:', options)
	var h = document.getElementById('lesson-name');
	h.textContent = name;
	document.title = name + ' - Steno Jig';

	var back = document.getElementById('back');
	back.href = document.location.href.replace(/\?.*$/, '').replace(/\/[^\/]*$/,'') + '/' + (options.menu || 'form') + '.html';
	var again = document.getElementById('again');
	again.href = document.location.href;

	if(jig != null) jig.exercise = exercise;
	else jig = new TypeJig(exercise, 'exercise', 'results', 'input', 'clock', hints, options);
	window.setTimeout(function(){jig.reset()}, 0)
	return jig
}

function prepareNextSeed(another) {
    let anotherSeed = Math.random().toString();
    another.href = document.location.href.toString().replace(/seed=([^&#]*)/, 'seed=' + anotherSeed);
    return anotherSeed;
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

function loadSettings() {
	if(!storageAvailable('localStorage')) return

	// Theme
	if(localStorage.theme == null) {
		document.body.removeAttribute('data-theme')
	} else {
		document.body.setAttribute('data-theme', localStorage.theme)
	}

	// Hints
	const hints = document.getElementById('hints')
	if(hints && hints.nodeName === 'INPUT' && hints.type === 'checkbox') {
		if(localStorage.hints != null) {
			hints.checked = JSON.parse(localStorage.hints)
		}
		hints.addEventListener('input', function(evt) {
			localStorage.hints = !!hints.checked
		})
	}

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

