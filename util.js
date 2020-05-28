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


function setExercise(name, exercise, hints) {
	var h = document.getElementById('lesson-name');
	h.appendChild(document.createTextNode(name));
	document.title = name + ' - ' + document.title;

	var back = document.getElementById('back');
	back.href = document.location.href.replace(/\?.*$/, '');
	var again = document.getElementById('again');
	again.href = document.location.href;

	return jig = new TypeJig(exercise, 'exercise', 'results', 'input', 'clock', hints);
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
    return baseURL + "?" + newAdditionalURL + rows_txt;
}
