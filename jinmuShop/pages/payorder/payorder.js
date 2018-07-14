// pages/payorder/payorder.js
var common = require("../../utils/common.js");
var network = require("../../utils/network.js");
var goods=[]
var orderId
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showAddr: false,
    showAddAddr: false,
    totalMoney: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    orderId = options.orderId;
    let that = this
    let url = "selectOrderViewServlet"
    var params = {
      orderId: orderId
    }
    wx.showLoading({
      title: '加载中...',
    }),
      network.POST(url, params).then((res) => {
        wx.hideLoading();
        // console.log("订单的结果是：" + res.data.ListGood);
        goods = res.data.ListGood
        var total = 0;
        for(let i=0;i<goods.length;i++){
          total += goods[i].number * goods[i].goodPrice;
        }
        that.setData({
          detail: goods,
          totalMoney:total
        })
      }).catch((errMsg) => {
        wx.hideLoading();
        // console.log(errMsg); //错误提示信息
        wx.showToast({
          title: '网络错误',
          icon: 'loading',
          duration: 1500,
        })
      });
  },

  //支付
  placeOrder:function(e) {
    var that = this
    var url = "appPayMentServlet"
    var params = {
      openid:wx.getStorageSync("openid"),
      orderId: orderId,
      totalPrice: that.data.totalMoney
    }
    wx.showLoading({
      title: '加载中...',
    }),
      network.POST(url, params).then((res) => {
        
        // console.log("支付的返回值是：" + res.data);
        wx.requestPayment(
          {
            'timeStamp': res.data.timeStamp,
            'nonceStr': res.data.nonce_str,
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
              // appPayOrderStateServlet

              let url = "appPayOrderStateServlet"
              var params = {
                orderId: orderId
              }
              wx.showLoading({
                title: '加载中...',
              }),
                network.POST(url, params).then((res) => {
                  wx.hideLoading();
                  // console.log("订单的结果是：" + res.data.ListGood);
                  if(res.state==1){
                    wx.navigateTo({
                      url: "../order/order?id=1"
                    })
                  }
                }).catch((errMsg) => {
                  wx.hideLoading();
                  // console.log(errMsg); //错误提示信息
                  wx.showToast({
                    title: '网络错误',
                    icon: 'loading',
                    duration: 1500,
                  })
                });

              // that.updateOrderState();
            },
            'fail': function (res) {
              // console.log("调起支付失败" + res.data)
              wx.showToast({
                title: "支付失败",
                duration: 1500
              })
            },
            'complete': function (res) { }
          })
      }).catch((errMsg) => {
        wx.hideLoading();
        // console.log(errMsg); //错误提示信息
        wx.showToast({
          title: '网络错误',
          icon: 'loading',
          duration: 1500,
        })
      });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})