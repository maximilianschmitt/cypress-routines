# cypress-routines

Simple scalable server-side setups for Cypress.

## What is it?

This package allows you to easily write setup code for your Cypress tests that runs in a Node.js process. This is helpful when your setup code needs to interact with a database for example.

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
module.exports = (on, config) => {
	require('cypress-routines/plugin')(on, config)
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
