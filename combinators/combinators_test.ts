import { assertEquals } from "@std/assert";
import { A, B, C, I, K, P, S, S2, T, W, Y } from "./combinators.ts";

Deno.test("I", () => {
  const found = I("hello world");
  const wanted = "hello world";
  assertEquals(found, wanted);
});

Deno.test("K", () => {
  const found = K(true)(false);
  const wanted = true;
  assertEquals(found, wanted);
});

Deno.test("A", () => {
  const found = A(String)(true);
  const wanted = "true";
  assertEquals(found, wanted);
});

Deno.test("T", () => {
  const found = T(true)(String);
  const wanted = "true";
  assertEquals(found, wanted);
});

Deno.test("W", () => {
  const add = (x: number) => (y: number) => x + y;
  const found = W(add)(2);
  const wanted = 4;
  assertEquals(found, wanted);
});

Deno.test("C", () => {
  const fullname = (fst: string) => (snd: string) => fst + snd;
  const found = C(fullname)("John")("Doe");
  const wanted = "DoeJohn";
  assertEquals(found, wanted);
});

Deno.test("B", () => {
  const upper = (x: string): string => x.toUpperCase();
  const dashed = (x: string): string => x.replace(" ", "-");
  // HINT: TS inference can't infer the generics for B so have to explicit define generics
  const found = B<string, string, string>(upper)(dashed)("hello world");
  const wanted = "HELLO-WORLD";
  assertEquals(found, wanted);
});

Deno.test("S", () => {
  const double = (x: number): number => x * 2;
  const mult = (x: number) => (y: number): number => x * y;
  const found = S(mult)(double)(10);
  const wanted = 200;
  assertEquals(found, wanted);
});

Deno.test("S_", () => {
  const double = (x: number): number => x * 2;
  const mult = (x: number) => (y: number): number => x * y;
  const found = S(mult)(double)(10);
  const wanted = 200;
  assertEquals(found, wanted);
});

Deno.test("S2", () => {
  const double = (x: number): number => x * 2;
  const inc = (x: number): number => x + 1;
  const add = (x: number) => (y: number): number => x + y;
  const found = S2<number, number, number, number>(add)(double)(inc)(2);
  const wanted = 7;
  assertEquals(found, wanted);
});

Deno.test("P", () => {
  const double = (x: number): number => x * 2;
  const add = (x: number) => (y: number): number => x + y;
  const found = P<number, number, number>(add)(double)(2)(4);
  const wanted = 12;
  assertEquals(found, wanted);
});

Deno.test("Y Combinator Factorial function", () => {
  const factorial = Y<number>(
    (recur) => (n) => n <= 1 ? 1 : n * recur(n - 1),
  );
  assertEquals(factorial(0), 1);
  assertEquals(factorial(1), 1);
  assertEquals(factorial(5), 120);
  assertEquals(factorial(7), 5040);
});

Deno.test("Y Combinator Fibonacci function", () => {
  const fibonacci = Y<number>(
    (recur) => (n) => n <= 1 ? n : recur(n - 1) + recur(n - 2),
  );
  assertEquals(fibonacci(0), 0);
  assertEquals(fibonacci(1), 1);
  assertEquals(fibonacci(5), 5);
  assertEquals(fibonacci(10), 55);
});

Deno.test("Y Combinator Alphabet function", () => {
  const alphabet = Y<string>(
    (recur) => (s) =>
      s.length === 0 || s.charCodeAt(s.length - 1) === "z".charCodeAt(0)
        ? s
        : recur(s + String.fromCharCode(s.charCodeAt(s.length - 1) + 1)),
  );
  assertEquals(alphabet("a"), "abcdefghijklmnopqrstuvwxyz");
  assertEquals(alphabet("m"), "mnopqrstuvwxyz");
  assertEquals(alphabet("w"), "wxyz");
  assertEquals(alphabet(""), "");
});
