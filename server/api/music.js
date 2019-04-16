const express = require('express')
const router = express.Router()
const db = require('../db/db.js')
const confirmToken = require('../middlewares/confirmToken')

// 发布音乐
router.post('/api/music', confirmToken, (req, res) => {
		const music = {
			title: req.query.title,
			singer: req.query.singer,
			rate: req.query.rate,
			url: req.query.url,
			pwd: req.query.pwd,
			date: Date(),
		}
		new db.Music(music).save()
		return res.send({
			status: 200,
			msg: 'success'
		})
	}),

	//获取全部音乐
	router.get('/api/musics', (req, res) => {
		const title = req.query.title
		const singer = req.query.singer
		const rate = req.query.rate
		const page = req.query.page
		const limit = req.query.limit - 0 || 5
		const skip = limit * (page - 1)
		if(title) {
			db.Music.find({}).sort({
					date: -1
				}).limit(limit).skip(skip).exec()
				.then((musics) => {
					return res.send({
						status: 200,
						data: musics,
						msg: 'success'
					})
				})
		} else {
			db.Music.find({}).sort({
					date: -1
				}).limit(limit).skip(skip).exec()
				.then((musics) => {
					return res.send({
						status: 200,
						data: musics,
						msg: 'success'
					})
				})
		}
	})
//删除音乐
router.delete('/api/music/:bid', confirmToken, (req, res) => {
	db.Music.remove({
		bid: req.query.bid
	}, (err) => {
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

//获取部分音乐
router.get('/api/somemusics', (req, res) => {
	const value = req.query.value
	const page = req.query.page || 1
	const skip = 4 * (page - 1)
	const re = new RegExp(value, 'i')
	db.Music.find({
			title: re,
		})
		.sort({
			date: -1
		}).limit(4).skip(skip).exec()
		.then((musics) => {
			return res.send({
				status: 200,
				data: musics,
				msg: 'success'
			})
		})
})
//获取一首歌
router.get('/api/music/:bid', (req, res) => {
	db.Music.findOne({
		bid: req.query.bid
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