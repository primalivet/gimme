import { pipe } from './function'
import * as P from './parser'
import * as E from './either'

describe('', () => {
  test('', () => {
    const found = pipe("A", P.pchar, P.pure, P.run)("ABC")
    const wanted = E.right(['A', 'BC'])
    expect(found).toStrictEqual(wanted)
  })

  test('', () => {
    const found = pipe("A", P.pchar, P.pure, P.run)("BAC")
    const wanted = E.left(['Expected: A. Got: B'])
    expect(found).toStrictEqual(wanted)
  })
})
