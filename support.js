Cypress.Commands.add('routine', (routineName = '', ...args) => {
	const testFile = Cypress.spec.absolute

	let isGlobalRoutine = false
	if (routineName.startsWith('/')) {
		isGlobalRoutine = true
		routineName = routineName.slice(1)
	}

	return cy.task('routine', { testFile, routineName, isGlobalRoutine, args })
})
