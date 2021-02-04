//conncting our project to database
const Sequelize = require('sequelize');

const db = new Sequelize('blogapp', 'postgres', 'admin@123', {
	host : 'localhost',
	dialect : 'postgres'

})

module.exports = db;