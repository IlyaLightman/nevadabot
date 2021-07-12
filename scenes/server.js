const { Scenes, Markup, Composer } = require('telegraf')
const User = require('../models/User')

const serverHandler = new Composer()
serverHandler.action('side', async ctx => {
	try {
		await ctx.replyWithPhoto({ source: './pics/nevada2.png'},
			{ caption: 'Выбранный сервер: Nevada Side'})

		const user = await User.findOne({ telegramid: ctx.from.id })
		user.chosenServer = 'side'
		await user.save()

		await ctx.reply('Меню сервера: ', Markup.keyboard([
			['Моя статистика'],
			['Управление сервером'],
			['Привилегии']
		]))
	} catch (err) {
		console.log(err)
	}
})
serverHandler.action('future', async ctx => {
	try {
		await ctx.replyWithPhoto({ source: './pics/future.png'},
			{ caption: 'Выбранный сервер: Nevada Future'})

		const user = await User.findOne({ telegramid: ctx.from.id })
		user.chosenServer = 'future'
		await user.save()

		await ctx.reply('Меню сервера: ', Markup.keyboard([
			['Моя статистика'],
			['Управление сервером'],
			['Привилегии']
		]))

		await ctx.scene.leave()
	} catch (err) {
		console.log(err)
	}
})

const server = new Scenes.WizardScene(
	'server',
	async ctx => {
		await ctx.replyWithPhoto({ source: './pics/nevadamenu.png'},
			{ caption: 'Привет!' +
					'\nЗдесь будет ник в стиме'})
		await ctx.reply('Выбери сервер: ', Markup.inlineKeyboard([
						Markup.button.callback('💥  Nevada Side', 'side'),
						Markup.button.callback('💥  Nevada Future', 'future')
					]))

		ctx.wizard.next()
	},
	serverHandler
)

module.exports = server
