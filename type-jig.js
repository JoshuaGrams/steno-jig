/* -----------------------------------------------------------------------
 * TypeJig - run a typing lesson.
 *
 * `output`, `input`, and `clock` are elements (or element ID strings),
 * `exercise` is a TypeJig.Exercise object.
 */

function TypeJig(exercise, output, input, clock, hint) {
	if(typeof output === 'string') output = document.getElementById(output);
	if(typeof input === 'string') input = document.getElementById(input);
	if(typeof clock === 'string') clock = document.getElementById(clock);
	this.running = false;
	this.haveFinalWord = false;
	this.ex = exercise;
	this.out = new ScrollBox(output, input);
	this.ans = input;
	this.clock = new TypeJig.Timer(clock, this.ex.seconds);
	this.hint = hint;
	this.lookahead = [];
	this.errors = {};  this.errorCount = 0;
	this.getWords();
	if(this.hint && this.hint.update) this.hint.update(this.lookahead[0] || '');
	this.scrollTo = this.out.firstChild;
	bindEvent(input, 'input', this.answerChanged.bind(this));
	bindEvent(input, 'keydown', this.keyDown.bind(this));
	input.focus();
	window.scroll(0, scrollOffset(output));
}

// Can contain a text-to-pseudosteno dictionary for each steno theory.
// Pseudosteno can be a single string or an array of strings, with
// longest entries first and shortest briefs last.
TypeJig.Translations = {};

TypeJig.processTranslations = function(t, fn) {
	var out = {};
	var has = Object.prototype.hasOwnProperty;
	for(var text in t) if(has.call(t, text)) {
		out[text] = fn(t[text], text);
	}
	return out;
}

TypeJig.longestTranslations = function(t) {
	return TypeJig.processTranslations(t, function(steno, text) {
		return (steno instanceof Array) ? steno[0] : steno;
	});
}

TypeJig.shortestTranslations = function(t) {
	return TypeJig.processTranslations(t, function(steno, text) {
		return (steno instanceof Array) ? steno[steno.length-1] : steno;
	});
}

// Arrays of strings (or of arrays of strings).
TypeJig.WordSets = {};
TypeJig.flattenWordSet = function(a) {
    out = [];
    for(var i=0; i<a.length; ++i) out.push.apply(out, a[i]);
    return out;
}

TypeJig.prototype.answerChanged = function() {
	if(!this.start) {
		this.clock.start(this.endExercise.bind(this));
		this.start = Date.now();
		this.droppedChars = 0;
		this.nextWordIndex = 0;
		this.running = true;
	}

	// Get the string and split it into words.
	var answerString = this.ans.textContent;
	var answer = answerString.split(/\s+/);
	if(answer[0] === '') answer.shift();

	// Match up answer words against exercise words, and set the class
	// of the output span.
	this.getWords(answer.length);  // Try to get enough words to match.
	var out = this.scrollTo;
	var n = this.lookahead.length;
	for(var i=0; i<n; ++i) {
		var ex = String(this.lookahead[i]);
		var ans = answer[i];
		var validPrefix = false;
		if(i === answer.length-1 && ans.length < ex.length) {
			validPrefix = (ans === ex.slice(0, ans.length));
		}

		if(i >= answer.length || validPrefix) {
			// un-mark unanswered or incompletely-answered words
			if(hasClass(out, 'incorrect')) this.removeError(ex);
			out.className = '';
		} else if(ans === ex) {
			// mark correct words
			if(hasClass(out, 'incorrect')) this.removeError(ex);
			out.className = 'correct';
		} else {
			// otherwise it must be incorrect
			if(!hasClass(out, 'incorrect')) {
				this.addError(ex, ans);
				out.className = 'incorrect';
			}
		}
		if(out) out = out.nextSibling;
	}

	// Are we finished with the exercise (is the final word correct)?
	var m = answer.length - 1;
	var lastAnsweredCorrect = (answer[m] === String(this.lookahead[m]));
	var allAnswered = (answer.length >= this.lookahead.length);
	if(this.haveFinalWord && lastAnsweredCorrect && allAnswered) {
		this.clock.stop();
		return;
	}
	
	// Now that we know words are appropriately marked, shift some off
	// the beginning if our input is getting too long.
	var limit = this.ex.inputLength;
	if(limit === undefined) limit = 30;
	if(answerString.length > limit) {
		// Save the old length (so we can tell how much we dropped) and
		// the selection.
		var oldLen = answerString.length;
		var sel = saveSelection(this.ans);
		// Drop words until we're under the limit.
		while(answerString.length > limit) {
			var newAnswer = answerString.replace(/^\s*[\S]+(\s|$)+/, '');
			answerString = newAnswer;
			this.scrollTo = this.scrollTo.nextSibling;
			answer.shift();
			this.lookahead.shift();
		}
		// Set the new text and restore the (adjusted) selection.
		this.ans.firstChild.nodeValue = answerString;
		var dropped = oldLen - answerString.length;
		this.droppedChars += dropped;
		sel.start -= dropped;
		sel.end -= dropped;
		restoreSelection(this.ans, sel);
		// Update the output scrolling.
		this.out.scrollTo(this.scrollTo);
	}

	this.nextWordIndex = Math.max(0, answer.length - (lastAnsweredCorrect ? 0 : 1));
	if(this.hint && this.hint.update) {
		this.hint.update(this.lookahead[this.nextWordIndex]);
	}
}

