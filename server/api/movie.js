const express = require('express')
const router = express.Router()
const db = require('../db/db.js')
const confirmToken = require('../middlewares/confirmToken')

// 发布电影
router.post('/api/movie', confirmToken, (req, res) => {
		const movie = {
			title: req.query.title,
			director: req.query.director,
			rate: req.query.rate,
			date: Date(),
		}
		new db.Movie(movie).save()
		return res.send({
			status: 200,
			msg: 'success'
		})
	}),

	//获取全部电影
	router.get('/api/movies', (req, res) => {
		const title = req.query.title
		const director = req.query.director
		const rate = req.query.rate
		const page = req.query.page
		const limit = req.query.limit - 0 || 5
		const skip = limit * (page - 1)
		if(title) {
			db.Movie.find({}).sort({
					date: -1
				}).limit(limit).skip(skip).exec()
				.then((movies) => {
					return res.send({
						status: 200,
						data: movies,
						msg: 'success'
					})
				})
		} else {
			db.Movie.find({}).sort({
					date: -1
				}).limit(limit).skip(skip).exec()
				.then((movies) => {
					return res.send({
						status: 200,
						data: movies,
						msg: 'success'
					})
				})
		}
	})
//删除电影
router.delete('/api/movie/:cid', confirmToken, (req, res) => {
	db.Movie.remove({
		cid: req.query.cid
	}, (err, data) => {
		if(err) {
			return res.send({
				status: 500,
				msg: 'failed'
			})
		}
		return res.send({
			status: 200,
			msg: 'success'
		})
	})
})

//获取部分电影
router.get('/api/somemovies', (req, res) => {
	const value = req.query.value
	const page = req.query.page || 1
	const skip = 4 * (page - 1)
	const re = new RegExp(value, 'i')
	db.Movie.find({
			title: re,
		})
		.sort({
			date: -1
		}).limit(4).skip(skip).exec()
		.then((movies) => {
			return res.send({
				status: 200,
				data: movies,
				msg: 'success'
			})
		})
})
//获取一个电影
router.get('/api/movie/:cid', (req, res) => {
	db.Movie.findOne({
		cid: req.query.cid
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
			msg: 'success'
		})
	})
})
module.exports = router