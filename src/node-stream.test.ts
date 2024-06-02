import assert from 'node:assert/strict'
import { suite, test, mock } from 'node:test'
import { PassThrough, Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import {
  Map,
  Flat,
  MapAsync,
  sequence,
  sequenceLazy,
  sequenceLazyAsync,
  WritablePromise,
  range,
  Queue,
  QueueMap,
} from './node-stream.js'

suite('range', () => {
  test('should return a range generator with inclusive start and non inclusive end', () => {
    const generator = range(0, 3)
    assert.deepStrictEqual(generator.next(), { done: false, value: 0 })
    assert.deepStrictEqual(generator.next(), { done: false, value: 1 })
    assert.deepStrictEqual(generator.next(), { done: false, value: 2 })
    assert.deepStrictEqual(generator.next(), { done: true, value: undefined })
  })

  test('should return a range generator with inclusive start and end', () => {
    const generator = range(0, 3, true, true)
    assert.deepStrictEqual(generator.next(), { done: false, value: 0 })
    assert.deepStrictEqual(generator.next(), { done: false, value: 1 })
    assert.deepStrictEqual(generator.next(), { done: false, value: 2 })
    assert.deepStrictEqual(generator.next(), { done: false, value: 3 })
    assert.deepStrictEqual(generator.next(), { done: true, value: undefined })
  })

  test('should return a range generator with non inclusive start and inclusive end', () => {
    const generator = range(0, 3, false, true)
    assert.deepStrictEqual(generator.next(), { done: false, value: 1 })
    assert.deepStrictEqual(generator.next(), { done: false, value: 2 })
    assert.deepStrictEqual(generator.next(), { done: false, value: 3 })
    assert.deepStrictEqual(generator.next(), { done: true, value: undefined })
  })

  test('should return a range generator with non inclusive start and end', () => {
    const generator = range(0, 3, false, false)
    assert.deepStrictEqual(generator.next(), { done: false, value: 1 })
    assert.deepStrictEqual(generator.next(), { done: false, value: 2 })
    assert.deepStrictEqual(generator.next(), { done: true, value: undefined })
  })
})

suite('sequence', () => {
  test('should yield one item at the time in sequence', () => {
    const generator = sequence([1, 2])
    assert.deepStrictEqual(generator.next(), { done: false, value: 1 })
    assert.deepStrictEqual(generator.next(), { done: false, value: 2 })
    assert.deepStrictEqual(generator.next(), { done: true, value: undefined })
  })
})

suite('sequenceLazy', () => {
  test('should yield one item at the time in sequence', () => {
    const generator = sequenceLazy([() => 1, () => 2])
    assert.deepStrictEqual(generator.next(), { done: false, value: 1 })
    assert.deepStrictEqual(generator.next(), { done: false, value: 2 })
    assert.deepStrictEqual(generator.next(), { done: true, value: undefined })
  })

  test('should handle error in thunk (stops generator)', () => {
    const generator = sequenceLazy([
      () => 1,
      () => {
        throw new Error('Error in thunk')
      },
      () => 2,
    ])
    assert.deepStrictEqual(generator.next(), { done: false, value: 1 })
    assert.throws(() => generator.next(), new Error('Error in thunk'))
    assert.deepStrictEqual(generator.next(), { done: true, value: undefined })
  })

  test('should handle rejections in Readable stream (stops generator and emits stream error)', (_, done) => {
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
      assert.deepStrictEqual(result, [1])
      assert.deepStrictEqual(err, new Error('Error in thunk'))
      done()
    })
  })
})

