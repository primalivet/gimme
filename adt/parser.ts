export type Parser<A> = {
  parserFn: (input: string) => ParseResult<A>;
};
type Success<A> = { tag: "Success"; value: [A, string] };
type Failure = { tag: "Failure"; value: string };
type ParseResult<A> = Success<A> | Failure;

export const success = <A>([parsed, remaining]: [A, string]): Success<A> => ({
  tag: "Success",
  value: [parsed, remaining],
});
export const failure = (reason: string): Failure => ({
  tag: "Failure",
  value: reason,
});

export const isSuccess = <A>(result: ParseResult<A>): result is Success<A> =>
  result.tag === "Success";
export const isFailure = <A>(result: ParseResult<A>): result is Failure =>
  result.tag === "Failure";

export const run = <A>(p: Parser<A>) => (input: string): ParseResult<A> =>
  p.parserFn(input);

export const pure = <A>(x: A): Parser<A> => ({
  parserFn: (input: string) => success([x, input]),
});

export const pchar = (charToMatch: string): Parser<string> => {
  const inner = (input: string): ParseResult<string> => {
    if (input.length === 0) {
      return failure("Unexpected end of input");
    } else {
      const first = input[0];
      if (first === charToMatch) {
        const remaining = input.slice(1);
        return success([first, remaining]);
      } else {
        return failure(`Expected: ${charToMatch}. Got: ${first}`);
      }
    }
  };

  return { parserFn: inner };
};

export const bind =
  <A, B>(f: (a: A) => Parser<B>) => (p: Parser<A>): Parser<B> => {
    const inner = (input: string) => {
      const result1 = run(p)(input);
      if (isFailure(result1)) {
        return result1;
      } else {
        const p2 = f(result1.value[0]);
        const remaining = result1.value[1];
        return run(p2)(remaining);
      }
    };

    return {
      parserFn: inner,
    };
  };

export const fmap = <A, B>(f: (a: A) => B) => (p: Parser<A>): Parser<B> =>
  bind((a: A) => pure(f(a)))(p);
