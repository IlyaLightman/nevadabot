const sqlite3 = require('sqlite3')
const ftp = require('ftp')
const fs = require('fs')
require('dotenv').config()

const dataUpdater = async redisClient => {
	await dataDownloading(1)

	return
	// Loading to the cache
	const lr_db2 = new sqlite3.Database('./data/side/lr_base.sq3')
	const vip_db2 = new sqlite3.Database('./data/side/vip_core.sq3')

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
}

const dataDownloading = async srvNumber => {
	// 0 - Nevada, 1 - Side, 2 - Future

	// FTP Download
	const client = new ftp()
	client.on('ready', () => {
		client.get('212.22.93.106_27045/addons/sourcemod/data/sqlite/lr_base.sq3',
			(err, stream) => {
				if (err) return console.log('fucking', err)

				stream.pipe(fs.createWriteStream('databases/side/lr_base.sq3'))
				stream.once('close', () => client.end())
		})

		client.get('212.22.93.106_27045/addons/sourcemod/data/sqlite/vip_core.sq3',
			(err, stream) => {
				if (err) return console.log('fucking', err)

				stream.pipe(fs.createWriteStream('databases/side/vip_core.sq3'))
				stream.once('close', () => client.end())
			})
	})

	client.connect(connectionData[srvNumber])
}

const connectionData = [
	{
		host: '212.22.93.74',
		port: 8821,
		user: process.env.FIRST_LOGIN,
		password: process.env.FIRST_PASS
	},
	{
		host: '212.22.93.106',
		port: 8821,
		user: process.env.SIDE_LOGIN,
		password: process.env.SIDE_PASS
	}
]

module.exports = { dataUpdater }
