function StrokeDisplay(elt) {
	if(typeof(elt) === 'string') elt = document.getElementById(elt);
	this.stroke = new StrokeDisplay.Stroke();
	elt.appendChild(this.stroke.html);
}

StrokeDisplay.prototype.setStroke = function(stroke) {
	var steno = pseudoStrokeToSteno(stroke);
	var left = steno[0], vowel = steno[1], right = steno[2];
	removeClassFromAllPropertiesOf(this.stroke.leftCells, 'pressed');
	removeClassFromAllPropertiesOf(this.stroke.rightCells, 'pressed');
	removeClassFromAllPropertiesOf(this.stroke.vowelCells, 'pressed');
	for(var i=0; i<left.length; ++i) {
		addClass(this.stroke.leftCells[left.charAt(i)], 'pressed');
	}
	for(var i=0; i<right.length; ++i) {
		addClass(this.stroke.rightCells[right.charAt(i)], 'pressed');
	}
	for(var i=0; i<vowel.length; ++i) {
		addClass(this.stroke.vowelCells[vowel.charAt(i)], 'pressed');
	}
}

StrokeDisplay.Stroke = function() {
	var table = document.createElement('table');
	var upper = document.createElement('tr');
	var lower = document.createElement('tr');
	var vowel = document.createElement('tr');
	table.appendChild(upper);
	table.appendChild(lower);
	table.appendChild(vowel);
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
	this.html = table;
	this.leftCells = {
		S: upperCells[0], T: upperCells[1], P: upperCells[2], H: upperCells[3],
		                  K: lowerCells[0], W: lowerCells[1], R: lowerCells[2]
	};
	this.rightCells = {
		'*': upperCells[4], F: upperCells[5], P: upperCells[6], L: upperCells[7], T: upperCells[8], D: upperCells[9],
		R: lowerCells[3], B: lowerCells[4], G: lowerCells[5], S: lowerCells[6], Z: lowerCells[7]
	};
	this.vowelCells = {
		A: vowelCells[1], O: vowelCells[2], E: vowelCells[4], U: vowelCells[5]
	};
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

function addClass(elt, className) {
	if(elt) elt.className += ' ' + className;
}

var leftFromPseudo = {
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
var left_re = /L|G|Z|N|J|X|B|V|F|Y|Q|D|M|0|1|2|3|4|5|6|7|8|9|S|T|K|P|W|H|R/g;
var vowel_re = /AY|OA|AW|EA|EE|OH|UU|OI|IE|OW|I|0|1|2|3|4|5|6|7|8|9|A|O|E|U/g;
var right_re = /RBGS|KSHN|SHN|RCH|CH|SH|NG|NK|TH|K|J|N|M|0|1|2|3|4|5|6|7|8|9|\*|F|R|P|B|L|G|T|S|D|Z/g;
var separation_re = /([^AOEUI-]*)([AOEUI-][AOEUIHYW]*|)(.*)/;

function pseudoStrokeToSteno(stroke) {
	match = separation_re.exec(stroke);
	var b = match[1], v = match[2], e = match[3];
	var left = b.replace(left_re, function(m) { return leftFromPseudo[m] || m; });
	var vowel = v.replace(vowel_re, function(m) { return vowelFromPseudo[m] || m; });
	var right = e.replace(right_re, function(m) { return rightFromPseudo[m] || m; });
	return [left, vowel, right];
}
