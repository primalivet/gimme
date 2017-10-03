const Any = x => ({
  chain: f => f(x),
  concat: ({ x: y }) => Any(x || y),
  map: f => Any(f(x))
})

Any.empty = () => Any(true)
Any.of = x => Any(x)

module.exports = Any
