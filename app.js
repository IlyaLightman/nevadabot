const { Telegraf } = require('telegraf')
const redis  = require('redis')
const redisClient = redis.createClient()

const { dataUpdater } = require('./dataController')

const start = async () => {
	await dataUpdater(redisClient)
}
start().then(() => {
	console.log('ok')
})
