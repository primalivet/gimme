import assert from 'node:assert/strict'
import { suite, test } from 'node:test'
import * as T from './tuple.js'

const inc = (x: number) => x + 1
const add = (x: number) => (y: number) => x + y

suite('', () => {
  test('mapFst', () => {
    const found  = T.mapFst(inc)(T.pure(0,0))
    const wanted  = [1,0]

    assert.deepStrictEqual(found,wanted)
  })

  test('mapSnd', () => {
    const found  = T.mapSnd(inc)(T.pure(0,0))
    const wanted  = [0,1]

    assert.deepStrictEqual(found,wanted)
  })

  test('bimap', () => {
    const found  = T.bimap(inc, inc)(T.pure(0,0))
    const wanted  = [1,1]

    assert.deepStrictEqual(found,wanted)
  })

  test('bimap', () => {
    const found  = T.swap(T.pure(1,0))
    const wanted  = [0,1]

    assert.deepStrictEqual(found,wanted)
  })

  test('fst', () => {
    const found  = T.fst(T.pure(1,0))
    const wanted  = 1

    assert.deepStrictEqual(found,wanted)
  })

  test('snd', () => {
    const found  = T.snd(T.pure(1,0))
    const wanted  = 0

    assert.deepStrictEqual(found,wanted)
  })

  test('snd', () => {
    const found  = T.uncurry(add)(T.pure(1,2))
    const wanted  = 3

    assert.deepStrictEqual(found,wanted)
  })
})
