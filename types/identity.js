const isFunction = require('../utilities/isFunction')
const equal = require('../utilities/equal')

const Identity = x => {
  if (!arguments.length) {
    throw new TypeError('Identity: must wrap a value')
  }

  const type = 'Identity'
  const isSameType = equal('Identity')

  const map = f => {
    if (!isFunction(f)) {
      throw new TypeError(`Identity.map: only takes a function`)
    }
    return Identity(f(x))
  }

  const chain = f => {
    const m = f(x)
    if (!isFunction(f)) {
      throw new TypeError(`Identity.chain: only takes a function`)
    }
    if (!isSameType(m.type)) {
      throw new TypeError(`Identity.chain: must return type Identity`)
    }
    return m
  }

  const ap = m => {
    if (!isFunction(x)) {
      throw new TypeError(`Identity.ap: must wrap a function`)
    }
    if (!isSameType(m.type)) {
      throw new TypeError(`Identity.ap: only takes another Identity`)
    }
    return Identity(x(m.x))
  }

  const fold = f => {
    if (!isFunction(f)) {
      throw new TypeError(`Identity.fold: only takes a function`)
    }
    return f(x)
  }

  const inspect = () => `Identity(${x})`

  return { x, type, map, chain, ap, fold, inspect }
}

Identity.of = x => Identity(x)

module.exports = Identity
