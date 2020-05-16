const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const { check, validationResult } = require('express-validator')

//auth middleware
const auth = require('../middleware/auth')

const router = express.Router()

const User = require('../models/Users')

//@Route    GET /api/auth
//@desc     Busca o usuário logado
//@access   Private
router.get('/', auth, async (req, res) => {
	try {
		const users = await User.findById(req.user.id).select('-password')
		res.json(users)
	} catch (error) {
		console.log(error.message)
		res.status(500).send('Erro interno')
	}
})

//@Route    POST /api/auth
//@desc     Autentica usuário e retorna o Token
//@access   Public
router.post(
	'/',
	[
		check('email', 'Entre com um e-mail válido').isEmail(),
		check('password', 'Senha requerida').exists(),
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}

		const { email, password } = req.body
		try {
			let user = await User.findOne({ email })

			if (!user) {
				return res.status(400).json({ msg: 'Credencial inválida' })
			}

			const isMatch = await bcrypt.compare(password, user.password)
			if (!isMatch) {
				return res.status(400).json({ msg: 'Credencial inválida' })
			}

			const payload = {
				user: {
					id: user.id,
				},
			}

			jwt.sign(
				payload,
				config.get('jwtSecret'),
				{
					expiresIn: 360000,
				},
				(err, token) => {
					if (err) throw err
					res.json({ token })
				}
			)
		} catch (error) {
			console.log(error.message)
			res.status(500).send('Erro Interno')
		}
	}
)

module.exports = router
