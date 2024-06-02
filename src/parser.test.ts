import assert from 'node:assert/strict'
import { suite, test } from 'node:test'
import * as P from './parser.js'

suite('', () => {
  test('pchar success', () => {
    const found = P.run(P.pchar('A'))('ABC')
    const wanted = P.success(['A', 'BC'])
    assert.deepStrictEqual(found, wanted)
  })

  test('pchar failure', () => {
    const found = P.run(P.pchar('A'))('BAC')
    const wanted = P.failure('Expected: A. Got: B')
    assert.deepStrictEqual(found, wanted)
  })

  test('fmap success', () => {
    const lower = (x: string) => x.toLowerCase()
    const found = P.run(P.fmap(lower)(P.pchar('A')))('ABC')
    const wanted = P.success(['a', 'BC'])
    assert.deepStrictEqual(found, wanted)
  })

  test('fmap failure', () => {
    const lower = (x: string) => x.toLowerCase()
    const found = P.run(P.fmap(lower)(P.pchar('A')))('BAC')
    const wanted = P.failure('Expected: A. Got: B')
    assert.deepStrictEqual(found, wanted)
  })
})
