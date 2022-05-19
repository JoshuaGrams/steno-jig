/* -----------------------------------------------------------------------
 * TypeJig - run a typing lesson.
 *
 * `exercise` is a TypeJig.Exercise object, while `display`, `input`,
 * `output`, and `clock` are elements (or element ID strings).
 */

function TypeJig(exercise, options) {
    this.exercise = exercise;

    this.display = documentElement("exercise");
    this.answerDisplay = documentElement("answer");
    this.input = documentElement("input");
    this.resultsDisplay = documentElement("results");
    const liveWPM = documentElement("live-wpm-display");
    const clockElt = documentElement("clock");

    this.liveWPM = new TypeJig.LiveWPM(liveWPM, this, options.live_wpm);
    const updateWPM = this.liveWPM.update.bind(this.liveWPM);
    this.clock = new TypeJig.Timer(clockElt, exercise.seconds, updateWPM);

    this.hint = initializeHints(options.hints);
    this.hint.show();

    if (!options.show_timer) this.clock.hide();

    this.live_wpm = options.live_wpm;
    this.live_cpm = options.live_cpm;
    this.hint_on_fail = options.hints == "fail";
    this.hint_on_fail = true;
    this.showing_hint_on_word = "";

    this.errorCount = 0;
    this.enterCount = 0;

    this.lookahead = 1000;

    this.typedWords = [];
    this.expectedWords = [];

    this.enterPoints = [];

    this.persistentWordData = [];

    this.partialTypedWord = "";

    this.lastTypedWordID = -1;

    if (options) {
        if (options.wpm !== "" && Math.floor(+options.wpm) == options.wpm) {
            this.speed = { type: "wpm", value: options.wpm };
        } else if (
            options.cpm !== "" &&
            Math.floor(+options.cpm) == options.cpm
        ) {
            this.speed = { type: "cpm", value: options.cpm };
        }
        if (typeof options.alternate === "string" && options.alternate !== "") {
            this.alternateWith = TypeJig.wordsAndSpaces(options.alternate);
            this.alternateWith.push(" ");
        }
        this.actualWords = options.actualWords;
    }

    var self = this; // close over `this` for event handlers.

    this.changeHandler = this.answerChanged.bind(this);
    bindEvent(document.body, "keydown", this.keyDown.bind(this));
    bindEvent(this.input, "input", function () {
        if (!self.pendingChange) {
            self.pendingChange = setTimeout(self.changeHandler, 5);
        }
    });

    var focusHandler = this.updateCursor.bind(this);
    bindEvent(this.input, "focus", focusHandler);
    bindEvent(this.input, "blur", focusHandler);
    function focusInput(evt) {
        self.input.focus();
        evt.preventDefault();
    }
    bindEvent(this.display, "click", focusInput);

    exercise.calculateBreakPoints(this.display);

    this.reset();
}

TypeJig.prototype.reset = function () {
    this.liveWPM.reset();
    this.display.style.width = "200%";
    this.typedWords = [];
    this.enter_count = 0;
    this.resultsDisplay.textContent = "";
    if (this.exercise && !this.exercise.started) {
        this.display.textContent = "";
    }
    spans = this.display.querySelectorAll("span");
    if (this.speed)
        for (let i = 0; i < spans.length; ++i) {
            spans[i].className = "notYet";
        }

    if (this.hint && this.hint.update) {
        //Get a string containing the next 10 words. if its at the end of the list get as much as you can.
     


        var word = this.exercise.words[0];
        var rect = this.display.getBoundingClientRect();

        this.hint.update(word, rect.left, rect.top);
    }

    if (this.hint && this.hint_on_fail) this.hint.show();

    // this.display.previousElementSibling.textContent = '';

    this.pendingChange = true;
    this.input.value = "";
    this.input.blur();
    this.input.focus();
    delete this.pendingChange;

    this.running = false;
    this.clock.reset();
    this.updateWords(this.exercise.words, true);
    this.displayTypedWords([]);
    window.scroll(0, scrollOffset(this.display));
};

TypeJig.wordsAndSpaces = function (string) {
    return string.match(/\S+|\s+/g) || [];
};

// Can contain a text-to-pseudosteno dictionary for each steno theory.
// Pseudosteno can be a single string or an array of strings, with
// longest entries first and shortest briefs last.
TypeJig.Translations = {};

TypeJig.processTranslations = function (t, fn) {
    var out = {};
    
    //Flip around the keys and values. treating duplicates as a list.
    for (var key in t) {
        var value = t[key];
        //If the value is already in the output as a list
        if (out[value] instanceof Array) {
            out[value].push(key);
        } else {
            out[value] = [key];
        }
    }
    return out;
};

TypeJig.longestTranslations = function (t) {
    return TypeJig.processTranslations(t, function (steno, text) {
        return steno instanceof Array ? steno[0] : steno;
    });
};

