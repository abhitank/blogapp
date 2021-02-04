//imported required files and modules
const Blog = require('../models/Blog');
const User = require('../models/User');
const db = require('../config/database');
const express = require('express');
const Joi = require('joi');

// setting up router

const router = express.Router();

//function to generate random token which will be used in user routes

function makeid(length = 30) {
   let result           = '';
   const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   const charactersLength = characters.length;
   for (let i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

//function to validate username and password entered by user

function validateUserDetails(user) {
	const schema = {
		username : Joi.string().min(3).required(),
		password : Joi.string().required(),
	}
	return Joi.validate(user, schema);
}

//user routes

//user register route

router.post('/user/register', (req, res) => {
	const { username, password } = req.body;
	const result = validateUserDetails(req.body);
	if (result.error) return res.json(result.error.details[0].message);
	User.create({
		username : username,
		password : password,
		token : makeid()
	})
		.then(() => res.json('user registered'))
		.catch((err) => res.json(err.message))
})

//user login route

router.get('/user/login', (req, res) => {
	const {username, password} = req.body;
	const result = validateUserDetails(req.body);
	if (result.error) return res.json(result.error.details[0].message);
	User.findOne({where : {username : username, password : password}})
		.then(user => {
			user.token = makeid();
			user.save();
			res.json(user)
		})
		.catch(err => res.json(err.message))
})

//function to validate details entered by user 

function validateBlog(blog) {
	const schema = {
		title : Joi.string().min(5).required(),
		blog_cont : Joi.string().min(100).required(),
		description : Joi.string().min(10).required(),
		token : Joi.string().required(),
	}
	return Joi.validate(blog, schema);
}


//blog routes

//route to get all blogs 

router.get('/', async(req, res) => {
	const {token} = req.body;
	const user = await User.findOne({where : {token : token}});
	if (user === null) return res.json('You are not authorised to see all the blogs. Please enter correct token.');
	Blog.findAll()
		.then((blogs) => res.json(blogs))
		.catch((err) => res.json(err.message))
})

//route to get a blog with particular id

router.get('/:id', async(req, res) => {
	const {id} = req.params;
	const {token} = req.body;
	const user = await User.findOne({where : {token : token}});
	if (user === null) return res.json('You are not authorised to see the blog. Please enter correct token.');
	Blog.findOne({ where: { id: id } })
		.then(blog => res.json(blog))
		.catch((err) => res.json(err.message));
})	

//route to post new blogs

router.post('/add', async(req, res) => {
	const { token, title, description, blog_cont } = req.body;
	const user = await User.findOne({where : {token : token}});
	if (user === null) return res.json('You are not authorised to add a new blog. Please enter correct token.');
	const result = validateBlog(req.body);
	if (result.error) return res.json(result.error.details[0].message);
	Blog.create({
		title : title,
		description : description,
		blog_cont : blog_cont
	})
		.then(blog => res.json(blog))
		.catch(err => res.json(err.message));
})

//route to update existing blog with a particular id

router.put('/:id', async(req, res) => {
	const {id} = req.params;
	const {token, title, description, blog_cont} = req.body;
	const user = await User.findOne({where : {token : token}});
	if (user === null) return res.json('You are not authorised to update the blog. Please enter correct token.');
	const result = validateBlog(req.body);
	if (result.error) return res.json(result.error.details[0].message);
	const blog = Blog.findOne({where : { id : id}})
		.then(blog => {
			blog.title = title;
			blog.description = description;
			blog.blog_cont = blog_cont;
			blog.save();
			res.json(blog)
		.catch(err => res.json(err.message))
		})
})


//route to delete a exsiting blog with particular id

router.delete('/:id', async(req, res) => {
	const {id} = req.params;
	const {token} = req.body;
	const user = await User.findOne({where : {token : token}});
	if (user === null) return res.json('You are not authorised to delete the blog. Please enter correct token.');
	Blog.destroy({where : {id : id}})
		.then(blog => res.json('blog deleted'))
		.catch(err => res.json(err.message));
})

module.exports = router;