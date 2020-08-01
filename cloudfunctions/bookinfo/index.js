// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
var rp = require('request-promise')
// 云函数入口函数
exports.main = async (event, context) => {
  // 极速数据:https://api.jisuapi.com/isbn/query?appkey=67579a9021f27b03&isbn=
  // CSDN明夫：http://49.234.70.238:9001/book/worm/isbn?isbn=
  var res = rp('http://49.234.70.238:9001/book/worm/isbn?isbn='+event.isbn).then(html => {
    return html;
  }).catch( err =>{
    console.log(err)
  })
  return res
}