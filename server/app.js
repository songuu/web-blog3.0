const express = require('express')
const bodyParser = require('body-parser')
const route = require('./api/index.js')
const path = require('path')

const app = express()

app.set('port', (process.env.port || 3003))
app.use(bodyParser.urlencoded({
	extended: true
}))
app.use(bodyParser.json({
	"limit": "10000kb"
}));
app.use(express.static(path.join(__dirname, './public')));

app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS,PATCH");
	next();
});

route(app)

app.listen(app.get('port'), function() {
	console.log('GetData http://localhost:' + app.get('port'))
})