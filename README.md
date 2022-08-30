# README

__This project is just for fun and practice.__

I found it a bit difficult to wrap my head around the inner workings of some of
the algebraic data types in librarys like [Sanctuary](https://sanctuary.js.org/), 
[Folktale](https://folktale.origamitower.com/), [Crocks](https://crocks.dev/)
etc. Therefore I implemented a bunch of algebraic data types from scratch, with
the sole reason to understand more of how and why they work like they do.

## Implemented data types

```
Name      Setoid  Semigroup  Monoid  Functor  Apply  Applicative  Foldable  Traversable  Chain  Monad
All       -       X          X       X        -      -            -         -            -      -
Any       -       X          X       X        -      -            -         -            -      -
Either    -       -          -       X        X      X            -         -            -      X
Identity  -       -          -       X        X      X            -         -            X      X
IO        -       -          -       X        X      X            -         -            X      X
Maybe     -       X          -       X        X      X            -         -            -      X
Product   -       X          X       X        -      -            -         -            -      -
Sum       -       X          X       X        -      -            -         -            -      X
```

## Required methods per specification

```
Method    Setoid  Semigroup  Monoid  Functor  Apply  Applicative  Foldable  Traversable  Chain  Monad
ap        -       -          -       -        X      X            -         -            X      X
chain     -       -          -       -        -      -            -         -            X      X
concat    -       X          X       -        -      -            -         -            -      -
empty     -       -          X       -        -      -            -         -            -      -
equals    X       -          -       -        -      -            -         -            -      -
map       -       -          -       X        X      X            -         X            X      X
of        -       -          -       -        -      X            -         -            -      X
reduce    -       -          -       -        -      -            X         X            -      -
traverse  -       -          -       -        -      -            -         X            -      -
```
