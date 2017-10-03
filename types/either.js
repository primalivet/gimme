const Left = x => ({
  chain: f => f(x),
  map: f => Left(x),
  fold: (f, g) => f(x)
});

const Right = x => ({
  chain: f => f(x),
  map: f => Right(f(x)),
  fold: (f, g) => g(x)
});

const fromNullable = x => (x == null || x == undefined ? Left(x) : Right(x))

module.exports = { Left, Right, fromNullable }
