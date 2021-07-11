const Rcon = require('rcon')
const { connectionData } = require('./dataController')
require('dotenv').config()

const options = {
	tcp: true,
	challenge: false
}

const connSide = new Rcon(connectionData[1].host, 27045, process.env.SIDE_RCON, options)
connSide
	.on('auth', () => console.log('Rcon Side Authed'))
	// .on('response', console.log)

const connection = async () => {
	try {
		await connSide.connect()

		// setTimeout(() => connSide.send('status'), 6000)
	} catch (err) {
		console.log('Auth Rcon Failed', err)
	}
}
connection().then()

const rconSideCommand = command => connSide.send(command)

module.exports = { rconSideCommand }