TypeJig.prototype.keyDown = function (e) {
    var id;
    switch (e.key) {
        case "Enter":
            id = "again";
            break;
        case "ArrowLeft":
            id = "back";
            break;
        case "ArrowRight":
            id = "new";
            break;
    }
    if (id) {
        var link = document.getElementById(id);
        if (link) {
            link.click();
        }
    }
};

// Ensure that `words` (and `out`) contain at least `n` words (unless
// we're at the end of the exercise).
TypeJig.prototype.getWords = function(n) {
	if(n === undefined) n = 1; else n = Math.max(n, 1);
	n -= this.lookahead.length;

	// count chars already in lookahead
	var charCount = 0;
	for(var i=0; i<this.lookahead.length; ++i) {
		charCount += this.lookahead[i].length + (charCount ? 1 : 0);
	}

	while(n-- > 0 || charCount < this.ex.lookahead) {
		var word = this.ex.nextWord();
		if(word === false) { this.haveFinalWord = true;  break; }
		charCount += word.length + (charCount ? 1 : 0);
		this.lookahead.push(word);
		var text = document.createTextNode(' ' + word);
		var span = document.createElement('span');
		span.appendChild(text);
		this.out.content.appendChild(span);
	}
	if(!this.scrollTo) this.scrollTo = this.out.content.firstChild;
}

// This is only called if the word is marked as an error, so it doesn't
// need to check whether the error is present.
TypeJig.prototype.removeError = function(word, error) {
	this.errorCount--;
}

TypeJig.prototype.addError = function(word, error) {
	this.errorCount++;
	if(this.errors.hasOwnProperty(word)) {
		var e = this.errors[word];
		if(e.indexOf(error) !== -1) e.push(error);
	} else this.errors[word] = [error];
}

TypeJig.prototype.endExercise = function(seconds) {
	if(this.running) this.running = false;
	else return;
	if(document.activeElement != document.body) document.activeElement.blur();
	this.ans.setAttribute('contenteditable', false);
	this.ans.className = '';

	var minutes = seconds / 60;  // KEEP fractional part for WPM calculation!
	seconds = Math.floor(seconds % 60);
	if(seconds < 10) seconds = '0' + seconds;
	var time = Math.floor(minutes) + ':' + seconds;

	var charsTyped = this.droppedChars + this.ans.textContent.length;
	var standardWords = charsTyped / 5;
	var standardWPM = Math.floor(standardWords / minutes);
	var plural = this.errorCount===1 ? '' : 's';
	var accuracy = Math.floor(100 * (1 - this.errorCount / standardWords));
	var correctedWPM = Math.round(standardWPM - (this.errorCount / minutes));
	var results = 'Time: ' + time + ' -  ' + standardWPM + ' WPM (CPM/5)';
	if(this.errorCount === 0) results += ' with no uncorrected errors!';
	else results += ', adjusting for ' + this.errorCount + ' incorrect word' + plural
		+ ' (' + accuracy + '%) gives ' + correctedWPM + ' WPM.'
	this.ans.firstChild.nodeValue = results;
}


