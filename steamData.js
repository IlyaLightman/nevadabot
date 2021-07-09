const fetch = require('node-fetch')
const SteamID = require('steamid')

const getSteamData = async url => {
	try {
		let steamid = ''

		const steamUrl = 'https://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001'
		await fetch(
			`${steamUrl}/?key=${process.env.STEAM_API}&vanityurl=${url}`)
			.then(res => res.json())
			.then(json => steamid = json.response.steamid)

		const sid = new SteamID(steamid)

		return {
			steamID: sid.getSteam2RenderedID(),
			steamID3: sid.getSteam3RenderedID(),
			steamID64: sid.getSteamID64()
		}
	} catch (err) {
		console.log(err)
		return {
			steamID: '',
			steamID3: '',
			steamID64: ''
		}
	}
}

module.exports = { getSteamData }
