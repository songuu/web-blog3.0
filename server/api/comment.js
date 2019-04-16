const express = require('express')
const router = express.Router()
const mail = require('../email')
const db = require('../db/db.js')

const emailForm = (title, name, otherName, message, content, url) => {
	let string = `
<div style="width: 90%; border: 2px solid lightgreen; margin: 1rem auto; padding: 1rem; text-align: center;">
        <p style="border-bottom: 1px dashed lightgreen; margin: 0;padding-bottom: 1rem; color: lightgreen; font-size: 1.25rem;">${title}</p>
        <p style="margin: 1rem 0 0;">hello,${name} &#x1f608</p>
        <p style="margin: 0 0 1rem;">${otherName}${message}</p>
        <p style="width: 70%; border-left: 4px solid lightgreen; padding: 1rem; margin: 0 auto 2rem; text-align: left;white-space: pre-line;">${content}</p>
    <a href= ${url} style="text-decoration: none; background: lightgreen;color: #fff; height: 2rem; line-height: 2rem; padding: 0 1rem; display: inline-block; border-radius: 0.2rem;">前往查看</a>
        </div>
    `
	return string
}

// 发布评论并通知站长和评论者
router.post('/api/comment', (req, res) => {
	console.log(req.query)
	db.Comment.findOne({
		name: req.query.name,
		articleId: req.query.articleId
	}, (err, doc) => {
		if(doc && doc.address !== req.query.address) {
			return res.end({
				status: 403,
				msg: '用户名已存在'
			})
		} else if(!doc || doc.address === req.query.address) {
			const comment = {
				imgName: req.query.imgName,
				name: req.query.name,
				address: req.query.address,
				date: Date(),
				content: req.query.content,
				articleId: req.query.articleId,
				like: 0,
				isRead: false //被阅读
			}
			if(/^@(.*):/.test(req.query.content)) {
				const reviewer = /^@(.*):/.exec(req.query.content)[1] // 评论者的名字
				db.Comment.findOne({
					name: reviewer,
					articleId: req.query.articleId
				}, (err, doc) => {
					const url = 'www.songuu.top' + req.query.curPath
					const replyEmail = doc.address
					const content = emailForm('欢迎常来我的博客', reviewer, req.query.name, '回复了你的评论', req.query.content, url)
					mail.send(replyEmail, '您在songyu的博客有一条新评论', content, res)
				})
			}
			new db.Comment(comment).save().then(() => {
				const url = 'www.songuu.top' + req.query.curPath
				const content = emailForm('MyBlog Message', '站长', req.query.name, '评论了你的文章', req.query.content, url)
				mail.send('songyuduck@163.com', '您的博客有一条新评论', content, res)
			}).catch(err => {
				console.log(err)
			})
			db.Article.update({
				aid: req.query.articleId
			}, {
				$inc: {
					comment_n: 1
				}
			}, (err) => {
				if(err) {
					console.log(err)
				}
				return res.send({
					status: 200,
					msg: 'succcess'
				})
			})
		}
	})
})

// 获取某一篇文章的所有评论
router.get('/api/comments', (req, res) => {
	const articleId = req.query.id
	if(req.query.sort === 'date') { // 根据时间排序评论
		db.Comment.find({
				articleId: articleId
			}, 'name date content like imgName').sort({
				date: -1
			}).exec()
			.then((comments) => {
				return res.send({
					status: 200,
					data: comments,
					msg: 'success'
				})
			})
	} else if(req.query.sort === 'like') { // 根据点赞数量排序评论
		db.Comment.find({
				articleId: articleId
			}, 'name date content like imgName').sort({
				like: -1
			}).exec()
			.then((comments) => {
				return res.send({
					status: 200,
					data: comments,
					msg: 'success'
				})
			})
	} else { // 根据文章的aid获取所有评论
		db.Comment.find({
			articleId: articleId
		}, 'name date content like imgName').exec().then((comments) => {
			return res.send({
				status: 200,
				data: comments,
				msg: 'success'
			})
		})
	}
})

// 获取所有评论
router.get('/api/allcomments', (req, res) => {
	db.Comment.find({}).sort({
			date: -1
		}).exec()
		.then((comments) => {
			return res.send({
				status: 200,
				data: comments,
				msg: 'success'
			})
		})
})

// 更新评论的点赞数
router.patch('/api/comments/:id', (req, res) => {
	const id = req.query.id
	if(req.query.option === 'add') {
		db.Comment.update({
			_id: id
		}, {
			$inc: {
				like: 1
			}
		}, (err, data) => {
			if(err) {
				return res.send({
					status: 500,
					msg: 'fail in updating like'
				})
			} else {
				return res.send({
					status: 200,
					msg: 'succeed in updating like'
				})
			}
		})
	} else if(req.query.option === 'drop') {
		db.Comment.update({
			_id: id
		}, {
			$inc: {
				like: -1
			}
		}, (err, data) => {
			if(err) {
				return res.send({
					status: 500,
					msg: 'fail in updating like'
				})
			} else {
				return res.send({
					status: 200,
					msg: 'succeed in updating like'
				})
			}
		})
	}
})

// 获取总的评论数
router.get('/api/commetsNum', (req, res) => {
	db.Article.find({
		isPublish: true
	}).distinct('comment_n', (err, doc) => {
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

//更新是否阅读
router.patch('/api/commentss', (req, res) => {
	const id = req.query.id
	const date = req.query.date
	db.Comment.update({
		articleId: id,
		date: date
	}, {
		$set: {
			isRead: true
		}
	}, (err) => {
		if(err) {
			return res.send({
				status: 500,
				msg: 'failed'
			})
		}
		return res.send({
			status: 200,
			msg: 'succeed'
		})
	})
})
module.exports = router