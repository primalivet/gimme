const Maybe = {}

const Nothing = () => ({
  isNothing: () => true,
  isJust: () => false,
  chain: f => Nothing(),
  map: f => Nothing(),
  concat: O => Nothing(),
  ap: O => Nothing(),
  getOrElse: y => y,
  inspect: () => `Nothing()`
})

const Just = x => ({
  x,
  isNothing: () => false,
  isJust: () => true,
  chain: f => f(x),
  map: f => Just(f(x)),
  concat: ({ x: y }) => Just(x.concat(y)),
  ap: ({ x: y }) => Just(x(y)),
  getOrElse: y => x,
  inspect: () => `Just(${x})`
})

Maybe.Nothing = Nothing
Maybe.Just = Just

Maybe.of = x => Just(x)
/* eslint-disable eqeqeq */
Maybe.fromFalsy = x =>
  x == false || isNaN(x) || x == null || x == undefined ? Nothing() : Just(x)
/* eslint-enable eqeqeq */
Maybe.fromNullable = x => (x === null || x === undefined ? Nothing() : Just(x))

module.exports = Maybe
