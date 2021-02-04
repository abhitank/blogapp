const {Sequelize} = require('sequelize');
const db = require('../config/database');

// creating model for our users

const User = db.define('users', {
	username : {
		type : Sequelize.STRING
	},
	password : {
		type : Sequelize.STRING
	},
	token : {
		type : Sequelize.STRING
	}
})


module.exports = User;