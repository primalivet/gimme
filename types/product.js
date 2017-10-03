const Product = x => ({
  x,
  chain: f => f(x),
  concat: ({ x: y }) => Product(x * y),
  map: f => Product(f(x))
})

Product.of = x => Product(x)
Product.empty = Product(1)

module.exports = Product
