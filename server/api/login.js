const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const db = require('../db/db.js')
const sha1 = require('sha1')

const creatToken = (id, name) => {
	return jwt.sign({
		id: id,
		name: name
	}, '123', {
		expiresIn: '7d'
	})
}

router.post('/api/login', (req, res) => {
	db.User.findOne({
		name: req.query.name
	}, (err, doc) => {
		if(err || !doc) {
			return res.json({
				status: 500,
				msg: 'failed'
			})
		}
		const salt = doc.salt
		if(doc.password === sha1(req.query.password + salt)) {
			const token = creatToken(doc._id, doc.name)
			return res.json({
				status: 200,
				data: {
					id: doc._id,
					name: doc.name,
					token: token
				},
				msg: 'success'
			})
		} else {
			return res.json({
				status: 401,
				msg: 'failed'
			})
		}
	})
})

module.exports = router