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
window.onload = function () {
    var fields = parseQueryString(document.location.search)

    var rng = new_rng(fields.seed)

    var top_n = fields.top == null ? 100 : parseInt(fields.top)
    // round up
    top_n = Math.floor((top_n + 99) / 100) * 100
    if (top_n < 100) {
        top_n = 100
    }
    if (top_n > 8000) {
        top_n = 8000
    }

    var word_count = fields.word_count == null ? 100 : parseInt(fields.word_count)

    var name = "Sentences from Project Gutenberg that contain only the top " + top_n + " words.";
    var hints = null;

    if (fields.hints) {
        var strokes = document.getElementById('strokes');
        if (fields.floating_hints) {
            strokes.style.position = 'fixed';
        }
        var translations = TypeJig.shortestTranslations(TypeJig.Translations.Plover);
        hints = new StenoDisplay(strokes, translations, true);
    }

    let words = [], sentence, i
    let chars_left = word_count * 5
    let top_n_bucket = window.sentences_by_top_100[top_n / 100 - 1]
    while (chars_left > 0) {
        sentence = top_n_bucket[Math.floor(rng() * top_n_bucket.length)]
        chars_left -= sentence.length
        words.splice(0, 0, ...sentence.split(' '))
    }

    var exercise = new TypeJig.Exercise(words, 0, false, 'ordered');

    var new_drill = document.getElementById('new');
    new_drill.href = document.location.href.toString().replace(/seed=([^&#]*)/, 'seed=' + Math.random().toString());

    setExercise(name, exercise, hints);
    back.href = back.href.replace('gutenberg', 'form');
}

setTheme()
