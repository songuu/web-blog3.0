const nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
    service: '163',
    auth: {
        user: 'songyuduck@163.com',
        pass: 'songyu19960525'
    }
})

exports.send = function(to, subject, html, res) {
    const mailOptions = {
        from: '"博客小管家" <songyuduck@163.com>',
        to : to,
        subject : subject,
        html : html
    }

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error)
            res.status(504).end("通知邮件发送失败")
        } else {
            console.log("Message sent: " + info.response)
        }
    })
}
