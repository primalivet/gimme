import * as P from './parser'

describe('', () => {
  test('pchar success', () => {
    const found = P.run(P.pchar("A"))("ABC")
    const wanted = P.success(['A', 'BC'])
    expect(found).toStrictEqual(wanted)
  })

  test('pchar failure', () => {
    const found = P.run(P.pchar("A"))("BAC")
    const wanted = P.failure('Expected: A. Got: B')
    expect(found).toStrictEqual(wanted)
  })

  test('fmap success', () => {
    const lower = (x: string) => x.toLowerCase()
    const found = P.run(P.fmap(lower)(P.pchar("A")))("ABC")
    const wanted = P.success(['a', 'BC'])
    expect(found).toStrictEqual(wanted)
  })

  test('fmap failure', () => {
    const lower = (x: string) => x.toLowerCase()
    const found = P.run(P.fmap(lower)(P.pchar("A")))("BAC")
    const wanted = P.failure('Expected: A. Got: B')
    expect(found).toStrictEqual(wanted)
  })

})
