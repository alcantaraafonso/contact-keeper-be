const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = (req, res, next) => {
	//Get token from the Header
	const token = req.header('x-auth-token')

	//Check if not token
	if (!token) {
		return res.status(401).json({ msg: 'Nenhum token enviado' })
	}
	try {
		const decoded = jwt.verify(token, config.get('jwtSecret'))

		req.user = decoded.user
		next()
	} catch (error) {
		res.status(401).json({ msg: 'token inválido' })
	}
}
