/// <reference types="Cypress" />

describe('Users', function () {
	it('shows all users', function () {
		const users = [
			{
				firstName: 'John',
				lastName: 'Doe',
				email: 'john.doe@example.com',
			},
			{
				firstName: 'Jane',
				lastName: 'Bane',
				email: 'jane.bane@example.com',
			},
		]

		cy.routine('createUsers', users).then(() => {
			cy.visit('http://localhost:3000/users')
			cy.get('body').should('contain', 'John Doe (john.doe@example.com)')
			cy.get('body').should('contain', 'Jane Bane (jane.bane@example.com)')
		})
	})
})
