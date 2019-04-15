/*
七牛云配置
*/
const qiniu = require('qiniu')
const accessKey = 'JVjrJkUHRN7xLwWkJZBbg_CNbB2UBcdcN-td6wrU'
const secretKey = 'AcwhVLTA905CYqI-_-1ScWNBXulOJFYAE82ZL1-y'
const domain = 'pa5114ths.bkt.clouddn.com'
const qnupurl = 'https://up.qiniup.com'
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
const options = {
  scope: 'image',
  expires: 21600
}
const putPolicy = new qiniu.rs.PutPolicy(options)
const uploadToken = putPolicy.uploadToken(mac)

module.exports = {
  uploadToken,
  domain,
  qnupurl
}