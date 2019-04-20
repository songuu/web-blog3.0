const express = require('express')
const router = express.Router()
const db = require('../db/db.js')
const multer = require('multer')
const fs = require('fs')
const {
	uploadToken,
	qnupurl,
	domain
} = require('../middlewares/getToken')

const upload = multer({
	dest: 'public/img/'
})

function toDate(d) {
	var year = d.getFullYear() + '';
	var month = d.getMonth() + 1 + '';
	var day = d.getDate() + '';
	var h = d.getHours() + '';
	var m = d.getMinutes() + '';
	var s = d.getSeconds() + '';
	return year + month + day + h + m + s;
}

router.post('/api/upload', upload.single('file'), (req, res, next) => {
	//暂时不考虑同名文件
	var title = req.body.title || '';
	var file = req.file;
	var filename = req.file.originalname;
	var mime = filename.split('.').pop();
	const d = new Date();

	//以文章标题为文件夹保存图片
	if(title && title !== '') {
		if(fs.existsSync('./public/img/' + title)) {
			fs.renameSync(file.path, './public/img/' + title + '/' + toDate(d) + filename);
		} else {
			fs.mkdir('./public/img/' + title, function(err) {
				if(err) {
					console.log(err);
					return;
				} else {
					fs.renameSync(file.path, './public/img/' + title + '/' + toDate(d) + filename);
				}
			})
		}
		const img = {
			name: title,
			url: 'http://127.0.0.1:3003/img/' + title + '/' + toDate(d) + filename,
			type: 'img',
			time: d
		}
		new db.Common(img).save()
		return res.send({
			status: 200,
			data: 'http://127.0.0.1:3003/img/' + title + '/' + toDate(d) + filename,
			msg: 'success'
		})
	} else {
		if(fs.existsSync('./public/img/common')) {
			fs.renameSync(file.path, './public/img/common/' + toDate(d) + filename);
		} else {
			fs.mkdir('./public/img/common', function(err) {
				if(err) {
					console.log(err);
					return;
				} else {
					fs.renameSync(file.path, './public/img/common/' + toDate(d) + filename);

				}
			})
		}
		const img = {
			name: filename,
			url: 'http://127.0.0.1:3003/img/common/' + toDate(d) + filename,
			type: 'img',
			time: d
		}
		db.Common(img).save()
		return res.send({
			status: 200,
			data: 'http://127.0.0.1:3003/img/common/' + toDate(d) + filename,
			msg: 'success'
		})
	}

	//保存在统一的路径下面

}) //本地上传

router.post('/api/getToken', (req, res, next) => {
	res.status(200).json({
		token: uploadToken,
		domain: domain,
		upUrl: qnupurl
	})
}) //七牛云上传  获取token

module.exports = router