import { pipeline } from 'node:stream/promises'
import { createWriteStream } from 'node:fs'
import {
  Readable,
} from 'node:stream'
import { Map, Queue, QueueMap } from '../src/node-stream'


interface Printable {
  toString: () => string
}

function toString<T extends Printable>(x: T): string {
  return x.toString()
}

function append(x: string) {
  return function (y: string): string {
    return y + x
  }
}

function stringify(x: unknown): string {
  return JSON.stringify(x)
}

function log(label: string) {
  return function <T>(value: T): T {
    console.log(label, value)
    return value
  }
}

async function* generate(start = 0, end = 10) {
  let counter = start
  while (counter < end) {
    const value = await Promise.resolve({
      value: counter,
    })
    console.log('Yielding, step: ', counter)
    yield value
    counter++
  }
}

async function main() {
  const streams = {
    source: Readable.from(generate(), { objectMode: true }),
    buffer: new Queue(3, { objectMode: true }),
    bufferStringify: new QueueMap(stringify, 3, { objectMode: true }),
    log: (label: string) => new Map(log(label), { objectMode: true }),
    toString: new Map<Record<PropertyKey, string>, string>(toString),
    stringify: new Map<string, string>(stringify),
    appendNewLine: new Map<string, string>(append('\n')),
    appendFile: createWriteStream('node-stream-test-file.txt'),
  }

  try {
    const result = await pipeline(
      streams.source,
      // streams.log('After source'),
      streams.bufferStringify,
      streams.log('After buffer stringify'),
      // streams.buffer,
      // streams.log('After buffer'),
      // streams.stringify,
      // streams.log('After stringify'),
      // streams.appendNewLine,
      // streams.log('After append new line'),
      streams.appendFile,
    )
    console.log(result)
  } catch (err) {
    console.error('Caught error in stream', err)
  }
}

main()
