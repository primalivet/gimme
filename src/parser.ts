import * as E from './either'

type Parser<A> = {
  parser: (input: string) => ParseResult<A>
}

type ParseResult<A> = E.Either<[string], [A, string]>

export const pure = <A>(p: (input: string) => ParseResult<A>): Parser<A> => ({
  parser: p,
})

export const run =
  <A>(p: Parser<A>) =>
  (input: string): ParseResult<A> =>
    p.parser(input)

export const pchar =
  <A>(charToMatch: string) =>
  (input: string): ParseResult<A> => {
    if (input.length === 0) {
      return E.left(['Unexpected end of input'])
    } else {
      const first = input[0]
      if (first === charToMatch) {
        const remaining = input.slice(1)
        return E.right([first as A, remaining])
      } else {
        return E.left([`Expected: ${charToMatch}. Got: ${first}`])
      }
    }
  }

export const bind =
  <A, B>(f: (a: A) => Parser<B>) =>
  (p: Parser<A>): Parser<B> => {
    const inner = (input: string) => {
      const result1 = run(p)(input)
      if (E.isLeft(result1)) return result1
      else {
        const p2 = f(result1.value[0])
        const remaining = result1.value[1]
        return run(p2)(remaining)
      }
    }

    return pure(inner)
  }
