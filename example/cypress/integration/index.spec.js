describe('Index', function () {
	it('says hello', function () {
		cy.routine('hello').then((response) => {
			console.log(response)
		})
	})
})
