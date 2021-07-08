const { Telegraf } = require('telegraf')

const { dataUpdater } = require('./dataController')

const start = async () => {
	await dataUpdater()
}
start().then(() => {
	console.log('ok')
})
