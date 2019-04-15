const express = require('express')
const router = express.Router()
const db = require('../db/db.js')

router.get('/api/tags', (req, res) => {
	/*db.Article.find({isPublish: true}).distinct('tags', (err, doc) => {
	    if (err) {
	        console.log(err)
	    } else if (doc) {
	        res.send(doc)
	    }
	})*/
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
			res.send(arr)
		} else {
			console.log("error")
		}
	})
})

module.exports = router