TypeJig.shortestTranslations = function (t) {
    //Get the custom dictionarys from localstorage
    customDictionariesString = localStorage.getItem("customDictionaries");
    console.log(customDictionariesString);
    var customDictionaries = []
    if(customDictionariesString){
        
        JSON.parse(customDictionariesString).forEach((dictionary) => {
            customDictionaries.push(TypeJig.processTranslations(dictionary));
        });
    }
    
    customDictionaries.push(TypeJig.processTranslations(t));

    console.log("Custom dic",customDictionaries);



    return customDictionaries;
};

// Arrays of strings (or of arrays of strings).
TypeJig.WordSets = {};
TypeJig.flattenWordSet = function (a) {
    out = [];
    for (var i = 0; i < a.length; ++i) out.push.apply(out, a[i]);
    return out;
};

TypeJig.prototype.start = function () {
    this.clock.start(this.endExercise.bind(this));
    this.startTime = Date.now();
    this.running = true;
    if (this.speed) {
        this.speed.current = this.display.firstElementChild;
        this.tick();
    }
};

TypeJig.prototype.tick = function () {
    var s = this.speed;
    if (!(this.running && s && s.current)) return;
    var fn = this.tick.bind(this);
    var ms = (1000 * 60) / s.value;

    this.exercise.numOfExpectedWords++;

    var thisWord = this.exercise.words[this.exercise.numOfExpectedWords];

    this.updateWords(this.exercise.words);
    if (s.type === "cpm") ms *= thisWord.length;

    if (s.current) setTimeout(fn, ms);
};

function nextItem(range) {
    range.collapse();
    var next = range.endContainer.nextElementSibling;
    if (next != null) {
        range.setStart(next, 0);
        range.setEnd(next, 1);
        if (/^\s+$/.test(range.toString())) nextItem(range);
    }
}

function nextWord(words) {
    var word = words.shift() || "";
    if (/^\s+$/.test(word)) word = words.shift() || "";
    return word;
}

TypeJig.prototype.setWord = function (word, id) {
    this.typedWords[id] = {
        ...this.typedWords[id],
        ...word,
    };
};

TypeJig.prototype.onWord = function (word, id) {
    this.typedWords.forEach((element) => {
        element.current = false;
    });

    var oldWord = this.typedWords[id];

    if (word.correct == false) {
        word.mistyped = true;
    }

    if (oldWord?.mistyped && word.correct) {
        word.corrected = true;
    }

    this.typedWords[id] = {
        ...this.typedWords[id],
        ...word,
    };

    //If we skip a word we need to mark the skipped words as dropped
    if (id > this.lastTypedWordID + 1) {
        for (let i = this.lastTypedWordID + 1; i < id; i++) {
            this.setWord(
                {
                    expected: this.exercise.words[i],
                    correct: false,
                    typed: "",
                    dropped: true,
                },
                i
            );
        }
    }

    if (id < this.lastTypedWordID) {
        for (let i = id; i < this.lastTypedWordID + 1; i++) {
            this.setWord(
                {
                    expected: "",
                    typed: "",
                },
                i
            );
        }
    }
    word.current = true;
    word.timestamp = this.clock.getTime();
    this.setWord(word, id);
    this.lastTypedWordID = id;
};

