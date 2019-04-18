const express = require('express')
const router = express.Router()
const db = require('../db/db.js')

router.get('/api/archives', (req, res) => {
	const page = req.query.page
	const limit = req.query.limit - 0 || 3
	const skip = limit * (page - 1)
	db.Article.find({
			}, 'aid title date').sort({
			date: -1
		}).limit(limit).skip(skip).exec()
		.then((archives) => {
			return res.send({
				status: 200,
				data: archives,
				msg: 'success'
			})
		})
})

router.get('/api/hids', (req, res) => {
	db.Article.find({}).then((archives) => {
		return res.send({
			status: 200,
			data: archives.length,
			msg: 'success'
		})
	})
})


module.exports = router