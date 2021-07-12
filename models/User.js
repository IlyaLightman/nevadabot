const { model, Schema } = require('mongoose')

const schema = new Schema({
	steamid: String,
	isAuthorized: {
		type: Boolean,
		default: false
	},
	authToken: String,
	telegramid: String,
	steam: Object,
	admin: {
		nevada: { type: Boolean, default: false },
		side: { type: Boolean, default: false },
		future: { type: Boolean, default: false }
	},
	chosenServer: {
		type: String,
		default: 'future'
	}
})

module.exports = model('User', schema)