TypeJig.prototype.gradeTypeVsResult = function (typedWords, expectedWords) {
    var range = document.createRange();
    range.setStart(this.display.firstElementChild, 0);
    range.setEnd(this.display.firstElementChild, 1);
    var ex, y, match;
    y = range.getBoundingClientRect().bottom;

    // Display the user's answer, marking it for correctness.
    var oldOutput = this.display.previousElementSibling;
    var output = document.createElement("div");
    output.id = oldOutput.id;
    this.errorCount = 0;

    var expectedWords = this.exercise.words;

    var typedIndex = 0;
    var expectedIndex = 0;

    var wordList = [];
    //If the last element in the typed Words list is blank remove it
    // if (typedWords[typedWords.length - 1] == "") {
    //     typedWords.pop();
    // }
    for (let i = 0; i < typedWords.length; ++i) {
        if (typedIndex >= typedWords.length) break;
        var typed = typedWords[typedIndex];
        var expected = expectedWords[expectedIndex];
        matchResult = checkMatch(typed, expected);
        var lastTypedWord = typedIndex === typedWords.length - 1;

        if (matchResult) {
            wordList.push({
                correct: true,
                expected: expected,
                typed: typed,
            });
            expectedIndex++;
            typedIndex++;
            continue;
        }
        if (matchResult == null && lastTypedWord) {
            //If its partial and the last word, we need to add it
            wordList.push({
                correct: null,
                expected: expected,
                typed: typed,
            });
            break;
        }

        //Check if we are on an erranious word and further on we type a correct word
        let addedWordsOffset = 0;
        for (let offset = 1; offset < 5; offset++) {
            if (typedIndex + offset >= typedWords.length) break;
            const offsetTypedWord = typedWords[typedIndex + offset];
            offsetMatch = checkMatch(offsetTypedWord, expected);

            if (offsetMatch != false) {
                addedWordsOffset = offset;
                break;
            }
        }

        let droppedWordOffset = 0;
        for (let offset = 1; offset < 5; offset++) {
            if (expectedIndex + offset >= expectedWords.length) break;
            const offsetExpectedWord = expectedWords[expectedIndex + offset];
            offsetMatch = checkMatch(typed, offsetExpectedWord);
            if (lastTypedWord && offsetMatch == null) {
                droppedWordOffset = offset;
                break;
            }
            if (offsetMatch == true) {
                droppedWordOffset = offset;
                break;
            }
        }

        //Chose the lower of the two that are not zero

        //If they are both zero assume it was just a misspelling

        if (addedWordsOffset == 0 && droppedWordOffset == 0) {
            if (typed.length > 0) {
                this.persistentWordData[typedIndex] = {
                    ...this.persistentWordData[typedIndex],
                    failed: true,
                };
            }

            wordList.push({
                correct: false,
                expected: expected,
                typed: typed,
            });
            expectedIndex++;
            typedIndex++;
            continue;
        }

        if (addedWordsOffset == 0) addedWordsOffset = Infinity;
        if (droppedWordOffset == 0) droppedWordOffset = Infinity;

        //If one of them are a solution
        if (addedWordsOffset <= droppedWordOffset) {
            addedWords = [];
            for (let i = 0; i < addedWordsOffset; i++) {
                addedWords.push(typedWords[typedIndex + i]);
            }
            wordList.push({
                correct: checkMatch(
                    typedWords[typedIndex + addedWordsOffset],
                    expected
                ),
                expected: expected,
                typed: typedWords[typedIndex + addedWordsOffset],
                addedWords: addedWords,
            });
            typedIndex += addedWordsOffset;
            typedIndex++;
            expectedIndex++;
            continue;
        }

        if (droppedWordOffset < addedWordsOffset) {
            droppedWords = [];
            for (let i = 0; i < droppedWordOffset; i++) {
                wordList.push({
                    correct: false,
                    expected: expectedWords[expectedIndex + i],
                    typed: "",
                });
            }
            wordList.push({
                correct: checkMatch(
                    typed,
                    expectedWords[expectedIndex + droppedWordOffset]
                ),
                expected: expectedWords[expectedIndex + droppedWordOffset],
                typed: typed,
            });
            expectedIndex += droppedWordOffset;
            expectedIndex++;
            typedIndex++;
            continue;
        }
    }

    //Timestamp the last word
    var LastWord = this.persistentWordData[wordList.length - 1];

    this.persistentWordData[wordList.length - 1] = {
        ...LastWord,
        timeStamp: this.clock.getTime(),
    };
    return wordList;
};

TypeJig.prototype.displayTypedWords = function (typedWords) {
    delete this.pendingChange;

    var ex, match;

    // Display the user's answer, marking it for correctness.

    var output = document.createElement("div");
    this.errorCount = 0;

    var countedWords = 0;

    for (let i = 0; i < typedWords.length; i++) {
        var word = typedWords[i];
        //insert space if not the first word

        if (word.typed == "" && word.expected == "") {
            continue;
        }

        if (i != 0) {
            output.appendChild(document.createTextNode(" "));
        }

        var ans = word.typed;
        match = word.correct;
        ex = word.expected;
        this.errorCount += match == false;

        if (this.exercise && this.exercise.enterPoints.includes(i)) {
            output.appendChild(document.createTextNode("\n"));
        }

        //If the match has any erronius words, display them

        if (word.addedWords) {
            for (let j = 0; j < word.addedWords.length; j++) {
                var addedWord = word.addedWords[j];
                var addedWordNode = document.createElement("span");
                addedWordNode.appendChild(document.createTextNode(addedWord));
                addedWordNode.className = "incorrect";
                output.appendChild(addedWordNode);
                output.appendChild(document.createTextNode(" "));
            }
        }

        //If its the last element
        if (i === typedWords.length - 1) {
            var typedSpan = document.createElement("span");
            typedSpan.appendChild(document.createTextNode(ans));
            if (match != null)
                typedSpan.className = this.persistentWordData[i].failed
                    ? "corrected"
                    : match
                    ? "correct"
                    : "incorrect";
            output.appendChild(typedSpan);
            continue;
        } else if (match) {
            var typedSpan = document.createElement("span");
            typedSpan.appendChild(document.createTextNode(ans));
            typedSpan.className = this.persistentWordData[i].failed
                ? "corrected"
                : "correct";
            output.appendChild(typedSpan);

            continue;
        }

        var div = document.createElement("span");
        div.style.display = "inline-block";
        div.style.lineHeight = "1";
        div.style.position = "relative";

        if (ex != "" && ans == "") {
            div.className = "blankWord";
        }
        var typedSpan = document.createElement("span");
        typedSpan.style.position = "absolute";
        typedSpan.style.left = 0;
        var expectedSpan = document.createElement("span");
        expectedSpan.style.opacity = 0;

        typedSpan.appendChild(document.createTextNode(ans));

        if (word.current) {
            expectedSpan.appendChild(document.createTextNode(ans));
        } else {
            if (ans.length > ex.length) {
                expectedSpan.appendChild(document.createTextNode(ans + ""));
            } else {
                expectedSpan.appendChild(document.createTextNode(ex + ""));
            }
        }

        if (match != null)
            typedSpan.className = word.corrected
                ? "corrected"
                : match
                ? "correct"
                : "incorrect";

        div.appendChild(expectedSpan);
        div.appendChild(typedSpan);

        output.appendChild(div);
        // var span = document.createElement("span");
        // span.appendChild(document.createTextNode(match ? ex : ans));
        // span.className = match ? "correct" : "incorrect";
        // output.appendChild(div);
    }

    this.updateCursor(output);

    // if (match) ex = nextWord(exercise, range);

    // if (this.hint && this.hint.update) {
    //     var rect = output.getBoundingClientRect();
    //     this.hint.update(word, rect.left, rect.top);
    // }

    if (
        ex !== this.showing_hint_on_word &&
        this.hint_on_fail &&
        match &&
        this.hint
    ) {
        this.showing_hint_on_word = "";
        // this.hint.show();
    }
    output.id = this.answerDisplay.id;
    this.answerDisplay.parentNode.replaceChild(output, this.answerDisplay);
    this.answerDisplay = output;
    return null;
};

