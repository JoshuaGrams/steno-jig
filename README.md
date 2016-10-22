Steno Jig
=========

This is a little browser-based widget for typing drills. I'm using
it to teach myself stenotype. It's still early in development, but
you may find it useful and/or fun.

`index.html` has the basic structure you need to use it: for basic
exercises you can pass an array of strings (each of which *must*
be a single word with no leading or trailing whitespace or the
answer matching won't work).

If the words represent a static text (i.e. a sequence of words in
a particular order), that's all you need. If you want to set a
time limit, you can also pass a number of seconds. If you pass
`true` as the third argument, the words will be randomized and
recycled until the time runs out.

I have a bunch of existing word sets in `word-sets.js`. One of
these sets is the New General Service List: 2800 root words in
common use, aimed at ESL students. It's organized as a set of root
words with variations, so I've kept it that way, and set the code
up so that each entry can be an array of words instead of just a
single word. In this case, it will randomly shuffle the entries,
and then randomly choose from the words in the current entry. But
you could also flatten the array first with `TypeJig.flattenWordSet`.

There are also a bunch of translations in `plover-translations.js` so it
can display hints for the next word. Many words have more than one set
of legitimate strokes, and it will show all of them unless you filter
the given options with `TypeJig.longestTranslations` or
`TypeJig.shortestTranslations`.

-----

`numbers.html` has a more complex example which overrides the
exercise's `nextWord` function to generate a sentence at a time
and spit out random sentences with lots of numbers in them.
