const express = require('express');
const connectDB = require('./config/db');
const cors = require('./config/cors');

const app = express();

//Connectiong on DB
connectDB();

const PORT = process.env.PORT || 5000;

//Init Middleware - Bodyparser
app.use(express.json({ extended: false }));

//adicionando o middleware do CORS
app.use(cors);

//Define de routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/contacts', require('./routes/contacts'));

app.listen(PORT, () => {
	console.log(`Server listening on port: ${PORT}`);
});