function checkMatch(typed, expected) {
    if (typed == "") return false;
    if (
        typed.length < expected.length &&
        typed === expected.slice(0, typed.length)
    ) {
        return null;
    }
    return typed === expected;
}

TypeJig.prototype.answerChanged = function () {
    delete this.pendingChange;
    typedWords = this.input.value.replaceAll(/^\s+/g, "").split(/\s+/);

    //replace all leading spaces if they exist
    

     
    if (this.resultsDisplay.textContent !== "") return;
    if (!this.running && !!this.input.value.trim()) {
        this.start();
    }
    this.typedWords = this.gradeTypeVsResult(typedWords, this.exercise.words);

    if (
        this.typedWords.length >= this.exercise.words.length &&
        this.typedWords[this.typedWords.length - 1].correct
    ) {
        window.setTimeout(this.clock.stop.bind(this.clock));
    }
    this.updateCursor(this.answerDisplay);

    //Get the expected value of the next word

    var r = this.answerDisplay.getBoundingClientRect();
    var nextWord = this.exercise.words[this.typedWords.length];
    var thisTypedWord = this.typedWords[this.typedWords.length - 1];

    if (this.hint && this.hint.update) {
        if (
            thisTypedWord &&
            (thisTypedWord.correct == null || thisTypedWord.typed == "")
        ) {
             
            var nextWords = this.exercise.words.slice(
                this.typedWords.length - 1,
                Math.min(
                    this.typedWords.length + 10,
                    this.exercise.words.length
                )
            ).join(" ");
            this.hint.update(nextWords, r.left, r.top);
        } else {
            var nextWords = this.exercise.words
                .slice(
                    this.typedWords.length ,
                    Math.min(
                        this.typedWords.length + 10,
                        this.exercise.words.length
                    )
                )
                .join(" ");
            this.hint.update(nextWords, r.left, r.top);
        }
    }

    // if(ex !== this.showing_hint_on_word && this.hint_on_fail && match && this.hint){
    // 	this.showing_hint_on_word = "";
    // 	this.hint.hide();
    // }

    // this.display.parentNode.replaceChild(output, oldOutput);
    this.displayTypedWords(this.typedWords);

    this.updateWords(this.exercise.words);
};

