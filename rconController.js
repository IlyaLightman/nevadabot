const Rcon = require('rcon')
const { connectionData } = require('./dataController')
require('dotenv').config()

const options = {
	tcp: true,
	challenge: false
}

const connSide = new Rcon(connectionData[1].host, 27045, process.env.SIDE_RCON, options)
connSide.on('auth', () => console.log('Rcon Side Authed')).on('response', console.log)

const connection = async () => {
	try {
		await connSide.connect()
		// await connSide.send(`rcon_password ${process.env.SIDE_RCON}`)
	} catch (err) {
		console.log('Auth Rcon Failed', err)
	}
}
connection().then()

console.log('fuck')

const rconSideCommand = command => connSide.send(command)

module.exports = { rconSideCommand }
