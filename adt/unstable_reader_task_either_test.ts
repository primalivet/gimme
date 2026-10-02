import { assertEquals } from "@std/assert";
import { pipe } from "@gimme/base/pipe";
import * as TE from "@gimme/adt/task-either";
import {
  ask,
  asks,
  bind,
  map,
  type ReaderTaskEither,
  run,
} from "@gimme/adt/unstable-reader-task-either";

type Env = { base: number; seen: string[] };

// Each step records that it was given the env, so a run leaves a trace
// of which steps actually executed and what env they received.
const start: ReaderTaskEither<string, number, Env> = (env) => {
  env.seen.push("start");
  return TE.right(env.base);
};

const add = (n: number): ReaderTaskEither<string, number, Env> => (env) => {
  env.seen.push("add");
  return TE.right(n + env.base);
};

const fail: ReaderTaskEither<string, number, Env> = (env) => {
  env.seen.push("fail");
  return TE.left("boom");
};

const inc = (n: number) =>
  pipe(
    asks((e: Env) => e.base),
    map((base) => n + base),
  );

Deno.test("env is supplied once at the edge and reaches every step", async () => {
  const env: Env = { base: 10, seen: [] };
  const program = pipe(start, bind(add), bind(add), map((n) => n * 2));

  const found = await program(env)();
  const wanted = TE.right(60);

  assertEquals(found, await wanted());
  assertEquals(env.seen, ["start", "add", "add"]);
});

Deno.test("bind short-circuits on Left and skips later steps", async () => {
  const env: Env = { base: 10, seen: [] };
  const program = pipe(fail, bind(add), bind(add));

  const found = await program(env)();
  const wanted = TE.left("boom");

  assertEquals(found, await wanted());
  assertEquals(env.seen, ["fail"]);
});

Deno.test("nothing runs until an env is given", () => {
  const env: Env = { base: 10, seen: [] };
  pipe(start, bind(add));

  assertEquals(env.seen, []);
});

Deno.test("pipe to and from 'inc' that uses asks internally", () => {
  const env: Env = { base: 10, seen: [] };
  pipe(start, bind(inc), bind(add));

  assertEquals(env.seen, []);
});

Deno.test("run(ask())(env) === Right(env)", async () => {
  const env: Env = { base: 10, seen: [] };
  const found = await run(ask())(env);
  const wanted = await TE.right(env)();
  assertEquals(JSON.stringify(found), JSON.stringify(wanted));
});

Deno.test("run(asks((e) => e.base))(env) === Right(10)", async () => {
  const env: Env = { base: 10, seen: [] };
  const found = await run(asks((e: Env) => e.base))(env);
  const wanted = await TE.right(10)();
  assertEquals(JSON.stringify(found), JSON.stringify(wanted));
});
