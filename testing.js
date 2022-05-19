const choose = (a, rnd) => a[Math.floor(rnd() * a.length)];

window.onload = function () {
    var fields = parseQueryString(document.location.search);

    if (!fields.seed) {
        fields.seed = "" + Math.random();
        window.history.replaceState(
            "",
            "",
            updateURLParameter(window.location.href, "seed", fields.seed)
        );
    }

    var wordCount =
        fields.word_count == null ? 100 : parseInt(fields.word_count);

    var name = "TESTING";

    var exercise = new TypeJig.Exercise(["test", "test"], 0, false, "ordered");

    var jig = setExercise(name, exercise, null, fields);

    var back = document.getElementById("back");
    var again = document.getElementById("again");
    var end = document.getElementById("end");
    var another = document.getElementById("new");
    var nextSeed = this.prepareNextSeed(another);
    back.href = back.href.replace("short-sentences", "form");
    again.addEventListener("click", function (evt) {
        evt.preventDefault();
        jig.reset();
    });
    end.addEventListener("click", function (evt) {
        evt.preventDefault();
        jig.endExercise();
    });
    another.addEventListener("click", function (evt) {
        evt.preventDefault();
        window.history.replaceState(
            "",
            "",
            updateURLParameter(window.location.href, "seed", nextSeed)
        );
        let exercise = generateExercise(wordCount, PRNG(nextSeed));
        jig.exercise = exercise;
        jig.reset();
        nextSeed = prepareNextSeed(another);
    });
};

setTheme();