TypeJig.prototype.keyDown = function (e) {
    var id;
    if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) {
        this.enter_count = 0;
        return;
    }
    if (e.key === "Enter") ++this.enter_count;
    else this.enter_count = 0;
    switch (e.key) {
        case "Enter":
            if (this.enter_count >= 3) {
                id = "again";
                this.enter_count = 0;
            }
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

TypeJig.prototype.updateWords = function (words, hardReset) {
    var display = this.display;

    if (hardReset) {
        display = document.createElement("div");
        display.id = this.display.id;
        display.style.width = "200%";
    }

    for (let i = 0; i < words.length; ++i) {
        var word = words[i];

        var typedWentOver =
            this.typedWords[i] && this.typedWords[i].typed.length > word.length;
        if (hardReset) {
            if (this.exercise && this.exercise.enterPoints.includes(i)) {
                display.appendChild(document.createTextNode("\n"));
            }
        }

        //See if the state of the word has changed
        if (hardReset) {
        } else if (this.typedWords.length - i > 10) {
            if (this.exercise.numOfExpectedWords == i + 1) {
            } else {
                continue;
            }
        }

        var finalObject = document.createElement("span");

        //See if the typed word has any erroneous words and account for them
        var erroneousWords =
            this.typedWords[i] && this.typedWords[i].addedWords;
        if (erroneousWords) {
            finalObject.classList.add("complex-word-container");
            for (let j = 0; j < erroneousWords.length; j++) {
                var erroneousWord = erroneousWords[j];
                var div = document.createElement("span");
                div.style.opacity = 0;

                div.appendChild(document.createTextNode(erroneousWord + " "));

                finalObject.appendChild(div);
            }
        }

        if (typedWentOver) {
            finalObject.classList.add("complex-word-container");
            // div.style.float = "left"

            var typedSpan = document.createElement("span");
            typedSpan.style.position = "absolute";
            typedSpan.style.left = 0;
            var expectedSpan = document.createElement("span");
            expectedSpan.style.opacity = 0;

            typedSpan.appendChild(document.createTextNode(word));

            expectedSpan.appendChild(
                document.createTextNode(this.typedWords[i].typed + " ")
            );
            finalObject.appendChild(typedSpan);
            finalObject.appendChild(expectedSpan);
        } else {
            finalObject.style.display = "inline-block";

            finalObject.appendChild(document.createTextNode(word + " "));
        }

        if (this.exercise.numOfExpectedWords <= i) {
            finalObject.classList.add("notYet");
        }
        finalObject.id = "word" + i;
        var existingObject = display.querySelector("#word" + i);
        if (existingObject) {
            display.replaceChild(finalObject, existingObject);
        } else {
            display.appendChild(finalObject);
        }
    }
    if (hardReset) {
        this.display.parentNode.replaceChild(display, this.display);
    }
    function focusInput(evt) {
        self.input.focus();
        evt.preventDefault();
    }
    unbindEvent(this.display, "click", focusInput);
    this.display = display;
    bindEvent(this.display, "click", focusInput);
};

// TypeJig.prototype.getWords = function(n) {
// 	// Split the exercise text into words (keeping the whitespace).
// 	var exercise = TypeJig.wordsAndSpaces(this.display.textContent);

// 	if (this.display.textContent) this.expectedWords = this.display.textContent.split(/\s+/);
// 	else this.expectedWords = [];
//     if (this.exercise && typeof n === "number") {
//       // Add more text until we have enough (or there is no more).
//       n = n + this.lookahead;
//     }

// 	while(this.exercise && (!n || this.expectedWords.length < n)) {
// 		var text = this.exercise.getText();
// 		if(text) {
// 			var pieces = text.trim().split(/\s+/);
// 			if(this.alternateWith) {
// 				for(let i=0; i<this.alternateWith.length; ++i) {
// 					pieces.push(this.alternateWith[i]);
// 				}
// 			}

// 			for(let i=0; i<pieces.length; ++i) {
// 				this.expectedWords.push(pieces[i]);
// 			}

// 		} else delete(this.exercise);
// 	}
// 	this.updateWords(this.expectedWords)
// 	return exercise;
// };

TypeJig.prototype.currentSpeed = function (seconds, prev) {
    var minutes = seconds / 60; // KEEP fractional part for WPM calculation!
    seconds = Math.floor((seconds % 60) * 10) / 10;
    var time = Math.floor(minutes) + ":" + seconds;

    var wordsFromSpaces = this.input.value.split(/\s+/).length;
    var wordsFromChars = this.input.value.length / 5;
    var words = this.actualWords ? wordsFromSpaces : wordsFromChars;
    var WPM = words / minutes;
    if (prev) WPM = (words - prev.words) / (minutes - prev.minutes);
    var correctedWPM = WPM - this.errorCount / minutes;
    var accuracy = 1 - this.errorCount / wordsFromSpaces;
    return {
        minutes: minutes,
        time: time,
        wordsFromSpaces: wordsFromSpaces,
        wordsFromChars: wordsFromChars,
        words: words,
        WPM: WPM,
        correctedWPM: correctedWPM,
        accuracy: accuracy,
    };
};

TypeJig.prototype.endExercise = function (seconds) {
    if (this.running) this.running = false;
    else return;

    if (document.activeElement != document.body) document.activeElement.blur();
    unbindEvent(this.input, this.changeHandler);

    if (this.lastAnswered) {
        let elt = this.lastAnswered;
        while (elt.nextSibling) elt.parentNode.removeChild(elt.nextSibling);
    }

    const stats = this.currentSpeed(seconds);
    var results = "Time: " + stats.time + " - " + Math.floor(stats.WPM);
    if (this.actualWords) {
        if (this.actualWords.unit) results += " " + this.actualWords.unit;
        else results += " " + this.actualWords;
    } else {
        var plural = this.errorCount === 1 ? "" : "s";
        results += " WPM (chars per minute/5)";
        if (this.errorCount === 0) results += " with no uncorrected errors!";
        else
            results +=
                ", adjusting for " +
                this.errorCount +
                " incorrect word" +
                plural +
                " (" +
                Math.floor(100 * stats.accuracy) +
                "%) gives " +
                Math.floor(stats.correctedWPM) +
                " WPM.";
    }
    results = "\n\n" + results;
    var start = this.resultsDisplay.textContent.length;
    var end = start + results.length;
    this.resultsDisplay.textContent += results;
    this.updateWords(this.exercise.words, true);
    this.renderChart(this.liveWPM.WPMHistory);

    this.resultsDisplay.scrollIntoView(true);
    this.displayTypedWords(this.typedWords);
};

TypeJig.prototype.addCursor = function (output) {
    if (!output) output = this.answerDisplay;
    var cursor = output.querySelector(".cursor");
    if (cursor) return;
    var cursor = document.createElement("span");
    cursor.className = "cursor";
    output.appendChild(document.createTextNode("\u200b"));
    output.appendChild(cursor);
};

TypeJig.prototype.removeCursor = function (output) {
    if (!output) output = this.display.previousElementSibling;
    var cursors = output.getElementsByClassName("cursor");
    // Note that we go backwards since it is a live collection.  Elements
    // are removed immediately so we need to not screw up indices that we
    // still need.
    for (let i = cursors.length - 1; i >= 0; --i) {
        var c = cursors[i];
        c.parentNode.removeChild(c.previousSibling);
        c.parentNode.removeChild(c);
    }
};

// Gets called on focus and blur events, and also gets called with a
// div when we're building the new output.
TypeJig.prototype.updateCursor = function (evt) {
    var hasFocus, output;
    if (evt.type === "focus") hasFocus = true;
    else if (evt.type === "blur") hasFocus = false;
    else {
        output = evt;
        hasFocus = document.activeElement === this.input;
    }
    if (hasFocus) this.addCursor(output);
    else this.removeCursor(output);
};

// -----------------------------------------------------------------------
// Helper functions

isOwnPlural = { cod: true };

function pluralize(word) {
    if (isOwnPlural.hasOwnProperty(word)) return word;
    switch (word[word.length - 1]) {
        case "s":
            return word + "es";
        case "y":
            return word.slice(0, -1) + "ies";
        default:
            return word + "s";
    }
}

function bindEvent(elt, evt, fn) {
    if (elt.addEventListener) elt.addEventListener(evt, fn, false);
    else if (elt.attachEvent) elt.attachEvent("on" + evt, fn);
}

function unbindEvent(elt, evt, fn) {
    if (elt.removeEventListener) elt.removeEventListener(evt, fn, false);
    else if (elt.detachEvent) elt.detachEvent("on" + evt, fn);
}

function documentElement(elt) {
    if (typeof elt === "string") elt = document.getElementById(elt);
    return elt;
}

function scrollOffset(elt) {
    var offset = 0;
    if (elt.offsetParent)
        do {
            offset += elt.offsetTop;
        } while ((elt = elt.offsetParent));
    return offset;
}

function hasClass(elt, className) {
    var re = new RegExp("(s|^)" + className + "(s|$)");
    return re.test(elt.className);
}

/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 */
function shuffle(a) {
    for (var i = a.length - 1; i >= 1; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var a_i = a[i];
        a[i] = a[j];
        a[j] = a_i;
    }
    return a;
}

function randomIntLessThan(n) {
    return Math.floor(n * Math.random()) % n;
}

function shuffleTail(a, n) {
    n = Math.min(n, a.length);
    var i = n,
        b = a.length - n; // current and base indices
    while (--i > 0) {
        var other = randomIntLessThan(i + 1);
        var t = a[i + b];
        a[i + b] = a[other + b];
        a[other + b] = t;
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
    if (typeof a.used === "undefined") a.used = 0;
    // don't shuffle if the current entry is multiple words
    else if (typeof a[0].i === "undefined") {
        a.push(a.shift());
        a.used += 1;

        if (typeof a.randomEltsUsed === "undefined") {
            if (a.used >= a.length) return false;
        } else {
            a.randomEltsUsed += 1;
            if (a.randomEltsUsed > (2 / 3) * a.length) {
                shuffleTail(a, a.randomEltsUsed);
                a.randomEltsUsed = 0;
            }
        }
    }
    return a[0];
}

TypeJig.wordCombos = function (combos) {
    let index0, index1;

    function nextWord() {
        if (index0 == null) {
            shuffle(combos);
            for (let i = 0; i < combos.length; ++i) shuffle(combos[i]);
            (index0 = 0), (index1 = 0);
        }
        if (index1 >= combos[index0].length) {
            index0++;
            index1 = 0;
        }
        if (index0 < combos.length) return combos[index0][index1++];
        else {
            index0 = null;
            return nextWord();
        }
    }

    return nextWord;
};

// -----------------------------------------------------------------------

TypeJig.LiveWPM = function (elt, typeJig, showLiveWPM) {
    this.elt = elt;
    elt.innerHTML = "";
    this.typeJig = typeJig;
    this.prevSpeed = null;
    this.WPMHistory = [];
    this.showLiveWPM = showLiveWPM;
};

TypeJig.LiveWPM.prototype.update = function (seconds) {
    const aw = this.typeJig.actualWords;
    const unit = aw && aw.u ? aw.u : "WPM";
    const stats = this.typeJig.currentSpeed(seconds, this.prevSpeed);
    this.prevSpeed = stats;
    this.WPMHistory.push(stats.correctedWPM);
    // Show the average of the last (up to) 5 samples

    //Get the average distance between the last 5 samples
    let persistantData = this.typeJig.persistentWordData;

    if (persistantData.length >= 11) {
        if (!persistantData[persistantData.length - 1]) {
            this.elt.innerHTML = "~ First Unknown";
            return;
        }
        if (!persistantData[persistantData.length - 11]) {
            this.elt.innerHTML = "~ Second Unknown";
            return;
        }
        distance =
            persistantData[persistantData.length - 1].timeStamp -
            persistantData[persistantData.length - 11].timeStamp;

        // const n = this.WPMHistory.length,
        //     i0 = Math.max(0, n - 1 - 5);
        // for (let i = i0; i < n; ++i) WPM += this.WPMHistory[i];
        // WPM = WPM / (n - i0);
        if (this.showLiveWPM)
            this.elt.innerHTML =
                "~" + Math.floor((10 / distance) * 60) + " " + unit;
    } else {
        distance = persistantData[persistantData.length - 1].timeStamp;

        // const n = this.WPMHistory.length,
        //     i0 = Math.max(0, n - 1 - 5);
        // for (let i = i0; i < n; ++i) WPM += this.WPMHistory[i];
        // WPM = WPM / (n - i0);
        if (this.showLiveWPM)
            this.elt.innerHTML =
                "~" +
                Math.floor((persistantData.length / distance) * 60) +
                " " +
                unit;
    }
};

TypeJig.LiveWPM.prototype.reset = function () {
    this.WPMHistory = [];
};

function movingAvg(array, countBefore, countAfter) {
    if (countAfter == undefined) countAfter = 0;
    const result = [];
    for (let i = 0; i < array.length; ++i) {
        const subArr = array.slice(
            Math.max(i - countBefore, 0),
            Math.min(i + countAfter + 1, array.length)
        );
        const avg =
            subArr.reduce((a, b) => a + (isNaN(b) ? 0 : b), 0) / subArr.length;
        result.push(avg);
    }
    return result;
}

TypeJig.prototype.renderChart = function (series) {
    if (this.wpmChart) {
        this.wpmChart.destroy();
        delete this.wpmChart;
    }

    series[0] = 0;
    var rollingAverage = 0;
    for (var i = 5; i > 0; --i) {
        rollingAverage = 0;
        for (var j = 0; j < i + 1; ++j) rollingAverage += series[j];
        series[i] = rollingAverage / (i + 1);
    }

    averageDatasetData = [
        {
            x: 0,
            y: 0,
        },
    ];

    //zip the persistant word data and the typedWord data
    var combinedData = [];
    for (var i = 0; i < this.typedWords.length; i++) {
        combinedData.push({
            ...this.typedWords[i],
            ...this.persistentWordData[i],
        });
    }

    combinedData.sort((a, b) => a.timeStamp - b.timeStamp);

    for (let i = 0; i < combinedData.length; i++) {
        var pastValue = combinedData[i].timeStamp ?? 0;

        var currentValues = 0;

        for (let j = i; j > 0; j--) {
            if (currentValues >= 10) break;
            if (combinedData[j].correct == false) {
                continue;
            }
            currentValues++;
            pastValue = combinedData[j];
        }

        distance = combinedData[i].timeStamp - pastValue;
        averageDatasetData.push({
            x: combinedData[i].timeStamp,
            y: (currentValues / distance) * 60,
            ...combinedData[i],
        });
    }

    totalDataDataset = [
        {
            x: 0,
            y: 0,
        },
    ];

    for (let i = 0; i < combinedData.length; i++) {
        if (i < 10) {
            totalDataDataset.push({
                x: combinedData[i].timeStamp,
                y: (i / combinedData[i].timeStamp) * 60 * (i / (i + 1)),
                ...combinedData[i],
            });
        } else {
            totalDataDataset.push({
                x: combinedData[i].timeStamp,
                y: (i / combinedData[i].timeStamp) * 60,
                ...combinedData[i],
            });
        }
    }

    //Sort both the totalDataDataset and the averageDatasetData by x
    totalDataDataset.sort(function (a, b) {
        return a.x - b.x;
    });
    averageDatasetData.sort(function (a, b) {
        return a.x - b.x;
    });

    series = movingAvg(series, 4, 4);

    //Apply a rolling average of 5 to the data

    const aw = this.actualW10ords;
    const unit = aw && aw.u ? aw.u : "WPM";

    const data = {
        datasets: [
            {
                label: unit,
                data: averageDatasetData,
                fill: false,
                borderColor: "rgb(75, 192, 192)",
                pointRadius: 5,
                pointBackgroundColor: function (context) {
                    var index = context.dataIndex;
                    var value = context.dataset.data[index];
                    return value.correct == false
                        ? "red" // draw negative values in red
                        : value.correct && value.failed
                        ? "yellow" // else, alternate values in blue and green
                        : "green";
                },
                tension: 0.2,
                showLine: true,
            },
            {
                label: "Total WPM",
                data: totalDataDataset,
                pointBackgroundColor: function (context) {
                    var index = context.dataIndex;
                    var value = context.dataset.data[index];
                    return value.correct == false
                        ? "red" // draw negative values in red
                        : value.correct && value.failed
                        ? "yellow" // else, alternate values in blue and green
                        : "green";
                },
                fill: false,
                borderColor: "rgb(255, 99, 132)",
                pointRadius: 5,
                tension: 0.2,
                showLine: true,
            },
        ],
    };

    const config = {
        type: "scatter",
        data: data,
        options: {
            scales: { y: { beginAtZero: true } },
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    displayColors: false,
                    callbacks: {
                        title: function (context) {
                            return context[0].raw.expected;
                            return [
                                all.datasets[tooltipItem[0].datasetIndex].data[
                                    tooltipItem[0].index
                                ].expected,
                            ];
                        },
                        label: function (context) {
                            return [
                                "WPM :" + context.raw.y.toFixed(),
                                context.raw.x.toFixed(2) + "s",
                            ];
                        },
                    },
                },
            },
        },
    };

    this.wpmChart = new Chart(
        document.getElementById("chartDiv").getContext("2d"),
        config
    );
};

