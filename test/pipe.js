const tap = require('tap')
const { pipe } = require('../')

const double = x => x * 2
const square = x => x * x
const found = pipe(square, double)(2)
const wanted = 8

tap.equal(found, wanted)