/* -----------------------------------------------------------------------
 * ScrollBox - scroll a single line of words to the left.
 *
 * Create a `div` with `overflow: hidden` and put the exercise content
 * in another block-level element inside that.  Below (or above) that,
 * create an input element and give it a large left margin so some of
 * the already-typed exercise text has room to the left.
 *
 * Break your exercise content into spans (with no whitespace in
 * between).  Then call the `scrollTo(element, instantly)` method to
 * scroll the given element so that it lines up with the beginning of
 * the input field.
 */

function ScrollBox(contentElt, alignToElt) {
	this.content = contentElt;
	if(alignToElt) {
		var style = window.getComputedStyle(alignToElt, null);
		this.offset = parseFloat(style.getPropertyValue('margin-left'));
	} else this.offset = 0;
	this.margin = this.offset;
	this.content.style.marginLeft = this.offset + 'px';
	this.transition = null
	this.removeCount = 0;
	this.removeWidth = 0;

	bindEvent(this.content, 'transitionend', this.endTransition.bind(this));
	bindEvent(alignToElt, 'focus', function(evt) {
		var prompts = this.querySelectorAll('.prompt');
		for(var i=0; i<prompts.length; ++i) this.removeChild(prompts[i]);
	});
}

ScrollBox.prototype.endTransition = function() {
	this.transition = null
	this.content.style.transition = '';
	if(this.removeCount > 0) {
		do {
			this.content.removeChild(this.content.firstChild);
		} while(--this.removeCount > 0);
		this.margin += this.removeWidth;
		this.removeWidth = 0;
		this.content.style.marginLeft = this.margin + 'px';
	}
}

ScrollBox.prototype.scrollTo = function(elt, instantly) {
	var curStyle = window.getComputedStyle(this.content);
	var oldMargin = parseFloat(curStyle.getPropertyValue('margin-left'));
	this.removeCount = 0;
	this.removeWidth = 0;
	this.margin = this.offset;
	if(elt) {
		while((elt = elt.previousSibling)) {
			if(this.margin < 0) {
				this.removeCount++;
				this.removeWidth += elt.offsetWidth;
			}
			this.margin -= elt.offsetWidth;
		}
	}
	var bezierStep = function (points, time) {
		var ret = [], i
		for (i = 0; i < points.length - 1; ++i) {
			ret.push([
				// a + (b - a) * time
				points[i][0] + time * (points[i + 1][0] - points[i][0]),
				points[i][1] + time * (points[i + 1][1] - points[i][1]),
			])
		}
		if (ret.length === 1) {
			return ret[0]
		}
		return bezierStep(ret, time)
	}
	var bezier = function (args, time) {
		return bezierStep([
			[0, 0],
			[args[0], args[1]],
			[args[2], args[3]],
			[1, 1],
		], time)
	}
	var bezierSpeed = function (transition, position) {
		var px = Math.abs(transition.end - transition.start)
		var i
		var less = 0
		var more = 1
		var cur = 0.5
		var lessPos = 0
		var morePos = 1
		var curPos

		if (position == transition.start) {
			cur = 0
		} else if (position == transition.end) {
			cur = 1
		} else {
			// translate into 0-1 range
			position = (position - transition.start) / (transition.end - transition.start) 
			// find two points very near position on either side
			for (let i = 0; i < 6; ++i) {
				if ((curPos = bezier(transition.bezier, cur)[1]) < position) {
					less = cur
					lessPos = curPos
					cur += (more - cur) / 2
				} else {
					more = cur
					morePos = curPos
					cur -= (cur - less) / 2
				}
			}
			// linear interpolate between those points
			cur = less + (more - less) * (position - lessPos) / (morePos - lessPos)
		}
		// choose points very (and equally) near but not past the ends
		if (cur < 0.0005001) {
			less = 0
			more = 0.0005001
		} else if (cur > 0.9994999) {
			less = 0.9994999
			more = 1
		} else {
			less = cur - 0.0005
			more = cur + 0.0005
		}
		var lessXY = bezier(transition.bezier, less)
		var moreXY = bezier(transition.bezier, more)
		return px * (moreXY[1] - lessXY[1]) / (moreXY[0] - lessXY[0])
	}

	var px = this.margin - oldMargin

	var style = this.content.style
	if(instantly) {
		this.transition = null;
		style.transition = ''
		style.marginLeft = this.margin + 'px'
	} else {
		// transition timing constants
		var duration = 4
		var startR = 0.3
		// Start the transition.
		if(Math.abs(px) > 0.1) {
			var currentSpeed, startTheta;
			if (this.transition != null) {
				currentSpeed = bezierSpeed(this.transition, oldMargin)
				// currentSpeed units: pixels per duration
				startTheta = Math.atan(currentSpeed / Math.abs(px))
				// advance one frame
				style.transition = ''
				style.marginLeft = oldMargin + (currentSpeed / duration / 60) + 'px'
			} else {
				currentSpeed = 0
				startTheta = 0
			}
			this.transition = {
				duration: duration,
				start: oldMargin,
				end: this.margin,
				distance: Math.abs(this.margin - oldMargin),
				bezier: [
					Math.cos(startTheta) * startR,
					Math.sin(startTheta) * startR,
					1 - startR,
					1,
				],
			}
			style.transition = trns = 'margin-left ' + duration + 's cubic-bezier(' +
				this.transition.bezier.join(', ') + ')'
			style.marginLeft = this.margin + 'px'
		} else {
			this.transition = null
		}
	}
}


