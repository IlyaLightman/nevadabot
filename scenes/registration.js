const { Telegraf, Scenes } = require('telegraf')
const { register } = require('../registration')
const User = require('../models/User')

const registration = new Scenes.WizardScene(
	'registration',
	async ctx => {
		await ctx.replyWithPhoto({ source: './pics/nevada2.png'},
			{ caption: 'Добро пожаловать!' +
					'\nЗдесь вы сможете отслеживать статистику или управлять привилегиями'})

		await ctx.replyWithMarkdown(`
		*Регистрация в боте*\n\n` +
			'Чтобы зарегистрироваться, введите ***ссылку на ваш Steam профиль***, ' +
			'после чего мы создадим одноразовый токен-пароль, который вы сможете ' +
			'узнать у администртаторов, подтвердив личность')

		return ctx.wizard.next()
	},
	async ctx => {
		ctx.state.allowMsgs = true
		const steamid = ctx.message.text

		const data = await register(steamid)

		await ctx.replyWithMarkdown(
			data ? 'Токен создан, *осталось его ввести*: ' : 'Такого **steamid** не существует')
		if (!data) return ctx.wizard.back()
		ctx.wizard.state.steamid = steamid

		return ctx.wizard.next()
	},
	async ctx => {
		const token = ctx.message.text
		const steamid = ctx.wizard.state.steamid

		const user = await User.findOne({ steamid })
		if (user.authToken !== token) return (() => {
			ctx.reply('Неверный токен! Введите ссылку на ваш Steam профиль снова, а мы создадим ещё один:')
			ctx.wizard.back()
		})()

		user.isAuthorized = true
		user.telegramid = ctx.from.id
		await user.save()

		ctx.state.allowMsgs = false
		await ctx.reply('Спасибо за регистрацию! Теперь введите /menu, чтобы попасть в меню!')
		return ctx.scene.leave()
	}
)

module.exports = registration
