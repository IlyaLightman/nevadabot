const { Scenes, Markup, Composer } = require('telegraf')
const User = require('../models/User')

const { ban, kick, mute, map, msg } = require('../adminPanel')

const controlHandler = new Composer()
controlHandler.action('map',
	async ctx => {
		await ctx.reply('Выберите карту: ')
		await ctx.reply('[dust2, mirage, inferno, overpass]')
		ctx.wizard.state.action = 'map'

		ctx.wizard.next()
	}
)
controlHandler.action('ban', async ctx => {
	await ctx.reply('Введите ссылку на профиль игрока, длительность бана и его причину: ')
	ctx.wizard.state.action = 'ban'

	ctx.wizard.next()
})
controlHandler.action('kick', async ctx => {
	await ctx.reply('Введите ссылку на профиль игрока и причину кика: ')
	ctx.wizard.state.action = 'kick'

	ctx.wizard.next()
})
controlHandler.action('mute', async ctx => {
	await ctx.reply('Введите ссылку на профиль игрока, длительность мута и его причину: ')
	ctx.wizard.state.action = 'mute'

	ctx.wizard.next()
})
controlHandler.action('msg',  async ctx => {
	await ctx.reply('Введите сообщение: ')
	ctx.wizard.state.action = 'msg'

	ctx.wizard.next()
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
	controlHandler,
	async ctx => {
		const data = ctx.message.text

		switch (ctx.wizard.state.action) {
			case 'map':
				if (['dust2', 'mirage', 'inferno', 'overpass'].includes(data)) {
					await map(data)
					await ctx.reply('Карта успешно сменена')
				} else {
					await ctx.reply('Неверно введены данные')
				}
				break
			case 'ban':
				const [ban_link, ban_time, ban_reason] = data.split(' ')
				await ban(ban_link, ban_time, ban_reason)
				await ctx.reply('Запрос на бан успешно отправлен')
				break
			case 'kick':
				const [kick_link, kick_reason] = data.split(' ')
				await kick(kick_link, kick_reason)
				await ctx.reply('Запрос на кик успешно отправлен')
				break
			case 'mute':
				const [mute_link, mute_time, mute_reason] = data.split(' ')
				await mute(mute_link, mute_time, mute_reason)
				await ctx.reply('Запрос на мут успешно отправлен')
				break
			case 'msg':
				await msg(data)
				await ctx.reply('Сообщение успешно отправлено')
				break
		}

		await ctx.scene.leave()
		return await ctx.scene.enter('server')
	}
)

module.exports = control
