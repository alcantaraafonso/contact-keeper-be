const express = require('express')

const { check, validationResult } = require('express-validator')

//auth middleware
const auth = require('../middleware/auth')

const router = express.Router()

const User = require('../models/Users')

const Contacts = require('../models/Contacts')

//@Route    GET /api/contacts
//@desc     Buscando todos os contatos
//@access   Private
router.get('/', auth, async (req, res) => {
	try {
		const contacts = await Contacts.find({ user: req.user.id }).sort({
			date: -1,
		})

		res.json(contacts)
	} catch (err) {
		console.log(err.message)
		res.status(500).send('Erro interno')
	}
})

//@Route    POST /api/contacts
//@desc     Cria um usuário
//@access   Private
router.post(
	'/',
	[auth, [check('name', 'Nome é obrigatório').not().isEmpty()]],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}

		const { name, email, phone, type } = req.body

		try {
			const newContact = new Contacts({
				name,
				email,
				phone,
				type,
				user: req.user.id,
			})

			const contact = await newContact.save()

			res.json(contact)
		} catch (error) {
			console.log(error.message)
			return res.status(500).json('Server Error')
		}
	}
)

//@Route    PUT /api/contacts/:id
//@desc     Atualiza o contato
//@access   Private
router.put('/:id', auth, async (req, res) => {
	const { name, email, phone, type } = req.body

	//Build a contact object
	const contactField = {}
	if (name) contactField.name = name
	if (email) contactField.email = email
	if (phone) contactField.phone = phone
	if (type) contactField.type = type

	try {
		let contact = await Contacts.findById(req.params.id)
		if (!contact) {
			return res.status(404).json({ msg: 'Contato não existe' })
		}

		//é o dono do contato que quer alterar
		if (contact.user.toString() !== req.user.id) {
			return res
				.status(401)
				.json({ msg: 'Usuário não autorizado pra performar esta ação' })
		}

		contact = await Contacts.findByIdAndUpdate(
			req.params.id,
			{ $set: contactField },
			{ new: true }
		)

		res.json(contact)
	} catch (error) {
		console.log(error.message)
		return res.status(500).json('Server Error')
	}
})

//@Route    DELETE /api/contacts/:id
//@desc     Deleta o usuário
//@access   Private
router.delete('/:id', auth, async (req, res) => {
	try {
		let contact = await Contacts.findById(req.params.id)
		if (!contact) {
			return res.status(404).json({ msg: 'Contato não existe' })
		}

		//é o dono do contato que quer alterar
		if (contact.user.toString() !== req.user.id) {
			return res
				.status(401)
				.json({ msg: 'Usuário não autorizado pra performar esta ação' })
		}

		await Contacts.findByIdAndRemove(req.params.id)

		res.json({ msg: 'Contato removido' })

		res.json(contact)
	} catch (error) {
		console.log(error.message)
		return res.status(500).json('Server Error')
	}
})

module.exports = router
