const express = require('express')
const router = express.Router()
const db = require('../db/db.js')

router.get('/api/archives', (req, res) => {
	const page = req.query.page
	const limit = req.query.limit - 0 || 3
	const skip = limit * (page - 1)
	db.Archive.find({}).sort({
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
	db.Archive.find({}).then((archives) => {
		return res.send({
			status: 200,
			data: archives.length,
			msg: 'success'
		})
	})
})

router.get('/api/artId', (req, res) => {
	const title = req.query.title
	const date = req.query.date
	db.Article.findOne({
		title: title,
		date: new Date(date)
	}, (err, doc) => {
		if(err) {
			return res.send({
				status: 500,
				msg: 'failed'
			})
		}
		return res.send({
			status: 200,
			data: doc.aid,
			msg: 'succcess'
		})
	})
})

module.exports = router