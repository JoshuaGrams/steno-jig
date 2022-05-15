/* -----------------------------------------------------------------------
 * TypeJig - run a typing lesson.
 *
 * `exercise` is a TypeJig.Exercise object, while `display`, `input`,
 * `output`, and `clock` are elements (or element ID strings).
 */

function TypeJig(exercise, display, results, input, clock, hint, options) {
  this.exercise = exercise;
  this.display = documentElement(display);
  this.input = documentElement(input);
  this.resultsDisplay = documentElement(results);

  this.liveWPM = new TypeJig.LiveWPM(
    documentElement("live-wpm-display"),
    this,
    options.live_wpm
  );
  this.clock = new TypeJig.Timer(
    documentElement(clock),
    exercise.seconds,
    this.liveWPM.update.bind(this.liveWPM)
  );

  this.hint = hint;
  this.live_wpm = options.live_wpm;
  this.live_cpm = options.live_cpm;
  this.errorCount = 0;
  this.enterCount = 0;

  this.lookahead = 1000;

  if (options) {
    if (options.wpm !== "" && Math.floor(+options.wpm) == options.wpm) {
      this.speed = { type: "wpm", value: options.wpm };
    } else if (options.cpm !== "" && Math.floor(+options.cpm) == options.cpm) {
      this.speed = { type: "cpm", value: options.cpm };
    }
    if (typeof options.alternate === "string" && options.alternate !== "") {
      this.alternateWith = TypeJig.wordsAndSpaces(options.alternate);
      this.alternateWith.push(" ");
    }
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

  this.reset();
}

TypeJig.prototype.reset = function () {
  this.enter_count = 0;
  this.resultsDisplay.textContent = "";
  if (this.exercise && !this.exercise.started) {
    this.display.textContent = "";
    this.getWords(0);
  }
  spans = this.display.querySelectorAll("span");
  if (this.speed)
    for (let i = 0; i < spans.length; ++i) {
      spans[i].className = "notYet";
    }

  if (this.hint && this.hint.update) {
    var word = (this.display.textContent.match(/^\S+/) || [""])[0];
    var rect = this.display.getBoundingClientRect();
    this.hint.update(word, rect.left, rect.top);
  }

  this.display.previousElementSibling.textContent = "";

  this.pendingChange = true;
  this.input.value = "";
  this.input.blur();
  this.input.focus();
  delete this.pendingChange;

  this.running = false;
  this.clock.reset();

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
  var has = Object.prototype.hasOwnProperty;
  for (var text in t)
    if (has.call(t, text)) {
      out[text] = fn(t[text], text);
    }
  return out;
};

TypeJig.longestTranslations = function (t) {
  return TypeJig.processTranslations(t, function (steno, text) {
    return steno instanceof Array ? steno[0] : steno;
  });
};

TypeJig.shortestTranslations = function (t) {
  return TypeJig.processTranslations(t, function (steno, text) {
    return steno instanceof Array ? steno[steno.length - 1] : steno;
  });
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
  if (s.type === "cpm") ms *= s.current.textContent.length;
  else
    while (/^(\s*|\p{Punctuation})$/u.test(s.current.textContent)) {
      s.current.className = "";
      s.current = s.current.nextElementSibling;
    }
  s.current.className = "";
  s.current = s.current.nextElementSibling;
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

TypeJig.prototype.answerChanged = function () {
  delete this.pendingChange;
  if (this.resultsDisplay.textContent !== "") return;
  if (!this.running && !!this.input.value.trim()) {
    this.start();
  }

  // Get the exercise and the user's answer as arrays of
  // words interspersed with whitespace.
  var answer = TypeJig.wordsAndSpaces(this.input.value.replace(/^\s+/, ""));
  var exercise = this.getWords(Math.ceil(answer.length / 2));

  // Get the first word of the exercise, and create a range
  // which we can use to measure where it is.
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
  for (let i = 0; i < answer.length; ++i) {
    var endOfAnswer = i === answer.length - 1;
    var ans = answer[i];
    if (/^\s+$/.test(ans)) {
      // whitespace
      output.appendChild(document.createTextNode(ans));
      continue;
    }

    ex = nextWord(exercise);
    match = this.match == null ? ans == ex : this.match(ans, ex);

    var r = range.getBoundingClientRect();
    if (r.bottom > y + 0.001) {
      output.appendChild(document.createTextNode("\n"));
      if (endOfAnswer) {
        var limit = 0.66 * window.innerHeight;
        var end = this.display.getBoundingClientRect().bottom;
        var r = range.getBoundingClientRect();
        if (end > window.innerHeight && r.bottom > limit)
          window.scrollBy(0, r.bottom - limit);
      }
    }
    y = r.bottom;

    nextItem(range);

    var partial =
      endOfAnswer && ans.length < ex.length && ans === ex.slice(0, ans.length);
    if (partial) {
      // Don't yet know whether it matched, so add it as raw text.
      output.appendChild(document.createTextNode(ans));
    } else {
      this.errorCount += !match;
      // Add it as a span marked as correct or incorrect.
      var span = document.createElement("span");
      span.appendChild(document.createTextNode(match ? ex : ans));
      span.className = match ? "correct" : "incorrect";
      output.appendChild(span);
    }

    // End the exercise if the last word was answered correctly.
    var last = exercise.length === 0 && !this.exercise;
    if (last && match) window.setTimeout(this.clock.stop.bind(this.clock));
  }
  this.updateCursor(output);

  this.lastAnswered = range.endContainer;

  if (match) ex = nextWord(exercise, range);
  var r = range.getBoundingClientRect();

  if (this.hint && this.hint.update) {
    this.hint.update(ex, r.left, r.top);
  }

  this.display.parentNode.replaceChild(output, oldOutput);
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

TypeJig.prototype.getWords = function (n) {
  // Split the exercise text into words (keeping the whitespace).
  var exercise = TypeJig.wordsAndSpaces(this.display.textContent);

  // Add more text until we have enough (or there is no more).
  if (this.exercise && typeof n === "number") {
    n = 2 * (n + this.lookahead) + 1;
  }
  while (this.exercise && (!n || exercise.length < n)) {
    var text = this.exercise.getText();
    if (text) {
      var pieces = TypeJig.wordsAndSpaces(text);
      if (this.alternateWith) {
        let alt = this.alternateWith;
        var words = [];
        for (let i = 0; i < pieces.length; ++i) {
          if (/^\S+$/.test(pieces[i])) {
            for (let j = 0; j < alt.length; ++j) {
              words.push(alt[j]);
            }
          }
          words.push(pieces[i]);
        }
        pieces = words;
      }
      for (let i = 0; i < pieces.length; ++i) {
        var span = document.createElement("span");
        span.appendChild(document.createTextNode(pieces[i]));
        if (this.speed) span.className = "notYet";
        this.display.appendChild(span);
      }
      exercise.push.apply(exercise, pieces);
    } else delete this.exercise;
  }
  return exercise;
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

  var minutes = seconds / 60; // KEEP fractional part for WPM calculation!
  seconds = Math.floor((seconds % 60) * 10) / 10;
  if (seconds < 10) seconds = "0" + seconds;
  var time = Math.floor(minutes) + ":" + seconds;

  var actualWords = this.input.value.split(/\s+/).length;
  var standardWords = this.input.value.length / 5;
  var visibleWords = this.actualWords ? actualWords : standardWords;
  var visibleWPM = Math.floor(visibleWords / minutes);
  var plural = this.errorCount === 1 ? "" : "s";
  var accuracy = Math.floor(100 * (1 - this.errorCount / actualWords));
  var correctedWPM = Math.round(visibleWPM - this.errorCount / minutes);
  var results = "Time: " + time + " - " + visibleWPM;
  if (this.actualWords) results += " " + this.actualWords;
  else {
    results += " WPM (chars per minute/5)";
    if (this.errorCount === 0) results += " with no uncorrected errors!";
    else
      results +=
        ", adjusting for " +
        this.errorCount +
        " incorrect word" +
        plural +
        " (" +
        accuracy +
        "%) gives " +
        correctedWPM +
        " WPM.";
  }
  results = "\n\n" + results;
  var start = this.resultsDisplay.textContent.length;
  var end = start + results.length;
  this.resultsDisplay.textContent += results;

  var range = document.createRange();
  range.setStart(this.resultsDisplay.firstChild, start);
  range.setEnd(this.resultsDisplay.firstChild, end);

  this.renderChart(this.liveWPM.WPMHistory);
  var rect = range.getBoundingClientRect();
  var scroll = rect.bottom - window.innerHeight;
  if (scroll > 0)
    setTimeout(function () {
      window.scrollBy(0, scroll);
    }, 2);
};

TypeJig.prototype.renderChart = function (series) {
  series[0] = 0;
  var rollingAverage = 0;
  for (var i = 5; i > 0; i--) {
    rollingAverage = 0;
    for (var j = 0; j < i + 1; j++) {
      rollingAverage += series[j];
    }
    series[i] = rollingAverage / (i + 1);
  }

  const labels = [...Array(series.length).keys()];
  const data = {
    labels: labels,
    datasets: [
      {
        label: "WPM",
        data: series,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        pointRadius: 0,
        tension: 0.4,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  const config = {
    type: "line",
    data: data,
    options: options,
  };

  const myChart = new Chart(
    document.getElementById("chartDiv").getContext("2d"),
    config
  );
};

TypeJig.prototype.addCursor = function (output) {
  if (!output) output = this.display.previousElementSibling;
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
  this.WPMHistory = [];
  this.showLiveWPM = showLiveWPM;
  console.log("showLiveWPM", showLiveWPM);
};

TypeJig.LiveWPM.prototype.update = function (seconds) {
  console.log("update", seconds);
  console.log("element", this.elt);
  var minutes = seconds / 60; // KEEP fractional part for WPM calculation!
  seconds = Math.floor((seconds % 60) * 10) / 10;
  var time = Math.floor(minutes) + ":" + seconds;

  var actualWords = this.typeJig.input.value.split(/\s+/).length;
  var standardWords = this.typeJig.input.value.length / 5;
  var visibleWords = this.typeJig.actualWords ? actualWords : standardWords;
  var visibleWPM = Math.floor(visibleWords / minutes);
  var plural = this.typeJig.errorCount === 1 ? "" : "s";
  var accuracy = Math.floor(100 * (1 - this.typeJig.errorCount / actualWords));
  var correctedWPM = Math.round(
    (visibleWords - this.typeJig.errorCount) / minutes
  );
  var results = "Time: " + time + " - " + visibleWPM;
  if (this.typeJig.actualWords) results += " " + this.typeJig.actualWords;
  else {
    results += " WPM (chars per minute/5)";
    if (this.typeJig.errorCount === 0)
      results += " with no uncorrected errors!";
    else
      results +=
        ", adjusting for " +
        this.errorCount +
        " incorrect word" +
        plural +
        " (" +
        accuracy +
        "%) gives " +
        correctedWPM +
        " WPM.";
  }
  this.WPMHistory.push(correctedWPM);
  if (this.showLiveWPM) this.elt.innerHTML = correctedWPM + " WPM";
};

// -----------------------------------------------------------------------

TypeJig.Timer = function (elt, seconds, onUpdate) {
  this.elt = elt;
  elt.innerHTML = "";
  this.setting = seconds || 0;
  this.seconds = this.setting;
  this.fn = this.update.bind(this);
  this.showTime();
  this.onUpdate = onUpdate || function () {};
};

TypeJig.Timer.prototype.reset = function () {
  delete this.beginning;
  delete this.end;
  this.seconds = this.setting;
  this.showTime();
};

TypeJig.Timer.prototype.start = function (alarm) {
  this.finished = alarm;
  this.beginning = new Date().getTime();
  if (this.setting > 0) this.end = this.beginning + 1000 * this.setting;
  window.setTimeout(this.fn, 1000);
};

TypeJig.Timer.prototype.stop = function () {
  var elapsed = (new Date().getTime() - this.beginning) / 1000;
  if (this.finished) this.finished(elapsed);
  delete this.beginning;
  delete this.end;
};

TypeJig.Timer.prototype.update = function () {
  if (this.beginning) {
    var running = true;
    var ms,
      msTilNext,
      now = new Date().getTime();
    if (this.end) {
      ms = Math.max(0, this.end - now);
      msTilNext = ms % 1000;
      running = ms !== 0;
    } else {
      ms = Math.max(0, now - this.beginning);
      msTilNext = 1000 - (ms % 1000);
    }
    this.seconds = Math.round(ms / 1000);
    this.showTime();
    if (this.end) {
      this.onUpdate(this.setting - this.seconds);
    } else {
      this.onUpdate(this.seconds);
    }

    if (running) window.setTimeout(this.fn, msTilNext);
    else this.stop();
  }
};

TypeJig.Timer.prototype.showTime = function () {
  if (!this.elt) return;
  var m = Math.floor(this.seconds / 60);
  var s = this.seconds % 60;
  if (s < 10) s = "0" + s;
  this.elt.innerHTML = m + ":" + s;
};

// -----------------------------------------------------------------------

TypeJig.Exercise = function (words, seconds, shuffle, select, speed) {
  this.started = false;
  this.words = words;
  this.seconds = seconds;
  this.shuffle = shuffle;
  this.select =
    TypeJig.Exercise.select[select] || TypeJig.Exercise.select.random;

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
  var separator = this.started ? " " : "";
  this.started = true;
  return word ? separator + word : word;
};
