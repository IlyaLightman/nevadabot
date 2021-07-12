const { Scenes, Markup, Composer } = require('telegraf')
const User = require('../models/User')

const stat = new Scenes.WizardScene(
	'stat',
	async ctx => {
		const user = await User.findOne({ telegramid: ctx.from.id })

		// console.log(ctx.wizard.state.redisClient)
		ctx.wizard.state.redisClient.get('side/lr', async (err, res) => {
			const playerData = JSON.parse(res).find(d => d.steam.slice(10) === user.steam.steamID.slice(10))

			await ctx.replyWithMarkdown(`
			Ваша статистика:
			
				*Ранг:* ${playerData.rank}
				*Убийств:* ${playerData.kills}
				*Смертей:* ${playerData.deaths}
				*Выстрелов:* ${playerData.shoots}
				*Попаданий:* ${playerData.hits}
				*Хэдшотов:* ${playerData.headshots}
				*Ассистов:* ${playerData.assists}
				*Выигранных раундов:* ${playerData.round_win}
				*Проигранных раундов:* ${playerData.round_lose}
				*Время игры:* ${playerData.playtime}
				*Последнее подключение:* ${playerData.lastconnect}
					
				**Статистика обновляется раз в 10 минут**
		`)
		})
	}
)

module.exports = stat
