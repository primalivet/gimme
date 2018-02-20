const Either = {}

const Left = x => ({
  chain: f => Left(x),
  fold: (f, g) => f(x),
  map: f => Left(x),
  ap: O => Left(x),
  inspect: () => `Left(${x})`
})

const Right = x => ({
  x,
  chain: f => f(x),
  fold: (f, g) => g(x),
  map: f => Right(f(x)),
  ap: ({ x: y }) => Right(x(y)),
  inspect: () => `Right(${x})`
})

Either.Left = Left
Either.Right = Right

Either.of = x => Right(x)
Either.fromNullable = x => (x === null || x === undefined ? Left(x) : Right(x))

module.exports = Either