// -----------------------------------------------------------------------
/**
 *
 * @param {*} elt The element to display the text in
 * @param {number|null} countdownMs The number of seconds if any that represents the "end" of the timer
 * @param {*} onUpdate A function to call when the timer 'ticks'
 */

TypeJig.Timer = function (elt, countdownMs, onUpdate) {
    this.elt = elt;
    elt.innerHTML = "";

    this.alarm = countdownMs > 0;
    this.timerLength = countdownMs ?? 0;

    this.updateThis = this.update.bind(this);
    this.showTime();
    this.onUpdate = onUpdate || function () {};
    this.running = false;
};

/**
 *
 * @returns {number} Returns the number of seconds (fractional!) since the timer has started. 0 if not started
 */
TypeJig.Timer.prototype.getTime = function (round) {
    if (!this.startTime) return 0;
    if (round) {
        return Math.floor((new Date().getTime() - this.startTime) / 1000);
    } else {
        return (new Date().getTime() - this.startTime) / 1000;
    }
};

TypeJig.Timer.prototype.reset = function () {
    delete this.startTime;
    delete this.endTime;
    this.seconds = 0;
    this.showTime();
};

TypeJig.Timer.prototype.start = function (alarm) {
    this.onFinished = alarm;
    this.startTime = new Date().getTime();
    if (this.alarm) this.endTime = this.startTime + this.timerLength;

    window.setTimeout(this.updateThis, 1000);
};

