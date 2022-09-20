# README

__This project is just for fun and practice.__

I found it a bit difficult to wrap my head around the inner workings of some of
the algebraic data types in librarys like [Sanctuary](https://sanctuary.js.org/), 
[Folktale](https://folktale.origamitower.com/), [Crocks](https://crocks.dev/)
etc. Therefore I implemented a bunch of algebraic data types from scratch, with
the sole reason to understand more of how and why they work like they do.

## Implemented data types

```
Name      Setoid  Semigroup  Monoid  Functor  Bifunctor  Apply  Applicative  Foldable  Traversable  Chain  Monad
Task      -       -          -       X        -         X      X            -         -            X      X
Either    -       -          -       X        X         X      X            -         -            X      X
IO        -       -          -       X        -         X      X            -         -            X      X
Maybe     -       -          -       X        -         X      X            -         -            X      X
Tuple     -       -          -       X        X         X      X            -         -            X      X
```

## Required methods per specification

```
Method    Setoid  Semigroup  Monoid  Functor  Bifunctor  Apply  Applicative  Foldable  Traversable  Chain  Monad
apply     -       -          -       -        -          X      X            -         -            X      X
bind      -       -          -       -        -          -      -            -         -            X      X
concat    -       X          X       -        -          -      -            -         -            -      -
empty     -       -          X       -        -          -      -            -         -            -      -
equals    X       -          -       -        -          -      -            -         -            -      -
fmap      -       -          -       X        X          X      X            -         X            X      X
pure      -       -          -       -        -          -      X            -         -            -      X
reduce    -       -          -       -        -          -      -            X         X            -      -
traverse  -       -          -       -        -          -      -            -         X            -      -
bimap     -       -          -       -        X          -      -            -         X            -      -
```
