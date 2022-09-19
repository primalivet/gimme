import * as F from './function'

const f = (x: number) => x + 1
const mult = (x: number) => (y: number) => x * y
const add = (x: number) => (y: number) => x + y

describe('pipe', () => {
  test('composes left to right', () => {
    const found = F.pipe(50, mult(2), add(1))
    const wanted = 101

    expect(found).toBe(wanted)
  })

  test('pipe 1', () => {
    const found = F.pipe(0, f)
    const wanted = 1
    expect(found).toBe(wanted)
  })

  test('pipe 2', () => {
    const found = F.pipe(0, f, f)
    const wanted = 2
    expect(found).toBe(wanted)
  })

  test('pipe 3', () => {
    const found = F.pipe(0, f, f, f)
    const wanted = 3
    expect(found).toBe(wanted)
  })

  test('pipe 4', () => {
    const found = F.pipe(0, f, f, f, f)
    const wanted = 4
    expect(found).toBe(wanted)
  })

  test('pipe 5', () => {
    const found = F.pipe(0, f, f, f, f, f)
    const wanted = 5
    expect(found).toBe(wanted)
  })

  test('pipe 6', () => {
    const found = F.pipe(0, f, f, f, f, f, f)
    const wanted = 6
    expect(found).toBe(wanted)
  })

  test('pipe 7', () => {
    const found = F.pipe(0, f, f, f, f, f, f, f)
    const wanted = 7
    expect(found).toBe(wanted)
  })

  test('pipe 8', () => {
    const found = F.pipe(0, f, f, f, f, f, f, f, f)
    const wanted = 8
    expect(found).toBe(wanted)
  })

  test('pipe 9', () => {
    const found = F.pipe(0, f, f, f, f, f, f, f, f, f)
    const wanted = 9
    expect(found).toBe(wanted)
  })

  test('pipe 10', () => {
    const found = F.pipe(0, f, f, f, f, f, f, f, f, f, f)
    const wanted = 10
    expect(found).toBe(wanted)
  })

  test('pipe 11', () => {
    const found = F.pipe(0, f, f, f, f, f, f, f, f, f, f, f)
    const wanted = 11
    expect(found).toBe(wanted)
  })
})

describe('flow', () => {
  test('composes left to right', () => {
    const found = F.flow(mult(2), add(1))(50)
    const wanted = 101

    expect(found).toBe(wanted)
  })

  test('flow 1', () => {
    const found = F.flow(f)(0)
    const wanted = 1
    expect(found).toBe(wanted)
  })

  test('flow 2', () => {
    const found = F.flow(f, f)(0)
    const wanted = 2
    expect(found).toBe(wanted)
  })
  test('flow 3', () => {
    const found = F.flow(f, f, f)(0)
    const wanted = 3
    expect(found).toBe(wanted)
  })

  test('flow 4', () => {
    const found = F.flow(f, f, f, f)(0)
    const wanted = 4
    expect(found).toBe(wanted)
  })

  test('flow 5', () => {
    const found = F.flow(f, f, f, f, f)(0)
    const wanted = 5
    expect(found).toBe(wanted)
  })

  test('flow 6', () => {
    const found = F.flow(f, f, f, f, f, f)(0)
    const wanted = 6
    expect(found).toBe(wanted)
  })

  test('flow 7', () => {
    const found = F.flow(f, f, f, f, f, f, f)(0)
    const wanted = 7
    expect(found).toBe(wanted)
  })

  test('flow 8', () => {
    const found = F.flow(f, f, f, f, f, f, f, f)(0)
    const wanted = 8
    expect(found).toBe(wanted)
  })

  test('flow 9', () => {
    const found = F.flow(f, f, f, f, f, f, f, f, f)(0)
    const wanted = 9
    expect(found).toBe(wanted)
  })

  test('flow 10', () => {
    const found = F.flow(f, f, f, f, f, f, f, f, f, f)(0)
    const wanted = 10
    expect(found).toBe(wanted)
  })

  test('flow 11', () => {
    const found = F.flow(f, f, f, f, f, f, f, f, f, f, f)(0)
    const wanted = 11
    expect(found).toBe(wanted)
  })
})

describe('compose', () => {
  test('composes left to right', () => {
    const found = F.compose(mult(2), add(1))(50)
    const wanted = 102

    expect(found).toBe(wanted)
  })
  test('compose 2', () => {
    const found = F.compose(f, f)(0)
    const wanted = 2
    expect(found).toBe(wanted)
  })

  test('compose 3', () => {
    const found = F.compose3(f, f, f)(0)
    const wanted = 3
    expect(found).toBe(wanted)
  })

  test('compose 4', () => {
    const found = F.compose4(f, f, f, f)(0)
    const wanted = 4
    expect(found).toBe(wanted)
  })

  test('compose 5', () => {
    const found = F.compose5(f, f, f, f, f)(0)
    const wanted = 5
    expect(found).toBe(wanted)
  })

  test('compose 6', () => {
    const found = F.compose6(f, f, f, f, f, f)(0)
    const wanted = 6
    expect(found).toBe(wanted)
  })

  test('compose 7', () => {
    const found = F.compose7(f, f, f, f, f, f, f)(0)
    const wanted = 7
    expect(found).toBe(wanted)
  })

  test('compose 8', () => {
    const found = F.compose8(f, f, f, f, f, f, f, f)(0)
    const wanted = 8
    expect(found).toBe(wanted)
  })

  test('compose 9', () => {
    const found = F.compose9(f, f, f, f, f, f, f, f, f)(0)
    const wanted = 9
    expect(found).toBe(wanted)
  })

  test('compose 10', () => {
    const found = F.compose10(f, f, f, f, f, f, f, f, f, f)(0)
    const wanted = 10
    expect(found).toBe(wanted)
  })

  test('compose 11', () => {
    const found = F.compose11(f, f, f, f, f, f, f, f, f, f, f)(0)
    const wanted = 11
    expect(found).toBe(wanted)
  })
})
