import * as T from './tuple'

const inc = (x: number) => x + 1
const add = (x: number) => (y: number) => x + y

describe('', () => {
  test('mapFst', () => {
    const found  = T.mapFst(inc)(T.pure(0,0))
    const wanted  = [1,0]

    expect(found).toStrictEqual(wanted)
  })

  test('mapSnd', () => {
    const found  = T.mapSnd(inc)(T.pure(0,0))
    const wanted  = [0,1]

    expect(found).toStrictEqual(wanted)
  })

  test('bimap', () => {
    const found  = T.bimap(inc, inc)(T.pure(0,0))
    const wanted  = [1,1]

    expect(found).toStrictEqual(wanted)
  })

  test('bimap', () => {
    const found  = T.swap(T.pure(1,0))
    const wanted  = [0,1]

    expect(found).toStrictEqual(wanted)
  })

  test('fst', () => {
    const found  = T.fst(T.pure(1,0))
    const wanted  = 1

    expect(found).toStrictEqual(wanted)
  })

  test('snd', () => {
    const found  = T.snd(T.pure(1,0))
    const wanted  = 0

    expect(found).toStrictEqual(wanted)
  })

  test('snd', () => {
    const found  = T.uncurry(add)(T.pure(1,2))
    const wanted  = 3

    expect(found).toStrictEqual(wanted)
  })
})