// -----------------------------------------------------------------------
// Helper functions

isOwnPlural = { 'cod': true };

function pluralize(word) {
	if(isOwnPlural.hasOwnProperty(word)) return word;
	switch(word[word.length-1]) {
		case 's': return word + 'es';
		case 'y': return word.slice(0, -1) + 'ies';
		default: return word + 's';
	}
}

function bindEvent(elt, evt, fn) {
	if(elt.addEventListener) elt.addEventListener(evt, fn, false);
	else if(elt.attachEvent) elt.attachEvent('on'+evt, fn);
}

function scrollOffset(elt) {
	var offset = 0;
	if(elt.offsetParent) do {
		offset += elt.offsetTop;
	} while(elt = elt.offsetParent);
	return offset;
}

function hasClass(elt, className) {
	var re = new RegExp('(\s|^)' + className + '(\s|$)');
	return re.test(elt.className);
}

/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 */
function shuffle(a) {
    for (var i=a.length-1; i>=1; i--) {
        var j = Math.floor(Math.random() * (i+1));
        var a_i=a[i]; a[i]=a[j];  a[j]=a_i;
    }
    return a;
}

function randomIntLessThan(n) { return Math.floor(n * Math.random()) % n; }

function shuffleTail(a, n) {
	n = Math.min(n, a.length);
	var i = n, b = a.length - n;  // current and base indices
	while(--i > 0) {
		var other = randomIntLessThan(i+1);
		var t = a[i+b];  a[i+b] = a[other+b];  a[other+b] = t;
	}
}

function randomize(a) {
	shuffleTail(a, a.length);
	a.randomEltsUsed = 0;
}

// Rotate the first word out to the end of the array.
// If the array has been `randomize`d (has a `randomEltsUsed` property
// defined), shuffle the used words when more than 2/3 of them have been used,
// which ensures that the last word can't be shuffled to be the next one in the
// queue.
function rotateAndShuffle(a) {
	if(typeof(a.used) === 'undefined') a.used = 0;
	// don't shuffle if the current entry is multiple words
	else if (typeof a[0].i === 'undefined') {
		a.push(a.shift());
		a.used += 1;

		if(typeof(a.randomEltsUsed) === 'undefined') {
			if(a.used >= a.length) return false;
		} else {
			a.randomEltsUsed += 1;
			if(a.randomEltsUsed > 2/3 * a.length) {
				shuffleTail(a, a.randomEltsUsed);
				a.randomEltsUsed = 0;
			}
		}
	}
	return a[0];
}

// http://stackoverflow.com/a/13950376/2426692
var saveSelection, restoreSelection;

