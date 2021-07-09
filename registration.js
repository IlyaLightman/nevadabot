const simpleTokenGenerator = () => {
	const generateToken = require('password-generator')

	return generateToken(12, false)
}
