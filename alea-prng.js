// Alea PRNG by Johannes Baagøe
//
// Copyright (C) 2010 by Johannes Baagøe <baagoe@baagoe.org>
//
// Ported 2022-02-08 by Joshua Grams <himself@joshgrams.com>
//
// http://baagoe.com/en/RandomMusings/javascript/
// https://github.com/nquinlan/better-random-numbers-for-javascript-mirror
//
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
// BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

function PRNG(seed) {
	if(seed == null) seed = ''+Math.random()

	// Hash function for initializing state from the seed
	let n = 0xefc8249d;
	function mash(data) {
		for(let i=0; i<data.length; i++) {
			n += data.charCodeAt(i)
			let h = 0.02519603282416938 * n
			n = h|0;  h = (h-n) * n
			n = h|0;  h = (h-n) * 0x100000000 // 2^32
			n += h
		}
		return (n|0) * 2.3283064365386963e-10; // 2^-32
	}

	const s = [mash(' '), mash(' '), mash(' '), 1]
	s[0] -= mash(''+seed)
	if(s[0] < 0) s[0] += 1
	s[1] -= mash(''+seed)
	if(s[1] < 0) s[1] += 1
	s[2] -= mash(''+seed)
	if(s[2] < 0) s[2] += 1

	// Return a random number in the range [0..1)
	// Pass `true` to get a copy of the current state.
	// Pass a state array to set the state.
	return function(save) {
		if(save === true) return [...s]
		if(Array.isArray(save)) return save.forEach((e,i) => s[i]=e)
		const t = 2091639 * s[0] + s[3] * 2.3283064365386963e-10; // 2^-32
		s[0] = s[1]; s[1] = s[2]  // shift over
		s[3] = t|0  // truncate t to integer
		s[2] = t - s[3]  // fractional part
		return s[2]
	}
}
