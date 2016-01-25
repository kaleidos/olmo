# Olmo #

This is an attempt to port the core ideas of *The Elm Architecture* to a JavaScript library. Although our goal is to develop a real-world application with it, we don't plan in releasing Olmo as a "yet another..." but sure keeping it up to date so you can use it as a starting point if you find it useful.

## Why? ##

* We find Elm's architecture more easy to follow than [Redux's](https://github.com/rackt/redux/).
* There's a standarized interface for effects.
* Rendering is no different and is treated as an effect. Actually Olmo don't take any action in which library it uses for rendering, that's your app's decision.
* Although we think [CycleJS](http://cycle.js.org/) is awesome, we found that break a Cycle app as a main function into subcomponents might be kind of difficult, at least for us, and Cycle don't take any explicit action in that direction to guide us.

## Examples ##

Run any example with `npm run ex<number of the example>`, eg: `npm run ex1`

1. [Simple counter](https://github.com/kaleidos/olmo/blob/master/examples/01-counter)

2. [Simple pair of counters](https://github.com/kaleidos/olmo/blob/master/examples/02-counter-pair)

3. [List of counters](https://github.com/kaleidos/olmo/blob/master/examples/03-list-of-counters)

## Testing ##

Run `npm test` or `npm run test:watch`.
