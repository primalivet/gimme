import {
  Transform,
  TransformOptions,
  TransformCallback,
  Readable,
  Writable,
  PassThrough,
} from 'node:stream'

/**
 * @description sequencially yield a range of numbers, controlling start and end
 * inclusion.
 *
 * @example
 * ```ts
 * const generator = range(0,3)
 * console.log(generator.next().value) // 0
 * console.log(generator.next().value) // 1
 * console.log(generator.next().value) //  2
 * ```
 */
export function* range(
  start: number,
  end: number,
  inclusiveStart = true,
  inclusiveEnd = false,
) {
  let count = inclusiveStart ? start : start + 1
  while (count < (inclusiveEnd ? end + 1 : end)) {
    yield count++
  }
}

/**
 * @description sequencially yield an item from an array.
 * Usefull as a source to create a Readable stream.
 *
 * @example Example with Readable stream
 * ```ts
 * const source = Readable.from(sequence([1, 2, 3]))
 * ```
 */
export function* sequence<T>(xs: T[]): Generator<T> {
  for (const x of xs) {
    yield x
  }
}

/**
 * @description sequencially yield an item from an array of thunks
 * Usefull as a source to create a Readable
 *
 * @example Example with Readable stream
 * ```ts
 * const source = Readable.from(sequenceLazy([() => 1, () => 2, () => 3]))
 * ```
 *
 */
export function* sequenceLazy<T>(xs: (() => T)[]): Generator<T> {
  for (const x of xs) {
    yield x()
  }
}

/**
 * @description sequencially yield an item from an array of thunks which return
 * promise. Usefull as a source to create a Readable
 *
 * @example Example with Readable stream
 * ```ts
 * const source = Readable.from(
 *   sequenceLazyAsync([
 *     () => Promise.resolve(1),
 *     () => Promise.resolve(2),
 *     () => Promise.resolve(3),
 *   ]),
 * )
 * ```
 *
 */
export async function* sequenceLazyAsync<T>(
  xs: (() => Promise<T>)[],
): AsyncGenerator<Awaited<T>> {
  for (const x of xs) {
    yield await x()
  }
}

export class Flat extends Transform {
  constructor(options: TransformOptions = {}) {
    super({ ...options, objectMode: true })
  }
  _transform(
    chunk: unknown,
    _: BufferEncoding,
    callback: TransformCallback,
  ): void {
    if (Array.isArray(chunk)) {
      for (const item of chunk) {
        this.push(item)
      }
      callback(null)
    } else {
      callback(
        new TypeError('Flat: Expected array but recived: ' + typeof chunk),
      )
    }
  }
}

export class Map<A, B> extends Transform {
  private fn: (a: A) => B

  constructor(fn: (a: A) => B, options: TransformOptions = {}) {
    super({ ...options, objectMode: true })
    this.fn = fn
  }

  _transform(chunk: A, _: BufferEncoding, callback: TransformCallback): void {
    try {
      const value = this.fn(chunk)
      this.push(value)
      callback(null)
    } catch (err) {
      if (err instanceof Error) callback(err)
      else callback(new Error('Map: Unexpected error'))
    }
  }
}

export class MapAsync<A, B> extends Transform {
  private fn: (a: A) => Promise<B>

  constructor(fn: (a: A) => Promise<B>, options: TransformOptions = {}) {
    super({ ...options, objectMode: true })
    this.fn = fn
  }

  async _transform(
    chunk: A,
    _: BufferEncoding,
    callback: TransformCallback,
  ): Promise<void> {
    try {
      const value = await this.fn(chunk)
      this.push(value)
      callback(null)
    } catch (err) {
      if (err instanceof Error) callback(err)
      else callback(new Error('MapAsync: Unexpected error'))
    }
  }
}

/**
 * @description Queue chunks up until a limit. When the queue size/length is
 * reached, the chunks are pushed along the stream again
 *
 * @example
 * ```ts
 * pipeline(
 *   Readable.from(['a', 'b', 'c', 'd']),
 *   new Queue(2),
 *   createWriteStream('file.txt')
 * )
 */
