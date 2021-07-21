const { Scenes, Markup, Composer } = require('telegraf')
const User = require('../models/User')

const { ban, kick, mute, map, msg } = require('../adminPanel')

const controlHandler = new Composer()
controlHandler.action('map', async ctx => {
	await ctx.reply('Выберите карту: ')
})
controlHandler.action('ban', async ctx => {
	await ctx.reply('Введите ссылку на профиль игрока, длительность бана и его причину: ')
})
controlHandler.action('kick', async ctx => {
	await ctx.reply('Введите ссылку на профиль игрока и причину кика: ')
})
controlHandler.action('mute', async ctx => {
	await ctx.reply('Введите ссылку на профиль игрока, длительность мута и его причину: ')
})
controlHandler.action('msg',  async ctx => {
	await ctx.reply('Введите сообщение: ')
})
controlHandler.action('back', async ctx => {
	await ctx.scene.leave()
	return await ctx.scene.enter('server')
})

const control = new Scenes.WizardScene(
	'control',
	async ctx => {
		const user = await User.findOne({ telegramid: ctx.from.id })

		if (!user.admin[user.chosenServer]) {
			await ctx.reply('Вы не администратор выбранного сервера')
			return await ctx.scene.leave()
		}

		await ctx.reply('Управление сервером: ', Markup.inlineKeyboard([
			[Markup.button.callback('Сменить карту', 'map'), Markup.button.callback('Забанить игрока', 'ban')],
			[Markup.button.callback('Кикнуть игрока', 'kick'), Markup.button.callback('Замутить игрока', 'mute')],
			[Markup.button.callback('Сообщение всем', 'msg')],
			[Markup.button.callback('Выйти из меню', 'back')]
		]))

		ctx.wizard.next()
	},
	controlHandler
)

module.exports = control
