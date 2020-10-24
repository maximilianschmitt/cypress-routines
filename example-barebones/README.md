# example-barebones

A barebones example of using `cypress-routines`.

## Installation

```
$ git clone git@github.com:maximilianschmitt/cypress-routines.git
$ cd cypress-routines/example-barebones
$ yarn
```

## Running the tests

```
$ yarn cypress open
```

## Walkthrough

### cypress/integration/index.spec.js

Calls the `hello` routine and tests that its response is valid.

### cypress/integration/index.routines.js

Contains the `hello` routine which returns a simple JavaScript object with a message.
