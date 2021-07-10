const sqlite3 = require('sqlite3').verbose()
const ftp = require('ftp')
const fs = require('fs')
require('dotenv').config()

const dataUpdater = async redisClient => {
	try {
		await dataDownloading(1)

		// Loading to the cache
		const lr_db2 = new sqlite3.Database('./databases/side/lr_base.sq3')
		const vip_db2 = new sqlite3.Database('./databases/side/vip_core.sq3')

		const selectLvlBase = 'SELECT * FROM lvl_base'
		const selectVipBase = 'SELECT * FROM vip_users'

		await lr_db2.all(selectLvlBase, [], (err, rows) => {
			if (err) return console.log('side lr', err)
			redisClient.set('side/lr', JSON.stringify(rows), () => {})
		})
		await vip_db2.all(selectVipBase, [], (err, rows) => {
			if (err) return console.log('side vip', err)
			redisClient.set('side/vip', JSON.stringify(rows), () => {})
		})

		await lr_db2.close()
		await vip_db2.close()
	} catch (err) {
		console.log(err)
	}
}

const dataDownloading = srvNumber => {
	// 0 - Nevada, 1 - Side, 2 - Future

	return new Promise((resolve, reject) => {
		try {
			// FTP Download
			const client = new ftp()
			client.on('ready', () => {
				client.get(
					`${connectionData[srvNumber].host}_27045/addons/sourcemod/data/sqlite/lr_base.sq3`,
					(err, stream) => {
						if (err) return console.log('fuck', err)

						stream.pipe(fs.createWriteStream(
							`databases/${connectionData[srvNumber].title}/lr_base.sq3`))
						stream.once('close', () => {
							client.get(
								`${connectionData[srvNumber].host}_27045/addons/sourcemod/data/sqlite/vip_core.sq3`,
								(err, stream) => {
									if (err) return console.log('fuck', err)

									stream.pipe(fs.createWriteStream(
										`databases/${connectionData[srvNumber].title}/vip_core.sq3`))
									stream.once('close', () => {
										client.end()
										resolve('Data downloaded')
									})
								})
						})
					})
			})

			client.connect(connectionData[srvNumber])
		} catch(err) {
			reject(err)
		}
	})
}

const connectionData = [
	{
		host: '212.22.93.74',
		port: 8821,
		user: process.env.FIRST_LOGIN,
		password: process.env.FIRST_PASS,
		title: 'nevada'
	},
	{
		host: '212.22.93.106',
		port: 8821,
		user: process.env.SIDE_LOGIN,
		password: process.env.SIDE_PASS,
		title: 'side'
	}
]

module.exports = { dataUpdater, connectionData }