TypeJig.Timer.prototype.stop = function () {
    var elapsed = (new Date().getTime() - this.startTime) / 1000;
    if (this.onFinished) this.onFinished(elapsed);
    delete this.startTime;
    delete this.endTime;
};

TypeJig.Timer.prototype.update = function () {
    if (this.startTime) {
        var running = true;
        var now = new Date().getTime();
        var msElapsed = Math.max(0, now - this.startTime);
        var msTilNext = 1000 - (msElapsed % 1000);

        if (this.endTime) running = now < this.endTime;

        this.showTime();

        this.onUpdate(msElapsed);

        if (running) window.setTimeout(this.updateThis, msTilNext);
        else this.stop();
    }
};

TypeJig.Timer.prototype.showTime = function () {
    if (!this.elt) return;
    var elapsed = this.getTime(true);

    if (this.alarm) {
        elapsed = Math.floor(this.timerLength / 1000 - elapsed);
    }

    var m = Math.floor(elapsed / 60);
    var s = elapsed % 60;
    if (s < 10) s = "0" + s;
    this.elt.innerHTML = m + ":" + s;
};

TypeJig.Timer.prototype.hide = function () {
    this.elt.style.display = "none";
};

// -----------------------------------------------------------------------

TypeJig.Exercise = function (words, seconds, shuffle, select, speed) {
    this.started = false;
    this.words = words;
    this.seconds = seconds;
    this.shuffle = shuffle;
    this.select =
        TypeJig.Exercise.select[select] || TypeJig.Exercise.select.random;
    this.numOfExpectedWords = -1;

    if (shuffle) randomize(this.words);
};

