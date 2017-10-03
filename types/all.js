const All = x => ({
  chain: f => f(x),
  concat: ({ x: y }) => All(x && y),
  map: f => All(f(x))
})

All.empty = () => All(true)
All.of = x => All(x)

module.exports = All