if (window.getSelection && document.createRange) {
    saveSelection = function(containerEl) {
        var range = window.getSelection().getRangeAt(0);
        var preSelectionRange = range.cloneRange();
        preSelectionRange.selectNodeContents(containerEl);
        preSelectionRange.setEnd(range.startContainer, range.startOffset);
        var start = preSelectionRange.toString().length;

        return {
            start: start,
            end: start + range.toString().length
        };
    };

    restoreSelection = function(containerEl, savedSel) {
        var charIndex = 0, range = document.createRange();
        range.setStart(containerEl, 0);
        range.collapse(true);
        var nodeStack = [containerEl], node, foundStart = false, stop = false;

        while (!stop && (node = nodeStack.pop())) {
            if (node.nodeType == 3) {
                var nextCharIndex = charIndex + node.length;
                if (!foundStart && savedSel.start >= charIndex && savedSel.start <= nextCharIndex) {
                    range.setStart(node, savedSel.start - charIndex);
                    foundStart = true;
                }
                if (foundStart && savedSel.end >= charIndex && savedSel.end <= nextCharIndex) {
                    range.setEnd(node, savedSel.end - charIndex);
                    stop = true;
                }
                charIndex = nextCharIndex;
            } else {
                var i = node.childNodes.length;
                while (i--) {
                    nodeStack.push(node.childNodes[i]);
                }
            }
        }

        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }
} else if (document.selection) {
    saveSelection = function(containerEl) {
        var selectedTextRange = document.selection.createRange();
        var preSelectionTextRange = document.body.createTextRange();
        preSelectionTextRange.moveToElementText(containerEl);
        preSelectionTextRange.setEndPoint("EndToStart", selectedTextRange);
        var start = preSelectionTextRange.text.length;

        return {
            start: start,
            end: start + selectedTextRange.text.length
        }
    };

    restoreSelection = function(containerEl, savedSel) {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(containerEl);
        textRange.collapse(true);
        textRange.moveEnd("character", savedSel.end);
        textRange.moveStart("character", savedSel.start);
        textRange.select();
    };
}

TypeJig.Timer = function(elt, seconds) {
	this.elt = elt;
	this.setting = seconds || 0;
	this.seconds = this.setting;
	this.fn = this.update.bind(this);
	this.showTime();
}

TypeJig.Timer.prototype.start = function(alarm) {
	this.finished = alarm;
	this.beginning = new Date().getTime();
	if(this.setting > 0) this.end = this.beginning + 1000 * this.setting;
	window.setTimeout(this.fn, 1000);
}

TypeJig.Timer.prototype.stop = function() {
	var elapsed = (new Date().getTime() - this.beginning) / 1000;
	if(this.finished) this.finished(elapsed);
	delete this.beginning;
	delete this.end;
}

TypeJig.Timer.prototype.update = function() {
	if(this.beginning) {
		var running = true;
		var ms, msTilNext, now = new Date().getTime();
		if(this.end) {
			ms = Math.max(0, this.end - now);
			msTilNext = ms % 1000;
			running = (ms !== 0);
		} else {
			ms = Math.max(0, now - this.beginning);
			msTilNext = 1000 - ms % 1000;
		}
		this.seconds = Math.round(ms/1000);
		this.showTime();

		if(running) window.setTimeout(this.fn, msTilNext);
		else this.stop();
	}
};

TypeJig.Timer.prototype.showTime = function() {
	if(!this.elt) return;
	var m = Math.floor(this.seconds / 60);
	var s = this.seconds % 60; if(s < 10) s = '0' + s;
	this.elt.innerHTML = m + ':' + s;
}



TypeJig.Exercise = function(words, seconds, shuffle, select) {
	this.words = words;
	this.seconds = seconds;
	this.shuffle = shuffle;
	this.select = TypeJig.Exercise.select[select]
		|| TypeJig.Exercise.select.random;

	if(shuffle) randomize(this.words);

	// Characters of the exercise to load ahead.
	this.lookahead = 150;
	// Characters of input to accumulate before shifting.
	this.inputLength = 20;
}

function indexInto(a) {
	if(typeof a.i === 'undefined') a.i = 0;
	var word = a[a.i];
	if(++a.i === a.length) delete a.i;
	return word;
}

TypeJig.Exercise.select = {
	random: function(a) { return a[randomIntLessThan(a.length)]; },
	first: function(a) { return a[0]; },
	ordered: indexInto,
	shuffled: function(a) {
		if(typeof a.i === 'undefined') randomize(a);
		return indexInto(a);
	}
};

TypeJig.Exercise.prototype.nextWord = function() {
	var word = rotateAndShuffle(this.words);
	if(word instanceof Array) return this.select(word);
	else return word;
}
