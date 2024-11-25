import { assertEquals } from "@std/assert";
import * as E from "./either.ts";

Deno.test("Laws", () => {
  Deno.test("left identity", () => {
    const f = (x: number) => E.pure(x * 2);
    const leftside = E.bind(f)(E.pure(10));
    const rightside = f(10);
    const found = E.show(leftside) === E.show(rightside);
    const wanted = true;

    assertEquals(found, wanted);
  });

  Deno.test("right identity", () => {
    const leftside = E.bind(E.pure)(E.pure(10));
    const rightside = E.pure(10);
    const found = E.show(leftside) === E.show(rightside);
    const wanted = true;

    assertEquals(found, wanted);
  });

  Deno.test("associativity", () => {
    const f = (x: number) => E.pure(x * 2);
    const g = (x: number) => E.pure(x + 1);
    const leftside = E.bind(g)(E.bind(f)(E.pure(10)));
    const rightside = E.bind((x: number) => E.bind(g)(f(x)))(E.pure(10));
    const found = E.show(leftside) === E.show(rightside);
    const wanted = true;

    assertEquals(found, wanted);
  });
});

Deno.test("Predicates", () => {
  Deno.test("isRight", () => {
    const found = [E.isRight(E.right("")), E.isRight(E.left(""))];
    const wanted = [true, false];

    assertEquals(found, wanted);
  });

  Deno.test("isLeft", () => {
    const found = [E.isLeft(E.right("")), E.isLeft(E.left(""))];
    const wanted = [false, true];

    assertEquals(found, wanted);
  });
});

Deno.test("Constructors", () => {
  Deno.test("left", () => {
    const found = E.show(E.left("reason"));
    const wanted = 'Left("reason")';

    assertEquals(found, wanted);
  });

  Deno.test("right", () => {
    const found = E.show(E.right("success"));
    const wanted = 'Right("success")';

    assertEquals(found, wanted);
  });

  Deno.test("fromNullable: Left when value is null", () => {
    const found = E.fromNullable((x) => x)(null);
    const wanted = E.left(null);

    assertEquals(E.show(found), E.show(wanted));
  });

  Deno.test("fromNullable: Left when value is undefined", () => {
    const found = E.fromNullable((x) => x)(undefined);
    const wanted = E.left(undefined);

    assertEquals(E.show(found), E.show(wanted));
  });

  Deno.test("fromNullable: Right when value is not null or undefined", () => {
    const found = E.fromNullable((x) => x)("hello world");
    const wanted = E.right("hello world");

    assertEquals(E.show(found), E.show(wanted));
  });

  Deno.test("fromPredicate: Right when predicate is true", () => {
    const found = E.fromPredicate(Array.isArray)((x) => x)(["hello", "world"]);
    const wanted = E.right(["hello", "world"]);

    assertEquals(E.show(found), E.show(wanted));
  });

  Deno.test("fromPredicate: Left when predicate is false", () => {
    const found = E.fromPredicate(Array.isArray)((x) => x)("hello world");
    const wanted = E.left("hello world");

    assertEquals(E.show(found), E.show(wanted));
  });

  Deno.test("tryCatch: Right when function does not throw", () => {
    const found = E.tryCatch(
      () => {
        throw new Error("failure");
      },
      (x) => x,
    );
    const wanted = E.left(new Error("failure"));

    assertEquals(E.show(found), E.show(wanted));
  });

  Deno.test("tryCatch: Left when function does throw", () => {
    const found = E.tryCatch(
      () => {
        return "success";
      },
      (x) => x,
    );
    const wanted = E.right("success");

    assertEquals(E.show(found), E.show(wanted));
  });
});

Deno.test("Destructors", () => {
  Deno.test("fold: calls onLeft on left value", () => {
    const found = E.fold(
      () => "failure",
      () => "success",
    )(E.left(""));
    const wanted = "failure";
    assertEquals(found, wanted);
  });

  Deno.test("fold: calls onRight on right value", () => {
    const found = E.fold(
      () => "failure",
      () => "success",
    )(E.right(""));
    const wanted = "success";
    assertEquals(found, wanted);
  });
});

Deno.test("Functor", () => {
  Deno.test("fmap: maps the function over a right value", () => {
    const double = (x: number) => x * 2;
    const found = E.fmap(double)(E.right(2));
    const wanted = E.right(4);
    assertEquals(E.show(found), E.show(wanted));
  });

  Deno.test("fmap: dont do anything on a left value", () => {
    const double = (x: number) => x * 2;
    const found = E.fmap(double)(E.left(2));
    const wanted = E.left(2);
    assertEquals(E.show(found), E.show(wanted));
  });
});

Deno.test("Bifunctor", () => {
  Deno.test("bimap: apply a Left value to the first given function", () => {
    const inc = (x: number) => x + 1;
    const double = (x: number) => x * 2;
    const found = E.bimap(inc, double)(E.left(2));
    const wanted = E.left(3);
    assertEquals(E.show(found), E.show(wanted));
  });

  Deno.test("bimap: apply a Right value to the second given function", () => {
    const inc = (x: number) => x + 1;
    const double = (x: number) => x * 2;
    const found = E.bimap(inc, double)(E.right(2));
    const wanted = E.right(4);
    assertEquals(E.show(found), E.show(wanted));
  });

  Deno.test("fmapLeft: apply a Left value to a function", () => {
    const double = (x: number) => x * 2;
    const found = E.fmapLeft(double)(E.left(2));
    const wanted = E.left(4);
    assertEquals(E.show(found), E.show(wanted));
  });

  Deno.test("fmapLeft: leave a Right value untouched", () => {
    const double = (x: number) => x * 2;
    const found = E.fmapLeft(double)(E.right(2));
    const wanted = E.right(2);
    assertEquals(E.show(found), E.show(wanted));
  });
});

Deno.test("Applicative", () => {
  Deno.test("pure: wrapps a value in the context", () => {
    const found = E.pure(2);
    const wanted = E.right(2);
    assertEquals(E.show(found), E.show(wanted));
  });

  Deno.test("apply: apply the right value to the function", () => {
    const double = (x: number) => x * 2;
    const found = E.apply(E.right(2))(E.right(double));
    const wanted = E.right(4);
    assertEquals(E.show(found), E.show(wanted));
  });

  Deno.test("apply: dont do anything on a left function", () => {
    const double = (x: number) => x * 2;
    const found = E.apply(E.right(2))(E.left(double));
    const wanted = E.left(double);
    assertEquals(E.show(found), E.show(wanted));
  });
});

Deno.test("Monad", () => {
  Deno.test("bind: apply the right value to a function returning an either, then flatten the result", () => {
    const mDouble = (x: number) => E.pure(x * 2);
    const found = E.bind(mDouble)(E.pure(2));
    const wanted = E.right(4);
    assertEquals(E.show(found), E.show(wanted));
  });

  Deno.test("bind: dont do anything to a left value", () => {
    const mDouble = (x: number) => E.pure(x * 2);
    const found = E.bind(mDouble)(E.left(2));
    const wanted = E.left(2);
    assertEquals(E.show(found), E.show(wanted));
  });
});
