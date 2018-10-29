// pages/mine/coupon/coupon.js
var common = require("../../../utils/common.js");
var network = require("../../../utils/network.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coupons: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    let url = "http://192.168.0.146:8080/api/getCoupons"
    let method = "GET"
    let openId = wx.getStorageSync("openId")
    var params = {
      openId: openId
    }
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        console.log("结果是：" + res.data.conpons);
        var coupons = res.data.conpons
        that.setData({
          coupons: coupons
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
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  //购物使用
  toShop: function() {
    wx.switchTab({
      url: '../../index/index',
    })
  }

})