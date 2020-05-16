const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')

const router = express.Router()
const { check, validationResult } = require('express-validator')

const User = require('../models/Users')

//@Route    POST /api/users
//@desc     Grava um usuário to use the Contact Kepper
//@access   Public
router.post(
	'/',
	[
		check('name', 'Nome é obrigatório').not().isEmpty(),
		check('email', 'E-mail é obrigatório').isEmail(),
		check('password', 'Senha deve ter 6 ou mais dígitos').isLength({ min: 6 }),
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}

		const { name, email, password } = req.body
		try {
			let user = await User.findOne({ email })

			if (user) {
				return res.status(400).json({ msg: 'Usuário já existe' })
			}

			user = new User({
				name,
				email,
				password,
			})

			const salt = await bcrypt.genSalt(10)
			user.password = await bcrypt.hash(password, salt)

			const payload = {
				user: {
					id: user.id,
				},
			}

			await user.save()

			jwt.sign(
				payload,
				config.get('jwtSecret'),
				{
					expiresIn: 360000,
				},
				(err, token) => {
					if (err) {
						throw err
					} else {
						res.json({ token })
					}
				}
			)
		} catch (error) {
			console.log(error.message)
			return res.status(500).json('Server Error')
		}
	}
)

module.exports = router