function indexInto(a) {
    if (typeof a.i === "undefined") a.i = 0;
    var word = a[a.i];
    if (++a.i === a.length) delete a.i;
    return word;
}

TypeJig.Exercise.select = {
    random: function (a) {
        return a[randomIntLessThan(a.length)];
    },
    first: function (a) {
        return a[0];
    },
    ordered: indexInto,
    shuffled: function (a) {
        if (typeof a.i === "undefined") randomize(a);
        return indexInto(a);
    },
};

TypeJig.Exercise.prototype.getText = function () {
    var word = rotateAndShuffle(this.words);
    if (word instanceof Array) word = this.select(word);
    return word;
};

TypeJig.Exercise.prototype.calculateBreakPoints = function (display) {
    this.enterPoints = [];

    var words = this.words;
    while (display.firstChild) {
        display.removeChild(display.firstChild);
    }

    var y = 0;
    for (let i = 0; i < words.length; ++i) {
        var word = words[i];
        var span = document.createElement("span");
        span.appendChild(document.createTextNode(word + " "));
        display.appendChild(span);

        var r = display.getBoundingClientRect();
        if (r.bottom > y + 0.001) {
            if (i != 0) this.enterPoints.push(i);
            y = r.bottom;
        }
        // output.appendChild(document.createTextNode("\n"));
        // if (endOfAnswer) {
        // 	var limit = 0.66 * window.innerHeight;
        // 	var end = this.display.getBoundingClientRect().bottom;
        // 	var r = range.getBoundingClientRect();
        // 	if (end > window.innerHeight && r.bottom > limit)
        // 		window.scrollBy(0, r.bottom - limit);
        // }
    }
    return display;
};
