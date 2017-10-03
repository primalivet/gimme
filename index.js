const compose = require('./utilities/compose')
const curry = require('./utilities/curry')
const pipe = require('./utilities/pipe')

const All = require('./types/all')
const Any = require('./types/any')
const Either = require('./types/either')
const Product = require('./types/product')
const Sum = require('./types/sum')

module.exports = {
  compose,
  curry,
  pipe,
  All,
  Any,
  Either,
  Product,
  Sum
}
