var emSymbols = {
	"FR": "!¬↦¡",
	"FP": "\"“”„",
	"FRLG": "#©®™",
	"RPBL": "$¥€£",
	"FRPB": "%‰‱φ",
	"FBG": "&∩∧∈",
	"F": "'‘’‚",
	"FPL": "([<{",
	"RBG": ")}>}",
	"L": "*∏§×",
	"G": "+∑¶±",
	"B": ",∪∨∉",
	"PL": "-−–—",
	"R": ".•·…",
	"RP": "/⇒⇔÷",
	"LG": ":∋∵∴",
	"RB": ";∀∃∄",
	"PBLG": "=≡≈≠",
	"FPB": "?¿∝‽",
	"FRPBLG": "@⊕⊗∅",
	"FB": "\\Δ√∞",
	"RPG": "^«»°",
	"BG": "_≤≥µ",
	"P": "`⊂⊃π",
	"FPBG": "~⊆⊇˜"
}
var emGenerated = {};
var emGeneratedKeyList = [];
variants=["", "E", "U", "EU"];
reps = ["", "S", "T", "TS"];

//Generate all strokes
for(var symStroke in emSymbols){ //Symbol rows / all symbols
	var symbols = emSymbols[symStroke];
	for(var i = 0; i < 4; i++){ //Symbols / symbol rows
		var symbol = symbols[i];
		var variantStroke = variants[i];
		for(var r = 0; r < 4; r++){ //Repeated symbols / Symbols
			var rep = r + 1;
			var repStroke = reps[r];
			var output = "";
			for(var j = 0; j < rep; j++) output += symbol;
			var stroke = "SKWH-"+variantStroke+symStroke+repStroke;
			emGenerated[stroke] = output;
			TypeJig.Translations.Plover[output] = stroke;
			emGeneratedKeyList.push(stroke);
		}
	}
};
console.log(emGenerated);

function generate_exercise(sym_count, rnd) {
	let words = []
	for(var i = 0; i < sym_count; i++){
		var index = Math.floor(emGeneratedKeyList.length * rnd());
		var randomStroke = emGeneratedKeyList[index];
		var randomSymbol = emGenerated[randomStroke];
		words.push(randomSymbol);
	}
	console.log(words);
	return new TypeJig.Exercise(words, 0, false, 'ordered');
}

let jig
window.addEventListener('load', () => jig = loadExercisePage(args => {
	const nwords = args.word_count==null ? 100 : parseInt(args.word_count)
	//console.log(nwords + " symbols");
	console.log("Strokes: ");
	console.log(TypeJig.Translations.Plover);
	return {
		generate: (rnd, options) => generate_exercise(nwords, rnd),
		options: { name: "Emily's Symbol Dictionary" }
	}
}))
