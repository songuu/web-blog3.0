const express = require('express')
const router = express.Router()
const db = require('../db/db.js')

router.get('/api/tags', (req, res) => {
	db.Article.find({
		isPublish: true
	}).then((doc) => {
		if(doc) {
			var arr = [];
			for(let item of doc) {
				if(item.tags && Object.prototype.toString.call(item.tags) === '[object Array]') {
					for(let i of item.tags) {
						arr.push(i)
					}
				}
			}
			return res.send({
				status: 200,
				data: arr,
				msg: 'success'
			})
		} else {
			return res.send({
				status: 500,
				msg: 'failed'
			})
		}
	})
})

module.exports = router