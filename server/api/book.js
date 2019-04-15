const express = require('express')
const router = express.Router()
const db = require('../db/db.js')
const confirmToken = require('../middlewares/confirmToken')

// 发布图书
router.post('/api/book', confirmToken, (req, res) => {
		const book = {
			title: req.query.title,
			writer: req.query.writer,
			rate: req.query.rate,
			date: Date(),
		}
		new db.Book(book).save()
		return res.send({
			status: 200,
			msg: 'success'
		})
	}),

	//获取全部图书
	router.get('/api/books', (req, res) => {
		const title = req.query.title
		const writer = req.query.writer
		const rate = req.query.rate
		const page = req.query.page
		const limit = req.query.limit - 0 || 5
		const skip = limit * (page - 1)
		if(title) {
			db.Book.find({}).sort({
					date: -1
				}).limit(limit).skip(skip).exec()
				.then((books) => {
					return res.send({
						status: 200,
						data: books,
						msg: 'success'
					})
				})
		} else {
			db.Book.find({}).sort({
					date: -1
				}).limit(limit).skip(skip).exec()
				.then((books) => {
					return res.send({
						status: 200,
						data: books,
						msg: 'success'
					})
				})
		}
	})
//删除图书
router.delete('/api/book/:rid', confirmToken, (req, res) => {
	db.Book.remove({
		rid: req.params.rid
	}, (err, data) => {
		if(err) {
			return res.send({
				status: 500,
				msg: 'success'
			})
		}
		return res.send({
			status: 200,
			msg: 'success'
		})
	})
})
//获取部分图书
router.get('/api/somebooks', (req, res) => {
	const value = req.query.value
	const page = req.query.page || 1
	const skip = 4 * (page - 1)
	const re = new RegExp(value, 'i')
	db.Book.find({
			title: re,
		})
		.sort({
			date: -1
		}).limit(4).skip(skip).exec()
		.then((books) => {
			return res.send({
				status: 200,
				data: books,
				msg: 'success'
			})
		})
})
//获取一本书
router.get('/api/book/:rid', (req, res) => {
	db.Book.findOne({
		rid: req.params.rid
	}, (err, doc) => {
		if(err) {
			return res.send({
				status: 500,
				msg: 'success'
			})
		}
		return res.send({
			status: 200,
			data: doc,
			msg: 'success'
		})
	})
})
module.exports = router