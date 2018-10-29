// pages/order/order.js
var app = getApp()
var network = require("../../utils/network.js");
var common = require("../../utils/common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[
      { id: 1, name: '新鲜芹菜', state: 2, number: 4, price: 0.01 },
      { id: 2, name: '素米 500g', state: 1, number: 1, price: 0.03 }
    ],
    remark:"不要辣的"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  //加餐
  add:function(){
    wx.navigateTo({
      url: '../index/index'
    })
  },
  // 发起支付
  payOrder: function (e) {
    var that = this;
    var orderid = e.target.dataset.id;
    var money = e.target.dataset.price
    console.log("当前的订单id是：" + wx.getStorageSync("openid"));
    let url = "weixin/getRepayId"
    var params = {
      openid: wx.getStorageSync("openid"),
      // orderId: orderid,
      // totalPrice: money
    }
    let method = "GET";
    let header = "";
    wx.showLoading({
      title: '加载中...',
    }),
      network.POST(url, params, method, header).then((res) => {

        console.log("支付的返回值是：" + res.data);
        wx.requestPayment({
          'timeStamp': res.data.timeStamp,
          'nonceStr': res.data.nonceStr,
          'package': res.data.package,
          'signType': 'MD5',
          'paySign': res.data.paySign,
          'success': function (res) {
            // console.log("调起支付成功")
            wx.hideLoading();
            wx.showToast({
              title: "支付成功",
              icon: 'succes',
              duration: 1500
            })
            // that.updateOrderState();
          },
          'fail': function (res) {
            console.log("调起支付失败" + res.data)
            wx.showToast({
              title: "支付失败",
              duration: 1500
            })
          },
          'complete': function (res) { }
        })
      }).catch((errMsg) => {
        wx.hideLoading();
        console.log(errMsg); //错误提示信息
        wx.showToast({
          title: '网络错误',
          icon: 'loading',
          duration: 1500,
        })
      });
    that.onShow()
  }
})