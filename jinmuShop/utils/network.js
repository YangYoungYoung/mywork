//封装的HTTPS的请求类
const app = getApp()
var API_URL = 'https://xyt.xuanyutong.com/jmtq/'

function POST(url, params) {
  let promise = new Promise(function (resolve, reject) {
    wx.request({
      url: API_URL+url,
      data: params,
      method: 'POST',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
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