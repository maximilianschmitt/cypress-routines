# example-mongodb

An example of using `cypress-routines` for writing setup-code for a MongoDB/Express application.

## Installation

```
$ git clone git@github.com:maximilianschmitt/cypress-routines.git
$ cd cypress-routines/example-mongodb
$ yarn
```

## Running the tests

```
$ yarn cypress open
```

## Running the example application

```
$ yarn start
```

## Walkthrough

### ./app.js

A simple Express app that shows all users in a MongoDB database in an unordered list.

### cypress/integration/users.spec.js

Tests that all users from the database are shown on the page.

Uses the `createUsers` routine for its test setup.

### cypress/integration/users.routines.js

Contains the `createUsers` routine that enables tests to insert users into the database.

### cypress/plugins/index.js

Registers the `cypress-routines` plugin-file and makes the `db` object available to all routines.
