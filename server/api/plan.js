const express = require('express')
const router = express.Router()
const db = require('../db/db.js')
const confirmToken = require('../middlewares/confirmToken')

// 发布计划
router.post('/api/plan', confirmToken, (req, res) => {
		const plan = {
			title: req.query.title,
			status: req.query.status,
			date: Date(),
		}
		new db.Plan(plan).save()
		return res.send({
			status: 200,
			msg: 'success'
		})
	}),

	//获取全部计划
	router.get('/api/plans', (req, res) => {
		const title = req.query.title
		const status = req.query.status
		const limit = req.query.limit - 0 || 10
		if(title) {
			db.Plan.find({}).sort({
					date: -1
				}).limit(limit).exec()
				.then((plans) => {
					return res.send({
						status: 200,
						data: plans,
						msg: 'success'
					})
				})
		} else {
			db.Plan.find({}).sort({
					date: -1
				}).limit(limit).exec()
				.then((plans) => {
					return res.send({
						status: 200,
						data: plans,
						msg: 'success'
					})
				})
		}
	})
//删除计划
router.delete('/api/plan/:id', confirmToken, (req, res) => {
	db.Plan.remove({
		id: req.query.id
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
module.exports = router