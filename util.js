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
	back.href = document.location.href.split('?')[0];
	var again = document.getElementById('again');
	again.href = document.location.href;

	return jig = new TypeJig(exercise, 'exercise', 'input', 'clock', hints);
}

