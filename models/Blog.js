const {Sequelize} = require('sequelize');
const db = require('../config/database');

//creating model for our blogs

const Blog = db.define('blogs', {
	title : {
		type : Sequelize.STRING
	},
	description : {
		type : Sequelize.STRING
	},
	blog_cont : {
		type : Sequelize.STRING
	}
})


module.exports = Blog;