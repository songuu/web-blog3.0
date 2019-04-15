const express = require('express')
const router = express.Router()
const db = require('../db/db.js')
const confirmToken = require('../middlewares/confirmToken')

// 发布文章
router.post('/api/article', confirmToken, (req, res) => {
		if(req.query.date) {
			const article = {
				comment_n: 0,
				title: req.query.title,
				content: req.query.content,
				date: req.query.date,
				tags: req.query.tags,
				isPublish: true,
				imgUrl: req.query.imgUrl
			}
			new db.Article(article).save()
			return res.send({
				status: 200,
				msg: 'success'
			})
		} else {
			const article = {
				comment_n: 0,
				title: req.query.title,
				content: req.query.content,
				date: Date(),
				tags: req.query.tags,
				isPublish: true,
				imgUrl: req.query.imgUrl
			}
			new db.Article(article).save()
			return res.send({
				status: 200,
				msg: 'success'
			})
		}
	}),

	//获取一篇文章
	router.get('/api/article/:aid', (req, res) => {
		db.Article.findOne({
			aid: req.params.aid
		}, (err, doc) => {
			if(err) {
				return res.send({
					status: 500,
					msg: 'failed'
				})
			}
			return res.send({
				status: 200,
				data: doc,
				msg: 'successed'
			})
		})
	})
//获取全部文章
router.post('/api/articles', confirmToken, (req, res) => {
	const page = req.query.page
	const value = req.query.value
	const sortname = req.query.sortname
	const limit = req.query.limit - 0 || 4
	const skip = limit * (page - 1)
	if(value) {
		if(sortname === 'date') {
			db.Article.find({
					tags: value,
					isPublish: true
				}).sort({
					date: -1
				}).limit(limit).skip(skip).exec()
				.then((articles) => {
					return res.send({
						status: 200,
						data: articles
					})
				})
		} else if(sortname === 'comment_n') {
			db.Article.find({
					isPublish: true
				}).sort({
					comment_n: -1
				}).limit(limit).skip(skip).exec()
				.then((articles) => {
					return res.send({
						status: 200,
						data: articles
					})
				})
		} else {
			db.Article.find({
					isPublish: true
				}).sort({
					date: -1
				}).limit(limit).skip(skip).exec()
				.then((articles) => {
					return res.send({
						status: 200,
						data: articles
					})
				})
		}
	} else {
		db.Article.find({
				isPublish: true
			}).sort({
				date: -1
			}).limit(limit).skip(skip).exec()
			.then((articles) => {
				return res.send({
					status: 200,
					data: articles
				})
			})
	}
})
//删除文章
router.delete('/api/article/:aid', confirmToken, (req, res) => {
	db.Article.remove({
		aid: req.query.aid
	}, (err, data) => {
		if(err) {
			return res.send({
				status: 500,
				msg: 'remove article failed'
			})
		} else {
			db.Comment.remove({
				articleId: req.query.aid
			}, (err, data) => {
				if(err) {
					return res.send({
						status: 500,
						msg: 'remove comment failed'
					})
				} else {
					return res.send({
						status: 200,
						msg: 'remove successed'
					})
				}
			})
		}
	})

})

//文章更新
router.patch('/api/article/:aid', confirmToken, (req, res) => {
	const aid = req.params.aid
	const article = {
		title: req.query.title,
		tags: req.query.tags,
		date: Date(),
		content: req.query.content,
		isPublish: true,
		imgUrl: req.query.imgUrl
	}
	db.Article.update({
		aid: aid
	}, article, (err, data) => {
		if(err) {
			return res.send({
				status: 401,
				msg: 'failed'
			})
		}
		return res.send({
			status: 200,
			msg: 'successed'
		})
	})
})

// 搜索一些文章
router.get('/api/someArticles', (req, res) => {
	const key = req.query.payload.key
	const value = req.query.payload.value
	const page = req.query.payload.page || 1
	const skip = 4 * (page - 1)
	const re = new RegExp(value, 'i')
	if(key === 'tags') { // 根据标签来搜索文章
		const arr = value.split(' ')
		db.Article.find({
				tags: {
					$all: arr
				},
				isPublish: true
			})
			.sort({
				date: -1
			}).limit(4).skip(skip).exec()
			.then((articles) => {
				res.send(articles)
			})
	} else if(key === 'title') { // 根据标题的部分内容来搜索文章
		db.Article.find({
				title: re,
				isPublish: true
			})
			.sort({
				date: -1
			}).limit(4).skip(skip).exec()
			.then((articles) => {
				res.send(articles)
			})
	} else if(key === 'date') { // 根据日期来搜索文章
		const nextDay = value + 'T24:00:00'
		db.Article.find({
				date: {
					$gte: new Date(value),
					$lt: new Date(nextDay)
				},
				isPublish: true
			})
			.sort({
				date: -1
			}).limit(4).skip(skip).exec()
			.then((articles) => {
				res.send(articles)
			})
	}
})
//获取全部文章aid
router.get('/api/aids', (req, res) => {
	/*db.Article.find({}).distinct('aid', (err, doc) => {
		if(err) {
			console.log(err)
		} else if(doc) {
			console.log(doc)
			res.send(doc)
		}
	})*/
	db.Article.find({}).then((doc) => {
		if(doc) {
			return res.send(doc)
		} else {
			console.log('error')
		}
	})
})

module.exports = router