// pages/typeInfo/typeInfo.js
var network = require("../../utils/network.js")
var common = require("../../utils/common.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopInfo:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id;
    let that = this
    let url = "http://192.168.0.146:8080/api/getShopByType"
    var params = {
      type:id
    }
    let method = "GET";
    wx.showLoading({
      title: '加载中...',
    }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        // console.log("返回值是：" + res.data.mainType);
        that.setData({
         shopInfo:res.data.shopInfo
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
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  
})