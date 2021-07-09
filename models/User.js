const { model, Schema } = require('mongoose')

const schema = new Schema({
	steamid: String,
	isAuthorized: {
		type: Boolean,
		default: false
	},
	authToken: String,
	telegramid: String,
	steam: Object
})

module.exports = model('User', schema)
