import { assertEquals } from "@std/assert";
import { pure as _pure } from "./task.ts";
import { left as _left, right as _right, show } from "./either.ts";
import {
  bind,
  fromEither,
  fromTask,
  left,
  map,
  mapLeft,
  pure,
  right,
  run,
  tryCatch,
} from "./unstable_task_either.ts";

Deno.test("right: constructs a task either right", async () => {
  const found = await run(right(10));
  const wanted = _right(10);
  assertEquals(show(found), show(wanted));
});

Deno.test("left: constructs a task either left", async () => {
  const found = await run(left(10));
  const wanted = _left(10);
  assertEquals(show(found), show(wanted));
});

Deno.test("pure: constructs a task either right", async () => {
  const found = await run(pure(10));
  const wanted = _right(10);
  assertEquals(show(found), show(wanted));
});

Deno.test("map: on a task either right", async () => {
  const found = await run(map((x: number) => x * 2)(right(32)));
  const wanted = _right(64);
  assertEquals(show(found), show(wanted));
});

Deno.test("map: on a task either left", async () => {
  const found = await run(map((x: number) => x * 2)(left(32)));
  const wanted = _left(32);
  assertEquals(show(found), show(wanted));
});

Deno.test("mapLeft: on a task either right", async () => {
  const found = await run(mapLeft((x: number) => x * 2)(right(32)));
  const wanted = _right(32);
  assertEquals(show(found), show(wanted));
});

Deno.test("mapLeft: on a task either left", async () => {
  const found = await run(mapLeft((x: number) => x * 2)(left(32)));
  const wanted = _left(64);
  assertEquals(show(found), show(wanted));
});

Deno.test("bind: on a task either right", async () => {
  const found = await run(bind((x: number) => pure(x * 2))(right(32)));
  const wanted = _right(64);
  assertEquals(show(found), show(wanted));
});

Deno.test("bind: on a task either left", async () => {
  const found = await run(bind((x: number) => pure(x * 2))(left(32)));
  const wanted = _left(32);
  assertEquals(show(found), show(wanted));
});

Deno.test("run: runs a task either", async () => {
  const found = await run(right(32));
  const wanted = _right(32);
  assertEquals(show(found), show(wanted));
});

Deno.test("tryCatch: when function does not throw ", async () => {
  const found = await run(
    tryCatch(String)(async () => {
      await new Promise((res) => setTimeout(res, 500));
      return "hello world";
    }),
  );
  const wanted = _right("hello world");
  assertEquals(show(found), show(wanted));
});

Deno.test("tryCatch: when function throws", async () => {
  const found = await run(
    tryCatch(String)(async () => {
      await new Promise((res) => setTimeout(res, 500));
      throw new Error("Some error occured");
    }),
  );
  const wanted = _left("Error: Some error occured");
  assertEquals(show(found), show(wanted));
});

Deno.test("fromEither: when either is right", async () => {
  const found = await run(fromEither(_right(32)));
  const wanted = await run(right(32));
  assertEquals(show(found), show(wanted));
});

Deno.test("fromEither: when either is left", async () => {
  const found = await run(fromEither(_left(32)));
  const wanted = await run(left(32));
  assertEquals(show(found), show(wanted));
});

Deno.test("fromTask: wraps the value inside the task with a either", async () => {
  const found = await run(fromTask(_pure(10)));
  const wanted = await run(right(10));
  assertEquals(show(found), show(wanted));
});
