const { Telegraf } = require('telegraf')
const redis  = require('redis')
const redisClient = redis.createClient()
const mongoose = require('mongoose')
require('dotenv').config()

const { dataUpdater } = require('./dataController')

const start = async () => {
	setInterval(async () => {
		await dataUpdater(redisClient)
		console.log('Data updated')
	}, 600)
	console.log('Data updated first time')

	await mongoose.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true
	})
	console.log('Mongo Database connected')

	// redisClient.get('side/lr', (err, data) => console.log(JSON.parse(data)))
}
start().then(() => {
	console.log('ok')
})
