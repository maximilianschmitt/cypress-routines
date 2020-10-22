const path = require('path')

function cypressRoutinesPlugin(on, config, getConstructorArgs = () => {}) {
	on('task', {
		routine({ testFile, routineName, isGlobalRoutine, args }) {
			const testFileName = path.basename(testFile)
			const routinesFile = isGlobalRoutine
				? path.resolve(process.cwd(), 'cypress/global-routines.js')
				: path.resolve(testFile, `../${testFileName.replace('.spec.js', '.routines.js')}`)

			let createRoutinesObject
			try {
				if (require.cache[require.resolve(routinesFile)]) {
					delete require.cache[require.resolve(routinesFile)]
				}

				createRoutinesObject = require(routinesFile)
			} catch (err) {
				console.error(err.stack || err)
				throw new Error(`Could not require routines file: ${routinesFile}`)
			}

			const routines = createRoutinesObject(...[].concat(getConstructorArgs()))

			const routine = routines[routineName]
			if (!routine) {
				throw new Error(`Routine ${routineName} not defined in routines file ${routinesFile}`)
			}

			return routine(...args) || null
		},
	})
}

module.exports = cypressRoutinesPlugin
