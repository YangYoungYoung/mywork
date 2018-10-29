//封装的HTTPS的请求类
const app = getApp()
var API_URL = 'http://192.168.0.146:8080/api/'

function POST(url, params,method) {
  let promise = new Promise(function (resolve, reject) {
    
    wx.request({
      url: url,
      data: params,
      method: method,
      header: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      success: function (res) {
        // console.log('返回结果：' + res)
        if(res.statusCode==200){
        resolve(res);
        }else{
          reject('获取信息错误');
        }
      },
      fail:function(e){
        reject('网络出错');
      }
    })
  });
  return promise
}
module.exports = {
  POST: POST
}