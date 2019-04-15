const express = require('express')
const router = express.Router()
const db = require('../db/db.js')
const confirmToken = require('../middlewares/confirmToken')
const rand = require('csprng')
const sha1 = require('sha1')

// 修改账户
router.post('/api/user', confirmToken, (req, res) => {
	const salt = rand(160, 36)
	const user = {
		salt: salt,
		name: req.query.name,
		password: sha1(req.query.password + salt)
	}
	db.User.update({
		_id: req.query.id
	}, user, (err) => {
		if(err) {
			res.json({
				status: 500,
				msg: '修改失败！'
			})
		}
		return res.json({
			status: 200,
			msg: '修改成功！'
		})
	})
})

module.exports = router