const request = require('request')
const Task = require('data.task')
const { IO, Either, map, chain, compose, trace } = require('./')

// httpGet :: String -> Task Error String
const http = {
  get: url =>
    new Task((reject, resolve) => {
      request(url, (error, response, body) => {
        if (error && response.statusCode !== 200) reject(error)
        else resolve(body)
      })
    }),
  post: () => false
}

// eitherToTask :: Either a b  -> Task a b
const eitherToTask = e => e.fold(Task.rejected, Task.of)

// parse :: String -> Either Error Json
const parse = x => Either.tryCatch(JSON.parse)(x)

// get :: String -> Task Error Json
const get = compose(chain(eitherToTask), map(parse), http.get)

// head :: [a] => a
const head = xs => xs[0]

/**
 * callers
 */

get('https://jsonplaceholder.typicode.com/posts').fork(
  e => console.log('error', e),
  s => console.log('success', s)
)

const r = IO.of(process.argv)
  .map(head)
  .run()

console.log(r)
