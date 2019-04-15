const mongoose = require('mongoose')
const Schema = mongoose.Schema
const data = require('./mock/data')
const plan = require('./mock/plan')
const book = require('./mock/book')
const music = require('./mock/music')
const movie = require('./mock/movie')
const sha1 = require('sha1')
const rand = require('csprng')
const Sequence = require('./sequence')

const UserSchema = new Schema({
	name: String,
	password: String,
	salt: String // 使用csprng随机生成的盐
}, {
	versionKey: false
})

const ArticleSchema = new Schema({
	aid: {
		type: Number,
		index: {
			unique: true
		}
	},
	title: String,
	content: String,
	tags: [String],
	date: Date,
	isPublish: Boolean,
	comment_n: Number,
	imgUrl: String
}, {
	versionKey: false
})
const CommentSchema = new Schema({
	imgName: String,
	name: String,
	address: String,
	content: String,
	articleId: Number,
	date: Date,
	like: Number,
	isRead: Boolean //被阅读
}, {
	versionKey: false
})
const PlanSchema = new Schema({
	id: {
		type: Number,
		index: {
			unique: true
		}
	},
	title: String,
	status: Boolean,
	date: Date
}, {
	versionKey: false
})
const BookSchema = new Schema({
	rid: {
		type: Number,
		index: {
			unique: true
		}
	},
	title: String,
	writer: String,
	rate: String,
	date: Date,
	url: String,
	pwd: String
}, {
	versionKey: false
})
const MusicSchema = new Schema({
	bid: {
		type: Number,
		index: {
			unique: true
		}
	},
	title: String,
	singer: String,
	rate: String,
	date: Date,
	url: String,
	pwd: String
}, {
	versionKey: false
})
const MovieSchema = new Schema({
	cid: {
		type: Number,
		index: {
			unique: true
		}
	},
	title: String,
	director: String,
	rate: String,
	date: Date,
	url: String,
	pwd: String
}, {
	versionKey: false
})
const CommonSchema = new Schema({
	Fid: {
		type: Number,
		index: {
			unique: true
		}
	},
	name: String,
	url: String,
	type: String,
	dir: String //文件描述
})
// 生成从0开始自增长的文章aid
ArticleSchema.pre('save', function(next) {
	var self = this;
	if(self.isNew) {
		Sequence.increment('Article', function(err, result) {
			if(err)
				throw err;
			self.aid = result.value.next;
			next();
		});
	} else {
		next();
	}
})
PlanSchema.pre('save', function(next) {
	var self = this;
	if(self.isNew) {
		Sequence.increment('Plan', function(err, result) {
			if(err)
				throw err;
			self.id = result.value.next;
			next();
		});
	} else {
		next();
	}
})
BookSchema.pre('save', function(next) {
	var self = this;
	if(self.isNew) {
		Sequence.increment('Book', function(err, result) {
			if(err)
				throw err;
			self.rid = result.value.next;
			next();
		});
	} else {
		next();
	}
})
MusicSchema.pre('save', function(next) {
	var self = this;
	if(self.isNew) {
		Sequence.increment('Music', function(err, result) {
			if(err)
				throw err;
			self.bid = result.value.next;
			next();
		});
	} else {
		next();
	}
})
MovieSchema.pre('save', function(next) {
	var self = this;
	if(self.isNew) {
		Sequence.increment('Movie', function(err, result) {
			if(err)
				throw err;
			self.cid = result.value.next;
			next();
		});
	} else {
		next();
	}
})
CommonSchema.pre('save', function(next) {
	var self = this
	if(self.isNew) {
		Sequence.increment('Common', function(err, result) {
			if(err) {
				throw err;
			}
			self.Fid = result.value.next;
			next();
		})
	} else {
		next()
	}
})

const Models = {
	User: mongoose.model('User', UserSchema),
	Article: mongoose.model('Article', ArticleSchema),
	Comment: mongoose.model('Comment', CommentSchema),
	Plan: mongoose.model('Plan', PlanSchema),
	Book: mongoose.model('Book', BookSchema),
	Music: mongoose.model('Music', MusicSchema),
	Movie: mongoose.model('Movie', MovieSchema),
	Common: mongoose.model('Common', CommonSchema)
}

// 初始化数据
const initialize = () => {
	console.log('beginning to initialize data...')
	Models.User.find({}, (err, doc) => {
		if(err) {
			console.log(err)
			console.log('initialize failed')
		} else if(!doc.length) {
			const salt = rand(160, 36)
			// 第一次创建站长账户
			new Models['User']({
				name: 'songyu',
				password: sha1('123456' + salt),
				salt: salt
			}).save()
			Promise.all(
					[
						data.map((item) => {
							new Models['Article'](item).save()
						}),
						plan.map((item) => {
							new Models['Plan'](item).save()
						}),
						book.map((item) => {
							new Models['Book'](item).save()
						}),
						music.map((item) => {
							new Models['Music'](item).save()
						}),
						movie.map((item) => {
							new Models['Movie'](item).save()
						})
					]
				).then(() => {
					console.log('initialize successfully')
				})
				.catch(() => {
					console.log('initialize failed')
				})
		} else {
			console.log('initialize successfully')
		}
	})
}

mongoose.connect('mongodb://127.0.0.1/my-blog', {
	useMongoClient: true,
	connectTimeoutMS: 1000
})

const db = mongoose.connection

db.on('error', console.error.bind(console, 'Database connection error.'));
db.once('open', () => {
	console.log('The database has connected.')
	initialize()
});

module.exports = Models