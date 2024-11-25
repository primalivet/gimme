import { assertEquals } from "@std/assert";
import * as M from "./maybe.ts";

Deno.test("Laws", () => {
  Deno.test("left identity", () => {
    const f = (x: number) => M.pure(x * 2);
    const leftside = M.bind(f)(M.pure(10));
    const rightside = f(10);
    const found = M.show(leftside) === M.show(rightside);
    const wanted = true;

    assertEquals(found, wanted);
  });

  Deno.test("right identity", () => {
    const leftside = M.bind(M.pure)(M.pure(10));
    const rightside = M.pure(10);
    const found = M.show(leftside) === M.show(rightside);
    const wanted = true;

    assertEquals(found, wanted);
  });

  Deno.test("associativity", () => {
    const f = (x: number) => M.pure(x * 2);
    const g = (x: number) => M.pure(x + 1);
    const leftside = M.bind(g)(M.bind(f)(M.pure(10)));
    const rightside = M.bind((x: number) => M.bind(g)(f(x)))(M.pure(10));
    const found = M.show(leftside) === M.show(rightside);
    const wanted = true;

    assertEquals(found, wanted);
  });
});

Deno.test("Predicates", () => {
  Deno.test("isJust", () => {
    const found = [M.isJust(M.just("")), M.isJust(M.nothing())];
    const wanted = [true, false];

    assertEquals(found, wanted);
  });

  Deno.test("isNothing", () => {
    const found = [M.isNothing(M.just("")), M.isNothing(M.nothing())];
    const wanted = [false, true];

    assertEquals(found, wanted);
  });
});

Deno.test("Constructors", () => {
  Deno.test("nothing", () => {
    const found = M.show(M.nothing());
    const wanted = "Nothing";

    assertEquals(found, wanted);
  });

  Deno.test("nothing", () => {
    const found = M.show(M.just("success"));
    const wanted = 'Just("success")';

    assertEquals(found, wanted);
  });

  Deno.test("fromNullable: Nothing when value is null", () => {
    const found = M.fromNullable(null);
    const wanted = M.nothing();

    assertEquals(M.show(found), M.show(wanted));
  });

  Deno.test("fromNullable: Nothing when value is undefined", () => {
    const found = M.fromNullable(undefined);
    const wanted = M.nothing();

    assertEquals(M.show(found), M.show(wanted));
  });

  Deno.test("fromNullable: Just when value is not null or undefined", () => {
    const found = M.fromNullable("hello world");
    const wanted = M.just("hello world");

    assertEquals(M.show(found), M.show(wanted));
  });

  Deno.test("fromPredicate: Just when predicate is true", () => {
    const found = M.fromPredicate(Array.isArray)(["hello", "world"]);
    const wanted = M.just(["hello", "world"]);

    assertEquals(M.show(found), M.show(wanted));
  });

  Deno.test("fromPredicate: Nothing when predicate is false", () => {
    const found = M.fromPredicate(Array.isArray)("hello world");
    const wanted = M.nothing();

    assertEquals(M.show(found), M.show(wanted));
  });
});

Deno.test("Destructors", () => {
  Deno.test("fold: calls onNothing on nothing value", () => {
    const found = M.fold(
      () => "none",
      () => "some",
    )(M.nothing());
    const wanted = "none";
    assertEquals(found, wanted);
  });

  Deno.test("fold: calls onJust on right value", () => {
    const found = M.fold(
      () => "none",
      () => "some",
    )(M.just("hello world"));
    const wanted = "some";
    assertEquals(found, wanted);
  });
});

Deno.test("Functor", () => {
  Deno.test("fmap: maps the function over a just value", () => {
    const double = (x: number) => x * 2;
    const found = M.fmap(double)(M.just(2));
    const wanted = M.just(4);
    assertEquals(M.show(found), M.show(wanted));
  });

  Deno.test("fmap: dont do anything on a nothing value", () => {
    const double = (x: number) => x * 2;
    const found = M.fmap(double)(M.nothing());
    const wanted = M.nothing();
    assertEquals(M.show(found), M.show(wanted));
  });
});

Deno.test("Applicative", () => {
  Deno.test("pure: wrapps a value in the context", () => {
    const found = M.pure(2);
    const wanted = M.just(2);
    assertEquals(M.show(found), M.show(wanted));
  });

  Deno.test("apply: apply the just value to the function", () => {
    const double = (x: number) => x * 2;
    const found = M.apply(M.just(2))(M.just(double));
    const wanted = M.just(4);
    assertEquals(M.show(found), M.show(wanted));
  });

  Deno.test("apply: dont do anything on a nothing function", () => {
    const found = M.apply(M.just(2))(M.nothing());
    const wanted = M.nothing();
    assertEquals(M.show(found), M.show(wanted));
  });
});

Deno.test("Monad", () => {
  Deno.test("bind: apply the just value to a function returning an maybe, then flatten the result", () => {
    const mDouble = (x: number) => M.pure(x * 2);
    const found = M.bind(mDouble)(M.pure(2));
    const wanted = M.just(4);
    assertEquals(M.show(found), M.show(wanted));
  });

  Deno.test("bind: dont do anything to a nothing value", () => {
    const mDouble = (x: number) => M.pure(x * 2);
    const found = M.bind(mDouble)(M.nothing());
    const wanted = M.nothing();
    assertEquals(M.show(found), M.show(wanted));
  });
});
