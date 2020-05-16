const mongoose = require('mongoose');

const config = require('config');

const db = config.get('mongoURI');

// const url = process.env.MONGOLAB_URI
// 	? process.env.MONGOLAB_URI
// 	: 'mongodb://localhost/contact-keeper';

const connect = async () => {
	try {
		await mongoose.connect(db, {
			useNewUrlParser: true,
			useCreateIndex: true,
			useFindAndModify: false
		});

		console.log('MongoDB Connected...');
	} catch (error) {
		console.error(error.message);
		process.exit(1);
	}
};

module.exports = connect;
