const { getSteamData } = require('./steamData')
const User = require('./models/User')

const register = async (steamid) => {
	try {
		const data = await getSteamData(steamid)
			.catch(err => console.log(err))

		const candidate = await User.findOne({ steamid })
		if (candidate) await User.findOneAndDelete({ steamid })

		const user = new User({
			steamid,
			steam: data,
			isAuthorized: false,
			authToken: simpleTokenGenerator()
		})
		await user.save()
	} catch (err) {
		console.log('Registration error', err)
	}
}

const simpleTokenGenerator = () => {
	const generateToken = require('password-generator')

	return generateToken(12, false)
}
