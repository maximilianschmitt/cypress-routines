const server = require('../../server')

module.exports = async (on, config) => {
	await server.start()

	let db = server.getDb()
	await db.dropDatabase()

	on('task', {
		async resetDb() {
			return db.dropDatabase()
		},
	})

	require('../../../plugin')(on, config, db)
}
