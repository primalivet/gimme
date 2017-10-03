const Sum = x => ({
  x,
  chain: f => f(x),
  concat: ({ x: y }) => Sum(x + y),
  map: f => Sum(f(x)),
})

Sum.empty = Sum(0)
Sum.of = x => Sum(x)

module.exports = Sum
