const Either = {}

const Left = x => ({
  chain: f => f(x),
  fold: (f, g) => f(x),
  map: f => Left(x)
});

const Right = x => ({
  chain: f => f(x),
  fold: (f, g) => g(x),
  map: f => Right(f(x))
});

Either.Left = Left
Either.Right = Right

Eiter.fromNullable = x => (x == null || x == undefined ? Left(x) : Right(x))
Either.of = x => Right(x)

module.exports = Either
