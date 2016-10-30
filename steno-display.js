// Display keys for arbitrary steno stroke sequences.

// To use, simply create a new StenoDisply for your container
// element (can pass element id name or the element itself) and
// then call the set method with the steno or pseudo-steno string
// (strokes separated by slashes).
//
// It needs a bunch of help from styles: see the `#stroke` entries
// in `style.css`.


function StenoDisplay(container, translations, showEmpty) {
	if(typeof(container) === 'string') {
		container = document.getElementById(container);
	}
	this.container = container;
	this.strokes = [];
	this.pseudoStenoFor = translations;
	this.lastText = false;
	this.showEmpty = showEmpty;
	this.errorLog = document.getElementById('error-log');
}

StenoDisplay.prototype.update = function(text, showEmpty) {
	if(text !== this.lastText) {
		this.lastText = text;
		if(typeof showEmpty === 'undefined') showEmpty = this.showEmpty;
		this.set(this.pseudoStenoFor[text] || '', showEmpty);
		if(this.errorLog && !this.pseudoStenoFor[text]) {
			this.errorLog.innerHTML += 'No strokes for: ' + text + '<br>';
		}
	}
}

StenoDisplay.prototype.set = function(pseudoSteno, showEmpty) {
	for(i=0; i<this.strokes.length; ++i) {
		this.strokes[i].hide();
	}
	if(pseudoSteno !== '' || showEmpty) {
		var i0 = 0;

		if(typeof pseudoSteno === 'string') pseudoSteno = [pseudoSteno];
		for(var j=0; j<pseudoSteno.length; ++j) {
			var separator = i0 ? ' or ' : false;
			i0 += this.showTranslation(pseudoSteno[j], i0, separator);
		}
	}
}

StenoDisplay.prototype.showTranslation = function(pseudoSteno, i0, separator) {
	var strokes = pseudoSteno.split('/');
	for(i=0; i<strokes.length; ++i) {
		if(i+i0 >= this.strokes.length) {
			this.strokes.push(new StenoDisplay.Stroke(this.container));
		}
		this.strokes[i+i0].set(strokes[i], separator);
		this.strokes[i+i0].show();
		separator = '/';
	}
	return strokes.length;
}


// ---------------------------------------------------------------------

StenoDisplay.Stroke = function(container) {
	this.separator = document.createElement('span');
	this.separator.appendChild(document.createTextNode('/'));
	this.separator.className = 'big-slash';
	container.appendChild(this.separator);
	this.keys = document.createElement('table');
	var upper = document.createElement('tr');
	var lower = document.createElement('tr');
	var vowel = document.createElement('tr');
	this.keys.appendChild(upper);
	this.keys.appendChild(lower);
	this.keys.appendChild(vowel);
	var upperKeys = ['S', 'T', 'P', 'H', '*', 'F', 'P', 'L', 'T', 'D'];
	var lowerKeys =      ['K', 'W', 'R',      'R', 'B', 'G', 'S', 'Z'];
	var vowelKeys = ['', 'A', 'O', '', 'E', 'U'];
	var upperCells = addCells(upper, upperKeys);
	var lowerCells = addCells(lower, lowerKeys);
	var vowelCells = addCells(vowel, vowelKeys);

	upperCells[0].rowSpan = 2;
	upperCells[4].rowSpan = 2;

	upperCells[4].className = 'alt wide';
	upperCells[9].className = 'alt';
	lowerCells[7].className = 'alt';

	vowelCells[0].colSpan = 2;
	vowelCells[1].className = 'leftVowel';
	vowelCells[2].className = 'leftVowel';
	vowelCells[4].className = 'rightVowel';
	vowelCells[5].className = 'rightVowel';

	container.appendChild(this.keys);

	this.leftCells = {
		S: upperCells[0], T: upperCells[1], P: upperCells[2], H: upperCells[3],
		                  K: lowerCells[0], W: lowerCells[1], R: lowerCells[2]
	};
	this.rightCells = {
		'*': upperCells[4], F: upperCells[5], P: upperCells[6], L: upperCells[7], T: upperCells[8], D: upperCells[9],
		R: lowerCells[3], B: lowerCells[4], G: lowerCells[5], S: lowerCells[6], Z: lowerCells[7]
	};
	this.vowelCells = {
		A: vowelCells[1], O: vowelCells[2], '*': upperCells[4], E: vowelCells[4], U: vowelCells[5]
	};
}