suite('sequenceLazyAsync', () => {
  test('should yield one item at the time in sequence', async () => {
    const generator = sequenceLazyAsync([
      () => Promise.resolve(1),
      () => Promise.resolve(2),
      () => Promise.resolve(3),
    ])

    assert.deepStrictEqual(await generator.next(), { done: false, value: 1 })
    assert.deepStrictEqual(await generator.next(), { done: false, value: 2 })
    assert.deepStrictEqual(await generator.next(), { done: false, value: 3 })
    assert.deepStrictEqual(await generator.next(), {
      done: true,
      value: undefined,
    })
  })

  test('should handle rejections in Readable stream (underlying generator stops)', (_, done) => {
    const generator = sequenceLazyAsync([
      () => Promise.resolve(1),
      () => Promise.reject(new Error('Rejection in lazy promise')),
      () => Promise.resolve(2),
    ])
    const source = Readable.from(generator, { objectMode: true })
    const result: number[] = []
    source.on('data', (chunk) => result.push(chunk))
    source.on('error', (err) => {
      assert.deepStrictEqual(result, [1])
      assert.deepStrictEqual(err.message, 'Rejection in lazy promise')
      done()
    })
  })

  test('should handle throws in Readable stream (underlying generator stops)', (_, done) => {
    const generator = sequenceLazyAsync([
      () => Promise.resolve(1),
      () =>
        (async () => {
          throw new Error('Error in lazy promise')
        })(),
      () => Promise.resolve(2),
    ])
    const source = Readable.from(generator, { objectMode: true })
    const result: number[] = []
    source.on('data', (chunk) => result.push(chunk))
    source.on('error', (err) => {
      assert.deepStrictEqual(result, [1])
      assert.deepStrictEqual(err.message, 'Error in lazy promise')
      done()
    })
  })
})

suite('Flat', () => {
  test('should convert Array<T> chunk into T chunk', (_, done) => {
    const source = Readable.from([
      [1, 2, 3],
      [4, 5, 6],
    ])
    const transform = new Flat()

    const result: number[] = []
    transform.on('data', (chunk) => result.push(chunk))

    pipeline(source, transform)

    transform.on('end', () => {
      assert.deepStrictEqual(result, [1, 2, 3, 4, 5, 6])
      done()
    })
  })

  test('should emit error when chunk is not array', (_, done) => {
    const source = Readable.from([[1, 2, 3], 'not-array'])
    const transform = new Flat()

    pipeline(source, transform).catch((err) => {
      assert.deepStrictEqual(
        err,
        new TypeError('Flat: Expected array but recived: string'),
      )
      done()
    })
  })
})

suite('Map', () => {
  test('should apply the transform function over the chunk', (_, done) => {
    const double = (x: number) => x * 2
    const source = Readable.from([1, 2, 3])
    const transform = new Map(double)

    const result: number[] = []
    transform.on('data', (chunk) => result.push(chunk))

    pipeline(source, transform)

    transform.on('end', () => {
      assert.deepStrictEqual(result, [2, 4, 6])
      done()
    })
  })

  test('should emit error from transform function', (_, done) => {
    const throwingFn = () => {
      throw new Error('Error in transform function')
    }
    const source = Readable.from([1, 2, 3])
    const transform = new Map(throwingFn)

    const result: number[] = []
    transform.on('data', (chunk) => result.push(chunk))

    pipeline(source, transform).catch((err) => {
      assert.deepStrictEqual(err, new Error('Error in transform function'))
      done()
    })
  })
})

suite('MapAsync', () => {
  test('should apply the async transform function over the chunk', (_, done) => {
    const doubleAsync = async (x: number) => x * 2
    const source = Readable.from([1, 2, 3])
    const transform = new MapAsync(doubleAsync)

    const result: number[] = []
    transform.on('data', (chunk) => result.push(chunk))

    pipeline(source, transform)

    transform.on('end', () => {
      assert.deepStrictEqual(result, [2, 4, 6])
      done()
    })
  })

  test('should emit errors from throw in transform function', (_, done) => {
    const throwingFn = async () => {
      throw new Error('Error in async transform function')
    }
    const source = Readable.from([1, 2, 3])
    const transform = new MapAsync(throwingFn)

    const result: number[] = []
    transform.on('data', (chunk) => result.push(chunk))

    pipeline(source, transform).catch((err) => {
      assert.deepStrictEqual(
        err,
        new Error('Error in async transform function'),
      )
      done()
    })
  })

  test('should emit errors from rejection in transform function', (_, done) => {
    const throwingFn = () => {
      return new Promise((_, rej) =>
        rej(new Error('Rejection in async transform function')),
      )
    }
    const source = Readable.from([1, 2, 3])
    const transform = new MapAsync(throwingFn)

    const result: number[] = []
    transform.on('data', (chunk) => result.push(chunk))

    pipeline(source, transform).catch((err) => {
      assert.deepStrictEqual(
        err,
        new Error('Rejection in async transform function'),
      )
      done()
    })
  })
})

