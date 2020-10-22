module.exports = async (on, config) => {
	require('../../../plugin')(on, config, () => ['1', 2])
}
