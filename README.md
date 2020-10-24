<p align="center">
  <img src="logo@2x.png" width="210" alt="cypress-routines">
    <br>
	Easily write scalable Node.js setup code for Cypress
</p>

---

# cypress-routines

## Motivation

`cy.task()` allows Cypress users to run code in a Node.js process.
However, all Cypress tasks run in a global namespace and as your app and number of different test setups grow, relying on `cy.task()` for test setups can become hard to maintain.

`cypress-routines` enables you to organize your test setups neatly per spec-file. Routines run in Node.js, so you can easily access things like databases and file systems in your test setups.

## Installation

### 1. Install cypress-routines

```bash
# With yarn:
yarn add cypress-routines --dev

# With npm:
npm install cypress-routines --save-dev
```

### 2. Require plugin-file

In `cypress/plugins/index.js`:

```js
module.exports = async (on, config) => {
	const db = await connectDb() // 👈 Example

	// After `on, config`, you can pass e.g. db    👇
	require('cypress-routines/plugin')(on, config, db)
}
```

### 3. Require support-file

In `cypress/support/index.js`:

```js
require('cypress-routines/support')
```

### 4. Ignore \*.routines.js

In `cypress.json`:

```json
{
	"ignoreTestFiles": ["*.routines.js"]
}
```

## Usage guide

-   [Where do I put my routines?](#where-do-i-put-my-routines-)
-   [Writing routines](#writing-routines)
-   [Giving routines access to the database](#giving-routines-access-to-the-database)
-   [Calling routines](#calling-routines)
-   [Sharing routines across spec-files](#sharing-routines-across-spec-files)
-   [Global routines](#global-routines)
-   [Sharing routine functions](#sharing-routine-functions)

### Where do I put my routines?

Routines live next to their respective spec-file:

```
cypress/
	integration/
		login.spec.js
		login.routines.js
		signup.spec.js
		signup.routines.js
```

You can also define [global routines](#global-routines).

### Writing routines

A routines-file is a simple node.js module that exports a factory-function that returns an object with functions ("routines") attached to it:

```js
// cypress/integration/login.routines.js

function loginRoutines(db) {
	return {
		createUser(user) {
			await db.collection('users').insertOne(user)

			return user
		}
	}
}

module.exports = loginRoutines
```

The return-value of the routine will be accessible from the spec-file in the browser context, so it must be JSON-serializable.

Above routines file can be used from `login.spec.js` like so:

```js
cy.routine('createUser', { email: '...' }).then(() => {
	// ...
})
```

### Giving routines access to the database

Go into your Cypress support-file and pass the `db` (and any other parameters you like) after `on, config` to the function that's required as `cypress-routines/plugin`.

```js
// cypress/support/index.js

module.exports = async (on, config) => {
	const db = await connectDb()

	// All arguments after `on, config` are passed along
	// to the routine-factories. In this case, we're passing
	// `db` so that every routines-file can access the db
	// if it needs to.
	require('cypress-routines/plugin')(on, config, db, param2, param3 /* etc. */)
}
```

The factory-functions in your routines files now have access to those params.

```js
// cypress/integration/login.routines.js

function loginRoutines(db, param2, param3 /* etc. */) {
	return {
		// ...
	}
}

module.exports = loginRoutines
```

### Calling routines

Routines are called with `cy.routine(routineName: string, routineArg?: any)`. A routine can optionally take a single argument (must be JSON-serializable).

```js
// cypress/integration/login.spec.js

it('logs in the user', function () {
	const routineArg = {
		email: 'max@maxschmitt.me',
		hashedPassword: hashPassword('123456'),
	}

	cy.routine('createUser', routineArg).then(() => {
		cy.visit('login')
		// ...
	})
})
```

`cy.routine()`, like other Cypress commands, is asynchronous and cannot be used with async/await. Read here for [more info on async commands](https://docs.cypress.io/guides/core-concepts/introduction-to-cypress.html#Commands-Are-Asynchronous).

### Sharing routines across spec-files

Routines are scoped to their spec-files. For 95% of cases, this is what you want because it introduces clean separations between test-setups and makes it easy to find a routine that is used in a certain spec-file.

In some cases, you might want to reuse certain routines. There are two options for this:

-   Global routines
-   Sharing routine functions

### Global routines

Global routines can be defined in `cypress/integration/global-routines.js`. It looks like any other routines-file:

```js
// cypress/global-routines.js

function globalRoutines(db) {
	return {
		async createDefaultUser() {
			const defaultUser = {
				email: 'maximilian.schmitt@googlemail.com',
				hashedPassword: hashPassword('123456'),
			}

			await db.collection('users').insertOne(defaultUser)

			return defaultUser
		},
	}
}

module.exports = globalRoutines
```

Global routines are called like regular routines, but prefixed with a `'/'`:

```js
// cypress/integration/login.spec.js

it('logs in the user', function () {
	cy.routine('/createDefaultUser').then((testUser) => {
		cy.visit('login')
		// ...
	})
})
```

### Sharing routine functions

You can always require other routines-files from any routines-file. You can then re-use and re-export functions with normal JavaScript:

```js
// cypress/integration/login.routines.js

// Either export an entire other routines-file:
module.exports = require('./homepage.routines.js')

// Or export single functions:
module.exports = (db) => {
	const homepageRoutines = require('./homepage.routines.js')(db)

	return {
		createUser: homepageRoutines.createUser,
	}
}
```
