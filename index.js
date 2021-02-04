//imported required files and modules
const express = require('express');
const app = express();
const db = require('./config/database');

// authenticating database

db.authenticate()
	.then(() => console.log('database connected....'))
	.catch((err) => console.error(err.message));		

//middlewares

app.use(express.json());
app.use('/blogs', require('./routes/apiviews'));

//port

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('server running on port ', PORT, '...'));