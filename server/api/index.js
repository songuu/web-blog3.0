const login = require('./login')
const email = require('./mail')
const user = require('./user')
const comment = require('./comment')
const article = require('./article.js')
const plan = require('./plan.js')
const book = require('./book.js')
const music = require('./music.js')
const movie = require('./movie.js')
const tags = require('./tags.js')
const img = require('./img.js')
const common = require('./commonFile.js')

module.exports = (app) => {
	app.use(login)
	app.use(email)
	app.use(user)
	app.use(comment)
	app.use(article)
	app.use(tags)
	app.use(plan)
	app.use(book)
	app.use(music)
	app.use(movie)
	app.use(img)
	app.use(common)
}