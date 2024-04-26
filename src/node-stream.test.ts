import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import {
  Map,
  Flat,
  MapAsync,
  sequence,
  sequenceLazy,
  sequenceLazyAsync,
} from './node-stream'

describe('Node stream', () => {
  describe('sequence', () => {
    test('should yield one item at the time in sequence', () => {
      const generator = sequence([1, 2])
      expect(generator.next()).toEqual({ done: false, value: 1 })
      expect(generator.next()).toEqual({ done: false, value: 2 })
      expect(generator.next()).toEqual({ done: true, value: undefined })
    })
  })

  describe('sequenceLazy', () => {
    test('should yield one item at the time in sequence', () => {
      const generator = sequenceLazy([() => 1, () => 2])
      expect(generator.next()).toEqual({ done: false, value: 1 })
      expect(generator.next()).toEqual({ done: false, value: 2 })
      expect(generator.next()).toEqual({ done: true, value: undefined })
    })

    test('should handle error in thunk (stops generator)', () => {
      const generator = sequenceLazy([
        () => 1,
        () => {
          throw new Error('Error in thunk')
        },
        () => 2,
      ])
      expect(generator.next()).toEqual({ done: false, value: 1 })
      expect(() => generator.next()).toThrowError(new Error('Error in thunk'))
      expect(generator.next()).toEqual({ done: true, value: undefined })
    })

    test('should handle rejections in Readable stream (stops generator and emits stream error)', (done) => {
      const generator = sequenceLazy([
        () => 1,
        () => {
          throw new Error('Error in thunk')
        },
        () => 2,
      ])

      const source = Readable.from(generator, { objectMode: true })
      const result: number[] = []
      source.on('data', (chunk) => result.push(chunk))
      source.on('error', (err) => {
        expect(result).toEqual([1])
        expect(err).toEqual(new Error('Error in thunk'))
        done()
      })
    })
  })

  describe('sequenceLazyAsync', () => {
    test('should yield one item at the time in sequence', async () => {
      const generator = sequenceLazyAsync([
        () => new Promise((res) => setTimeout(() => res(1), 300)),
        () => new Promise((res) => setTimeout(() => res(2), 300)),
        () => new Promise((res) => setTimeout(() => res(3), 300)),
      ])
      expect(await generator.next()).toEqual({ done: false, value: 1 })
      expect(await generator.next()).toEqual({ done: false, value: 2 })
      expect(await generator.next()).toEqual({ done: false, value: 3 })
      expect(await generator.next()).toEqual({ done: true, value: undefined })
    })

    test('should handle rejections in Readable stream (underlying generator stops)', (done) => {
      const generator = sequenceLazyAsync([
        () => new Promise((res) => setTimeout(() => res(1), 300)),
        () =>
          new Promise((_, rej) =>
            setTimeout(() => rej(new Error('Rejection in lazy promise')), 300),
          ),
        () => new Promise((res) => setTimeout(() => res(2), 300)),
      ])
      const source = Readable.from(generator, { objectMode: true })
      const result: number[] = []
      source.on('data', (chunk) => result.push(chunk))
      source.on('error', (err) => {
        expect(result).toEqual([1])
        expect(err.message).toEqual('Rejection in lazy promise')
        done()
      })
    })
  })

  test('should handle throws in Readable stream (underlying generator stops)', (done) => {
    const generator = sequenceLazyAsync([
      () => new Promise((res) => setTimeout(() => res(1), 300)),
      () =>
        (async () => {
          const delayedError = await new Promise((res) =>
            setTimeout(() => res(new Error('Error in lazy promise')), 300),
          )
          throw delayedError
        })(),
      () => new Promise((res) => setTimeout(() => res(2), 300)),
    ])
    const source = Readable.from(generator, { objectMode: true })
    const result: number[] = []
    source.on('data', (chunk) => result.push(chunk))
    source.on('error', (err) => {
      expect(result).toEqual([1])
      expect(err.message).toEqual('Error in lazy promise')
      done()
    })
  })

  describe('Flat', () => {
    test('should convert Array<T> chunk into T chunk', (done) => {
      const source = Readable.from([
        [1, 2, 3],
        [4, 5, 6],
      ])
      const transform = new Flat()

      const result: number[] = []
      transform.on('data', (chunk) => result.push(chunk))

      pipeline(source, transform)

      transform.on('end', () => {
        expect(result).toEqual([1, 2, 3, 4, 5, 6])
        done()
      })
    })

    test('should emit error when chunk is not array', (done) => {
      const source = Readable.from([[1, 2, 3], 'not-array'])
      const transform = new Flat()

      pipeline(source, transform).catch((err) => {
        expect(err).toEqual(
          new TypeError('Flat: Expected array but recived: string'),
        )
        done()
      })
    })
  })

  describe('Map', () => {
    test('should apply the transform function over the chunk', (done) => {
      const double = (x: number) => x * 2
      const source = Readable.from([1, 2, 3])
      const transform = new Map(double)

      const result: number[] = []
      transform.on('data', (chunk) => result.push(chunk))

      pipeline(source, transform)

      transform.on('end', () => {
        expect(result).toEqual([2, 4, 6])
        done()
      })
    })

    test('should emit error from transform function', (done) => {
      const throwingFn = () => {
        throw new Error('Error in transform function')
      }
      const source = Readable.from([1, 2, 3])
      const transform = new Map(throwingFn)

      const result: number[] = []
      transform.on('data', (chunk) => result.push(chunk))

      pipeline(source, transform).catch((err) => {
        expect(err).toEqual(new Error('Error in transform function'))
        done()
      })
    })
  })

  describe('MapAsync', () => {
    test('should apply the async transform function over the chunk', (done) => {
      const doubleAsync = async (x: number) => x * 2
      const source = Readable.from([1, 2, 3])
      const transform = new MapAsync(doubleAsync)

      const result: number[] = []
      transform.on('data', (chunk) => result.push(chunk))

      pipeline(source, transform)

      transform.on('end', () => {
        expect(result).toEqual([2, 4, 6])
        done()
      })
    })

    test('should emit errors from throw in transform function', (done) => {
      const throwingFn = async () => {
        throw new Error('Error in async transform function')
      }
      const source = Readable.from([1, 2, 3])
      const transform = new MapAsync(throwingFn)

      const result: number[] = []
      transform.on('data', (chunk) => result.push(chunk))

      pipeline(source, transform).catch((err) => {
        expect(err).toEqual(new Error('Error in async transform function'))
        done()
      })
    })

    test('should emit errors from rejection in transform function', (done) => {
      const throwingFn = () => {
        return new Promise((_,rej) => setTimeout(() => rej(new Error("Rejection in async transform function")),300))
      }
      const source = Readable.from([1, 2, 3])
      const transform = new MapAsync(throwingFn)

      const result: number[] = []
      transform.on('data', (chunk) => result.push(chunk))

      pipeline(source, transform).catch((err) => {
        expect(err).toEqual(new Error('Rejection in async transform function'))
        done()
      })
    })
  })

  // describe.skip('WritablePromise', () => {
  //   const mockConnectorFn = async (readable: Readable) => {
  //     let data = ''
  //     for await (const chunk of readable) {
  //       data += chunk.toString()
  //     }
  //     return data
  //   }
  //
  //   const mockThrowingConnectorFn = async (_: Readable) => {
  //     setTimeout(() => {
  //       throw new Error('Error from mockThrowingConnectorFn')
  //     }, 500)
  //   }
  //
  //   test('should handle data correctly and resolve the promise', async () => {
  //     const writablePromise = new WritablePromise(
  //       mockConnectorFn,
  //       new PassThrough(),
  //     )
  //     writablePromise.write('hello')
  //     writablePromise.write('world')
  //     writablePromise.end()
  //
  //     await expect(writablePromise.promise).resolves.toEqual('helloworld')
  //   })
  //
  //   test('should handle error inside the promise', async () => {
  //     const writablePromise = new WritablePromise(
  //       mockThrowingConnectorFn,
  //       new PassThrough(),
  //     )
  //     writablePromise.write('hello')
  //     writablePromise.write('world')
  //     writablePromise.end()
  //
  //     await expect(writablePromise.promise).rejects.toEqual('helloworld')
  //   })
  // })
})
