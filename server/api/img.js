const express = require('express')
const router = express.Router()
const multer = require('multer')
const fs = require('fs')
const {uploadToken,qnupurl,domain} = require('../middlewares/getToken')

const upload = multer({
	dest: 'server/public/img/'
})
router.post('/api/upload', upload.single('file'), (req, res, next) => {
	var file = req.file;
	var filename = req.file.originalname;
	var mime = filename.split('.').pop();
	fs.renameSync('server/public/img/' + req.file.filename, 'server/public/img/' + req.file.filename + '.' + mime);
	res.send('http://127.0.0.1:3003/img/' + req.file.filename + '.' + mime)
})//本地上传

router.post('/api/getToken', (req, res, next) => {
	res.status(200).json({
		token: uploadToken,
		domain: domain,
		upUrl: qnupurl
	})
})//七牛云上传  获取token

module.exports = router