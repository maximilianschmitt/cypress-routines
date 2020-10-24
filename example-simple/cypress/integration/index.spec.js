describe('Index', function () {
	it('says hello', function () {
		cy.routine('hello').then((response) => {
			expect(response).to.deep.equal({ message: 'Hello from the routine!' })
		})
	})
})
