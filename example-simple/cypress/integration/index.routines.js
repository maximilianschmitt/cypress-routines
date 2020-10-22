module.exports = (args) => {
	console.log(args)

	return {
		hello() {
			console.log('hello')

			return { message: 'hello from node.js' }
		},
	}
}