suite('Queue', () => {
  test('should hold chunks in the queue and release when max queue length is reached', () => {
    const queue = new Queue(3)
    queue.write('1')
    assert.deepStrictEqual(queue.read(1), null)

    queue.write('2')
    assert.deepStrictEqual(queue.read(1), null)

    queue.write('3')
    assert.deepStrictEqual(queue.read(1).toString(), '1')
    assert.deepStrictEqual(queue.read(1).toString(), '2')
    assert.deepStrictEqual(queue.read(1).toString(), '3')
    assert.deepStrictEqual(queue.read(1), null)
  })

  test('should release orphan chunks when stream ends', () => {
    const queue = new Queue(3)
    queue.write('1')
    assert.deepStrictEqual(queue.read(1), null)

    queue.write('2')
    assert.deepStrictEqual(queue.read(1), null)

    queue.end()
    assert.deepStrictEqual(queue.read(1).toString(), '1')
    assert.deepStrictEqual(queue.read(1).toString(), '2')
    assert.deepStrictEqual(queue.read(1), null)
  })
})

suite('QueueMap', () => {
  test('should hold chunks in the queue and apply transform function and release when max queue length is reached', () => {
    const incStrNum = (x: string) => String(Number(x) + 1)
    const queue = new QueueMap(incStrNum, 3)
    queue.write('1')
    assert.deepStrictEqual(queue.read(1), null)

    queue.write('2')
    assert.deepStrictEqual(queue.read(1), null)

    queue.write('3')
    assert.deepStrictEqual(queue.read(1).toString(), '2')
    assert.deepStrictEqual(queue.read(1).toString(), '3')
    assert.deepStrictEqual(queue.read(1).toString(), '4')
    assert.deepStrictEqual(queue.read(1), null)
  })

  test('should apply transform function and release orphan chunks when stream ends', () => {
    const incStrNum = (x: string) => String(Number(x) + 1)
    const queue = new QueueMap(incStrNum, 3)
    queue.write('1')
    assert.deepStrictEqual(queue.read(1), null)

    queue.write('2')
    assert.deepStrictEqual(queue.read(1), null)

    queue.end()
    assert.deepStrictEqual(queue.read(1).toString(), '2')
    assert.deepStrictEqual(queue.read(1).toString(), '3')
    assert.deepStrictEqual(queue.read(1), null)
  })

  test('should emit ettor when transform function throws', () => {
    const error = new Error('Error inside QueueMap transform function')
    const throws = () => {
      throw error
    }
    const queue = new QueueMap(throws, 3)
    queue.write('1')
    assert.deepStrictEqual(queue.read(1), null)

    queue.write('2')
    assert.deepStrictEqual(queue.read(1), null)

    queue.on('error', (err) => {
      assert.deepStrictEqual(err.message, error.message)
      assert.deepStrictEqual(queue.destroyed, true)
    })

    queue.end('3')
  })
})

