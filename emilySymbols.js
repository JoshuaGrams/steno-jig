var emSymbols = {
	"FPBL": "↑←→↓",
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
var variants=["", "E", "U", "EU"];

//Generate all strokes
for(var symStroke in emSymbols){ //Symbol rows / all symbols
	var symbols = emSymbols[symStroke];
	for(var i = 0; i < 4; i++){ //Symbols / symbol rows
		var symbol = symbols[i];
		var variantStroke = variants[i];
		var stroke = "SKWHAO-"+variantStroke+symStroke;
		emGenerated[stroke] = symbol;
		TypeJig.Translations.Plover[symbol] = stroke;
		emGeneratedKeyList.push(stroke);
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
