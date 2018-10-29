// pages/rebate/rebate.js
var common = require("../../utils/common.js");
var network = require("../../utils/network.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rebate:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let shopId = options.shopId;
    let openId = wx.getStorageSync("openId")
    var that = this;
    // let url = "http://192.168.0.146:8083/api/findCardInfo"
    let url = "findCardInfo"
    let method = "GET"
    var params = {
      openId: openId,
      shopId: shopId,
    }
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        //后台返回数据
        if(res.data.cardConsume.length>0){
          var cardConsume = res.data.cardConsume;
          var sumRebate = res.data.sumRebate;
          that.setData({
            sumRebate: sumRebate,
            cardConsume: cardConsume
          })
        }else{
          common.showTip("当前没有记录", "loading");
        }  
      }).catch((errMsg) => {
        wx.hideLoading();
        console.log(errMsg); //错误提示信息
        wx.showToast({
          title: '网络错误',
          icon: 'loading',
          duration: 1500,
        })
      });
  }
})