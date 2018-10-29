//封装的HTTPS的请求类
const app = getApp()
var API_URL = 'http://192.168.0.128:8082/'

function POST(url, params,method,header) {
  let promise = new Promise(function (resolve, reject) {
    console.log("===============" +  url);
    wx.request({
      url: url,
      data: params,
      method: method,
      header: header,
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