suite('WritablePromise', () => {
  test('should give the recived chunks to the promise', async () => {
    const mockConnectorFn = async (readable: Readable) => {
      let data = ''
      for await (const chunk of readable) {
        data += chunk.toString()
      }
      return data
    }
    const writablePromise = new WritablePromise(
      mockConnectorFn,
      new PassThrough(),
    )
    writablePromise.write('hello')
    writablePromise.write('world')
    writablePromise.end()
    assert.deepStrictEqual(await writablePromise.promise, 'helloworld')
  })

  test('should handle error inside the promise', (_, done) => {
    const mockThrowingConnectorFnError = new Error('TEST_ERROR_MSG')
    const passthrough = new PassThrough()
    const writablePromise = new WritablePromise(async () => {
      throw mockThrowingConnectorFnError
    }, passthrough)

    const passthroughCloseHandler = mock.fn()
    const passthroughErrorHandler = mock.fn()
    const writablePromiseCloseHandler = mock.fn()
    const writablePromiseErrorHandler = mock.fn()

    passthrough.on('close', passthroughCloseHandler)
    passthrough.on('error', passthroughErrorHandler)
    writablePromise.on('close', writablePromiseCloseHandler)
    writablePromise.on('error', writablePromiseErrorHandler)

    writablePromise.write('hello')
    writablePromise.write('world')

    // Set immidiate to ensure we assert in the "process nextTick"
    setImmediate(async () => {
      assert.deepStrictEqual(passthrough.destroyed, true)
      assert.deepStrictEqual(passthroughCloseHandler.mock.callCount(), 1)
      assert.deepStrictEqual(passthroughErrorHandler.mock.callCount(), 1)
      assert.deepStrictEqual(
        passthroughErrorHandler.mock.calls[0]?.arguments[0].message,
        mockThrowingConnectorFnError.message,
      )

      assert.deepStrictEqual(writablePromise.destroyed, true)
      assert.deepStrictEqual(writablePromiseCloseHandler.mock.callCount(), 1)
      assert.deepStrictEqual(writablePromiseErrorHandler.mock.callCount(), 1)
      assert.deepStrictEqual(
        writablePromiseErrorHandler.mock.calls[0]?.arguments[0],
        mockThrowingConnectorFnError,
      )
      await assert.rejects(
        writablePromise.promise,
        mockThrowingConnectorFnError,
      )
      done()
    })
  })

  test('should handle rejection inside the promise', (_, done) => {
    const rejectionValue = 'TEST_REJECTION'
    const passthrough = new PassThrough()
    const writablePromise = new WritablePromise(
      async () => Promise.reject(rejectionValue),
      passthrough,
    )

    const passthroughCloseHandler = mock.fn()
    const passthroughErrorHandler = mock.fn()
    const writablePromiseCloseHandler = mock.fn()
    const writablePromiseErrorHandler = mock.fn()

    passthrough.on('close', passthroughCloseHandler)
    passthrough.on('error', passthroughErrorHandler)
    writablePromise.on('close', writablePromiseCloseHandler)
    writablePromise.on('error', writablePromiseErrorHandler)

    writablePromise.write('hello')
    writablePromise.write('world')

    // Set immidiate to ensure we assert in the "process nextTick"
    setImmediate(async () => {
      assert.deepStrictEqual(passthrough.destroyed, true)
      assert.deepStrictEqual(passthroughCloseHandler.mock.callCount(), 1)
      assert.deepStrictEqual(passthroughErrorHandler.mock.callCount(), 1)
      assert.deepStrictEqual(
        passthroughErrorHandler.mock.calls[0]?.arguments[0],
        rejectionValue,
      )

      assert.deepStrictEqual(writablePromise.destroyed, true)
      assert.deepStrictEqual(writablePromiseCloseHandler.mock.callCount(), 1)
      assert.deepStrictEqual(writablePromiseErrorHandler.mock.callCount(), 1)
      assert.deepStrictEqual(
        writablePromiseErrorHandler.mock.calls[0]?.arguments[0],
        rejectionValue,
      )
      await assert.rejects(writablePromise.promise, (x) => x === rejectionValue)
      done()
    })
  })
})
