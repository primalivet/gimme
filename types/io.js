const isFunction = require('../utilities/isFunction')
const equal = require('../utilities/equal')

const IO = run => {
  if (!arguments.length) {
    throw new TypeError('Identity: must wrap a value')
  }

  const type = 'IO'
  const isSameType = equal('IO')

  const map = f => {
    if (!isFunction(f)) {
      throw new TypeError(`IO.map: only takes a function`)
    }
    return IO(() => f(run()))
  }

  const chain = f => {
    const m = f(run())
    if (!isFunction(f)) {
      throw new TypeError(`IO.chain: only takes a function`)
    } else if (!isSameType(m.type)) {
      throw new TypeError(`IO.chain: must return type IO`)
    }

    return IO(() => m.run())

    // WORKS
    // return IO(() => f(run()).run())
  }

  const ap = m => {
    if (!isFunction(run())) {
      throw new TypeError(`IO.ap: must wrap a function`)
    } else if (!isSameType(m.type)) {
      throw new TypeError(`IO.ap: only takes another IO`)
    }
    return IO(() => run()(m.run()))
  }

  const inspect = () => `IO(${run()})`

  return { run, type, map, chain, ap, inspect }
}

IO.of = x => IO(() => x)

module.exports = IO
