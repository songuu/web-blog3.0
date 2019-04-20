const express = require('express')
const router = express.Router()
const db = require('../db/db.js')
const confirmToken = require('../middlewares/confirmToken')

//获取所有资源
router.get('/api/commonFiles', (req, res) => {
	const page = req.query.page
	const limit = req.query.limit - 0 || 3
	const skip = limit * (page - 1)
	db.Common.find({}).sort({
		date: -1
	}).limit(limit).skip(skip).exec().
	then((files) => {
		return res.send({
			status: 200,
			data: files,
			msg: 'success'
		})
	})
})

//删除资源
router.delete('/api/commonFile/:fid', confirmToken, (req, res) => {
	db.Common.remove({
		fid: req.query.fid
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

// 搜索资源  使用前端检索
/*router.get('/api/serchFiles', (req, res) => {
	const key = req.query.key
	const value = req.query.value
	const page = req.query.page || 1
	const skip = 4 * (page - 1)
	const re = new RegExp(value, 'i')

	if(key === 'name') {
		db.Common.find({
			name: re
		}).sort({
			date: -1
		}).limit(3).skip(skip).exec().then((files) => {
			return res.send({
				status: 200,
				data: files,
				msg: 'success'
			})
		})
	} else if(key === 'type') {
		db.Common.find({
			type: value
		}).sort({
			date: -1
		}).limit(3).skip(skip).exec().then((files) => {
			return res.send({
				status: 200,
				data: files,
				msg: 'success'
			})
		})
	} else {
		const nextDay = value + 'T24:00:00'
		db.Common.find({
			date: {
				$gte: new Date(value),
				$lt: new Date(nextDay)
			}
		}).sort({
			date: -1
		}).limit(3).skip(skip).exec().then((files) => {
			return res.send({
				status: 200,
				data: files,
				msg: 'success'
			})
		})
	}
})*/

//获取资源数量
router.get('/api/commonNum', (req, res) => {
	db.Common.find({}).then((files) => {
		return res.send({
			status: 200,
			data: files.length,
			msg: 'success'
		})
	})
})

module.exports = router