const express = require('express')
const MongoClient = require('mongodb').MongoClient

let client
let db
let server
async function start(port = 3000) {
	console.log('Starting server...')
	client = await MongoClient.connect('mongodb://localhost')
	db = client.db('cypress-routines-example-mongodb')

	const app = express()

	app.get('/users', async function (req, res, next) {
		try {
			const users = await db.collection('users').find({}).toArray()

			res.type('html')
			res.send(
				`
					<ul>
						${users
							.map((user) => {
								return `<li>${user.firstName} ${user.lastName} (${user.email})</li>`
							})
							.join('')}
					</ul>`
			)
		} catch (err) {
			next(err)
		}
	})

	await new Promise((resolve, reject) => {
		server = app.listen(port, (err) => {
			if (err) {
				reject(err)
			} else {
				resolve()
			}
		})
	})

	console.log(`Listening on port ${port}`)
}

async function stop() {
	await client.close()
	server.close()
}

function getDb() {
	return db
}

module.exports = { start, stop, getDb }
