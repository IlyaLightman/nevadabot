const { rconSideCommand } = require('./rconController')
const { getSteamData } = require('./steamData')

const ban = async (link, time, reason) => {
	await rconSideCommand(
		`sm_ban ${((await getSteamData(link)).steamID64)} ${time} ${reason}`)
}

const kick = async (link, reason) => {
	await rconSideCommand(
		`sm_kick ${((await getSteamData(link)).steamID64)} ${reason}`)
}

const mute = async (link, time, reason) => {
	await rconSideCommand(
		`sm_mute ${((await getSteamData(link)).steamID64)} ${time} ${reason}`)
}

const map = async map => {
	await rconSideCommand(``)
}

const msg = async toSay => {
	await rconSideCommand(`sm_say ${toSay}`)
}

module.exports = { ban, kick, mute, map, msg }