export class Queue<A> extends Transform {
  private readonly queue: A[]
  private readonly queueMaxLength: number

  constructor(queueMaxLength: number, options: TransformOptions = {}) {
    super(options)
    this.queue = []
    this.queueMaxLength = queueMaxLength
  }

  public get length(): number {
    return this.queue.length
  }

  writeQueued(callback: TransformCallback) {
    while (this.queue.length > 0) {
      this.push(this.queue.shift())
    }
    callback()
  }

  _transform(chunk: A, _: BufferEncoding, callback: TransformCallback) {
    this.queue.push(chunk)
    if (this.queue.length < this.queueMaxLength) {
      callback()
    } else {
      this.writeQueued(callback)
    }
  }

  _flush(callback: TransformCallback) {
    this.writeQueued(callback)
  }
}

/**
 * @description Queue chunks up until a limit while applying the chunk to a
 * function. When the queue size/length is reached, the function is applied to
 * the chunks and the result is pushed along the stream again
 *
 * @example
 * ```ts
 * pipeline(
 *   Readable.from(['a', 'b', 'c', 'd']),
 *   new Queue((str) => str.toUpperCase(), 2),
 *   createWriteStream('file.txt')
 * )
 */
export class QueueMap<A, B> extends Transform {
  private readonly fn: (a: A) => B
  private readonly queue: A[]
  private readonly queueMaxLength: number

  constructor(
    fn: (a: A) => B,
    queueMaxLength: number,
    options: TransformOptions = {},
  ) {
    super(options)
    this.fn = fn
    this.queue = []
    this.queueMaxLength = queueMaxLength
  }

  writeQueued(callback: TransformCallback) {
    try {
    while (this.queue.length > 0) {
      this.push(this.fn(this.queue.shift() as A))
    }
    callback()
    } catch(err) {
      this.destroy(err instanceof Error ? err : new Error('Unexpected error'))
    }
  }

  _transform(chunk: A, _: BufferEncoding, callback: TransformCallback) {
    this.queue.push(chunk)
    if (this.queue.length < this.queueMaxLength) {
      callback()
    } else {
      this.writeQueued(callback)
    }
  }

  _flush(callback: TransformCallback) {
    this.writeQueued(callback)
  }
}

export class WritablePromise<T> extends Writable {
  private readonly passthrough: PassThrough
  public readonly promise: Promise<T>

  constructor(
    connectorFn: (readable: Readable) => Promise<T>,
    passthrough: PassThrough,
    options = {},
  ) {
    super(options)
    this.passthrough = passthrough
    // Pass the passthrough stream to our connector function so that we can
    // stream "into" the connector via the passthrough stream.
    this.promise = connectorFn(this.passthrough)

    this.promise.catch((err) => {
      if (!this.passthrough.destroyed) {
        // The passthrough stream is not destroy, so since the promise failed
        // destroy it and emit the error on the stream
        this.passthrough.destroy(err)
      }
      if (!this.destroyed) {
        // The parent stream is not destroy, so since the promise failed
        // destroy it and emit the error on the stream
        this.destroy(err)
      }
    })
  }

  _write(
    chunk: unknown,
    encoding: BufferEncoding,
    callback: (error?: Error | null) => void,
  ): void {
    if (!this.passthrough.write(chunk, encoding)) {
      // As we wrote to the passthrough stream we get a return value saying if
      // the passthrough stream is above highWaterMark or not.
      // If it is, the return value if false and we have to wait for the drain
      // event before writing to it again.
      this.passthrough.once('drain', callback)
    } else {
      // Wait until the next tick in the event loop and before handling this
      // task/callback. This allows the event loop to proceed with other tasks
      // until the stream has been drained.
      process.nextTick(callback)
    }
  }

  _final(callback: (error?: Error | null) => void): void {
    this.passthrough.end(() => {
      // Make sure we've ended the passthrough stream fully and that the promise
      // have settled before we close the parent stream
      this.promise.then(() => callback())
    })
  }
}
