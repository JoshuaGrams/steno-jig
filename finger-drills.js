function addSet(strokes, iterations, drill) {
    if (drill == null) drill = [];
    strokes = strokes.split("/");
    if (drill.length === 0) {
        drill.push.apply(drill, strokes);
        --iterations;
    }
    strokes[0] = "\n" + strokes[0];
    for (let i = 0; i < iterations; ++i) {
        drill.push.apply(drill, strokes);
    }
    drill.push(strokes[0]);
    return drill;
}

function generateFingerDrill(drills, iterations, name) {
    let out = [];
    for (const drill of drills) addSet(drill, iterations, out);
    var exercise = new TypeJig.Exercise(out, 0, false, "ordered");
    if (name) exercise.name = name;
    else exercise.name = "Finger Drill: " + drills.join(" ");
    return exercise;
}

function generateDreadedDuoDrill(section, drill, iterations) {
    let n = dreadedDuo[section - 1].length;
    let name = "Da Dreaded Dueling Digit Duo Drills";
    name += " (Section " + section + ", #" + drill + " of " + n + ")";
    let drills = [dreadedDuo[section - 1][drill - 1]];
    let exercise = generateFingerDrill(drills, iterations, name);
    return exercise;
}

function linkNextDrill(link, fields, updateFields) {
    var section = fields.section,
        drill = fields.drill;
    if (drill === dreadedDuo[section - 1].length) {
        drill = 1;
        if (section === dreadedDuo.length) section = 1;
        else ++section;
    } else ++drill;
    let url = updateURLParameter(window.location.href, "section", section);
    url = updateURLParameter(url, "drill", drill);
    link.href = url;
    if (updateFields) {
        fields.section = section;
        fields.drill = drill;
    }
}

window.onload = function () {
    var fields = parseQueryString(document.location.search);
    fields.iterations = fields.iterations || 20;
    fields.actualWords = { unit: "strokes per minute", u: "SPM" };

    let exercise;
    if (fields.strokes) {
        const drills = fields.strokes.split(/\s+/);
        exercise = generateFingerDrill(drills, fields.iterations);
    } else if (fields.book === "Stenotype Finger Technique") {
        let name = fields.book + ": " + fields.section;
        const drills = stenotypeFingerTechnique[fields.section];
        exercise = generateFingerDrill(drills, fields.iterations, name);
    } else {
        fields.section = Math.max(
            1,
            Math.min(fields.section || 1, dreadedDuo.length)
        );
        fields.drill = Math.max(
            1,
            Math.min(fields.drill || 1, dreadedDuo[fields.section - 1].length)
        );
        exercise = generateDreadedDuoDrill(
            fields.section,
            fields.drill,
            fields.iterations
        );
    }

    var jig = setExercise(exercise.name, exercise, null, fields);

    var back = document.getElementById("back");
    var again = document.getElementById("again");
    var end = document.getElementById("end");
    var next = document.getElementById("new");
    if (fields.strokes || fields.book) next.parentNode.removeChild(next);
    else linkNextDrill(next, fields);
    back.href = back.href.replace("finger-drills", "form");
    again.addEventListener("click", function (evt) {
        evt.preventDefault();
        jig.reset();
    });
    end.addEventListener("click", function (evt) {
        evt.preventDefault();
        jig.endExercise();
    });
};

setTheme();
