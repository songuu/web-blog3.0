const jwt =require('jsonwebtoken')

// 检查token是否正确
const confirmToken = (req, res, next) => {
    if (!req.query.session) {
        return res.end('no token')
    } else {
        const token = req.query.session
        jwt.verify(token, '123', function (err) {
            if (err) {
                return res.end(err.message)
            }
        })
    }
    next()
}

module.exports = confirmToken