StenoDisplay.Stroke.prototype.hide = function() {
	if(this.separator) addClass(this.separator, 'hide');
	addClass(this.keys, 'hide');
}

StenoDisplay.Stroke.prototype.show = function() {
	if(this.separator) removeClass(this.separator, 'hide');
	removeClass(this.keys, 'hide');
}

StenoDisplay.Stroke.prototype.clear = function() {
	removeClassFromAllPropertiesOf(this.leftCells, 'pressed');
	removeClassFromAllPropertiesOf(this.rightCells, 'pressed');
	removeClassFromAllPropertiesOf(this.vowelCells, 'pressed');
}

StenoDisplay.Stroke.prototype.set = function(stroke, separator) {
	this.clear();
	this.separator.firstChild.nodeValue = separator || '';
	var steno = pseudoStrokeToSteno(stroke);
	var left = steno[0], vowel = steno[1], right = steno[2];
	for(var i=0; i<left.length; ++i) {
		addClass(this.leftCells[left.charAt(i)], 'pressed');
	}
	for(var i=0; i<right.length; ++i) {
		addClass(this.rightCells[right.charAt(i)], 'pressed');
	}
	for(var i=0; i<vowel.length; ++i) {
		addClass(this.vowelCells[vowel.charAt(i)], 'pressed');
	}
}

function addCells(row, contents) {
	cells = [];
	for(var i=0; i<contents.length; ++i) {
		var td = document.createElement('td');
		if(contents.length) {
			td.appendChild(document.createTextNode(contents[i]));
		}
		row.appendChild(td);
		cells.push(td);
	}
	return cells;
}

function addClass(elt, className) {
	if(elt) elt.className += ' ' + className;
}

function removeClass(elt, className) {
	var regex = new RegExp('(^|\\s)' + className + '\\b', 'g');
	var other = elt.className.replace(regex, '');
	elt.className = other;
}

function removeClassFromAllPropertiesOf(obj, className) {
	for(var key in obj) {
		if(Object.prototype.hasOwnProperty.call(obj, key)) {
			removeClass(obj[key], className);
		}
	}
}


// ---------------------------------------------------------------------

var leftFromPseudo = {
	'C': 'K',
	'D': 'TK', 'B': 'PW', 'L': 'HR',
	'F': 'TP', 'M': 'PH', 'N': 'TPH',
	'Q': 'KW', 'Y': 'KWR', 'J': 'SKWR', 'V': 'SR',
	'G': 'TKPW', 'X': 'KP', 'Z': 'STKPW'
};
var vowelFromPseudo = {
	'AY': 'AEU', 'OH': 'OE', 'EE': 'AOE', 'UU': 'AOU',
	'I': 'EU', 'IE': 'AOEU',
	'AW': 'AU', 'OW': 'OU', 'OI': 'OEU',
	'EA': 'AE', 'OA': 'AO', 'OO': 'AO'
};
var rightFromPseudo = {
	'TH': '*T', 'CH': 'FP', 'SH': 'RB', 'RCH': 'FRPB',
	'N': 'PB', 'NG': 'PBG', 'NK': 'PBG',
	'M': 'PL', 'K': 'BG', 'SHN': 'GS', 'KSHN': 'BGS',
	'J': 'PBLG', 'RBGS': 'RBGS'
};
var left_re = /C|L|G|Z|N|J|X|B|V|F|Y|Q|D|M|0|1|2|3|4|5|6|7|8|9|S|T|K|P|W|H|R/g;
var vowel_re = /AY|OA|OO|AW|EA|EE|OH|UU|OI|IE|OW|I|0|1|2|3|4|5|6|7|8|9|A|O|E|U/g;
var right_re = /RBGS|KSHN|SHN|RCH|CH|SH|NG|NK|TH|K|J|N|M|0|1|2|3|4|5|6|7|8|9|\*|F|R|P|B|L|G|T|S|D|Z/g;
var separation_re = /([^AOEUI*-]*)([AO*EUI-][AO*EUIHYW-]*|)(.*)/;

function pseudoStrokeToSteno(stroke) {
	match = separation_re.exec(stroke);
	var b = match[1], v = match[2], e = match[3];
	var left = b.replace(left_re, function(m) { return leftFromPseudo[m] || m; });
	var vowel = v.replace(vowel_re, function(m) { return vowelFromPseudo[m] || m; });
	var right = e.replace(right_re, function(m) { return rightFromPseudo[m] || m; });
	return [left, vowel, right];
}
