const mongoose = require('mongoose')

const ContactSchema = mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Users',
	},
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
	},
	phone: {
		type: String,
	},
	type: {
		type: String,
		default: 'pessoal',
	},
	date: {
		type: Date,
		required: true,
		default: Date.now,
	},
})

module.exports = mongoose.model('Contacts', ContactSchema)
