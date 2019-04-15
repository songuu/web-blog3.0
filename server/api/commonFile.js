const express = require('express')
const router = express.Router()
const db = require('../db/db.js')
const confirmToken = require('../middlewares/confirmToken')


//获取所有资源
router.get('/api/commonFiles', (req, res) => {
	//
})
//添加资源
router.post('/api/commonFile/:Fid', (req, res) => {
	//
})

//删除资源
router.delete('/api/commonFile/:Fid', confirmToken, (req, res) => {
	//
})

//资源更新
router.patch('/api/commonFile/:Fid', confirmToken, (req, res) => {
	//
})

// 搜索资源
router.get('/api/serchFile/:name', (req, res) => {
	
})

module.exports = router