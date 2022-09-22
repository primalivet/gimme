import * as TE from './task-either'

describe('Functor', () => {
  test('fmap: happy path', async () => {
    const found = await TE.fmap((x: number) => x * 2)(TE.pure(10))()
    const wanted = await TE.pure(20)()
    expect(found).toStrictEqual(wanted)
  })

  test('fmap: happy path', async () => {
    const found = await TE.fmap((x: number) => x * 2)(TE.left(10))()
    const wanted = await TE.left(10)()
    expect(found).toStrictEqual(wanted)
  })
})
