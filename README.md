# README

A collection of functional concepts like monads and functors implemented in JavaScript.

## Implemented specifications

```
Name      Setoid  Semigroup  Monoid  Functor  Apply  Applicative  Foldable  Traversable  Chain  Monad
Identity  -       -          -       X        X      X            -         -            X      X
Either    -       -          -       X        X      X            -         -            -      X
Maybe     -       X          -       X        X      X            -         -            -      X
Sum       -       X          X       X        -      -            -         -            -      X
Product   -       X          X       X        -      -            -         -            -      -
All       -       X          X       X        -      -            -         -            -      -
Any       -       X          X       X        -      -            -         -            -      -
```

## Required methods per specification

```
Method    Setoid  Semigroup  Monoid  Functor  Apply  Applicative  Foldable  Traversable  Chain  Monad
equals    X       -          -       -        -      -            -         -            -      -
concat    -       X          X       -        -      -            -         -            -      -
empty     -       -          X       -        -      -            -         -            -      -
map       -       -          -       X        X      X            -         X            X      X
ap        -       -          -       -        X      X            -         -            X      X
of        -       -          -       -        -      X            -         -            -      X
reduce    -       -          -       -        -      -            X         X            -      -
traverse  -       -          -       -        -      -            -         X            -      -
chain     -       -          -       -        -      -            -         -            X      X
```
