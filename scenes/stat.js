// const { Scenes, Markup, Composer } = require('telegraf')
const User = require('../models/User')
const { getStatData } = require('../dataController')

const stat = async ctx => {
	const user = await User.findOne({telegramid: ctx.from.id})

	const playerData = await getStatData(user.chosenServer, user.steam.steamID)

	const servers = {
		'nevada': 'Nevada',
		'side': 'Side',
		'future': 'Future'
	}
	await ctx.replyWithMarkdown(`Ваша статистика на Nevada ${servers[user.chosenServer]}:
			
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
					
Статистика обновляется раз в 10 минут
		`)
}

// const stat = new Scenes.WizardScene(
// 	'stat',
// 	async ctx => {
// 		const user = await User.findOne({ telegramid: ctx.from.id })
//
// 		const playerData = await getStatData(user.chosenServer, user.steam.steamID)
//
// 		const servers = {
// 			'nevada': 'Nevada',
// 			'side': 'Side',
// 			'future': 'Future'
// 		}
// 		await ctx.replyWithMarkdown(`Ваша статистика на Nevada ${servers[user.chosenServer]}:
//
// *Ранг:* ${playerData.rank}
// *Убийств:* ${playerData.kills}
// *Смертей:* ${playerData.deaths}
// *Выстрелов:* ${playerData.shoots}
// *Попаданий:* ${playerData.hits}
// *Хэдшотов:* ${playerData.headshots}
// *Ассистов:* ${playerData.assists}
// *Выигранных раундов:* ${playerData.round_win}
// *Проигранных раундов:* ${playerData.round_lose}
// *Время игры:* ${playerData.playtime}
// *Последнее подключение:* ${playerData.lastconnect}
//
// Статистика обновляется раз в 10 минут
// 		`)
//
// 			await ctx.scene.leave()
// 	}
// )

module.exports = stat
