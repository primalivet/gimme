const tap = require('tap')
const { Product } = require('../')

tap.test('identity', t => {
  const found = Product.empty().fold(x => x)
  const wanted = 1

  t.equal(found, wanted)
  t.end()
})

tap.test('associativity law', t => {
  // law: a.concat(b).concat(c) is equivalent to a.concat(b.concat(c))
  const a = Product.of(10)
    .concat(Product.of(5).concat(Product.of(10)))
    .fold(x => x)
  const b = Product.of(10)
    .concat(Product.of(5))
    .concat(Product.of(10))
    .fold(x => x)

  t.equal(a, b)
  t.end()
})
