module.exports = (db) => {
	return {
		async createUsers(users) {
			await db.collection('users').insertMany(users)

			return users
		},
	}
}
