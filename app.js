const { Telegraf, Scenes, session } = require('telegraf')
const redis  = require('redis')
const redisClient = redis.createClient()
const mongoose = require('mongoose')
const User = require('./models/User')
require('dotenv').config()

const { dataUpdater } = require('./dataController')
const { rconSideCommand } = require('./rconController')

const registrationStage = require('./scenes/registration')

const bot = new Telegraf(process.env.TELEGRAM_API)
const stage = new Scenes.Stage([
	registrationStage
])

bot.use(session())
bot.use(stage.middleware())

bot.start(async ctx => {
	console.log('Id пользователя:', ctx.from.id);

	const candidate = await User.findOne({ telegramid: ctx.from.id })
	if (candidate) {
		return ctx.replyWithMarkdown(`Вы уже авторизованы!` +
			`\n**Telegram ID**: ${candidate.telegramid}` +
			`\n**Steam ID**: ${candidate.steamid}` +
			`\n\nВведите /menu, если хотите попасть в меню`)
	}

	return ctx.scene.enter('registration')
})

const start = async () => {
	await dataUpdater(redisClient)
	setInterval(async () => {
		await dataUpdater(redisClient)
		console.log('Data updated')
	}, 600000)
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
	bot.launch().then(() => console.log('Bot has been launched'))
})
