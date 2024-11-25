import { assertEquals } from "@std/assert";
import * as P from "./parser.ts";

Deno.test("pchar success", () => {
  const found = P.run(P.pchar("A"))("ABC");
  const wanted = P.success(["A", "BC"]);
  assertEquals(found, wanted);
});

Deno.test("pchar failure", () => {
  const found = P.run(P.pchar("A"))("BAC");
  const wanted = P.failure("Expected: A. Got: B");
  assertEquals(found, wanted);
});

Deno.test("fmap success", () => {
  const lower = (x: string) => x.toLowerCase();
  const found = P.run(P.fmap(lower)(P.pchar("A")))("ABC");
  const wanted = P.success(["a", "BC"]);
  assertEquals(found, wanted);
});

Deno.test("fmap failure", () => {
  const lower = (x: string) => x.toLowerCase();
  const found = P.run(P.fmap(lower)(P.pchar("A")))("BAC");
  const wanted = P.failure("Expected: A. Got: B");
  assertEquals(found, wanted);
});
