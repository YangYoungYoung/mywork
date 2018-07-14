// pages/home/home.js
var network = require("../../utils/network.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,//是否出现焦点  
    autoplay: true,//是否自动播放轮播图  
    interval: 4000,//时间间隔
    duration: 1000,//延时时间
    hiddenModal: true,
    circular:true,
  },
  todetails:function(e){
    let goodId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../details/details?goodId=' + goodId,
    }) 
  },

  navigateToFunction: function (e) {
    var temp = e.currentTarget.dataset.id;
    if (temp == 1) {
      wx.makePhoneCall({
        phoneNumber: '0312-8801777' //仅为示例，并非真实的电话号码
      })
    }
    else if (temp == 2) {
      //分享小程序
      // console.log("分享小程序");
      this.onShareAppMessage();
    }
    else if(temp==3){
      var latitude = 39.33978;
      var longitude = 115.51016;
      wx.openLocation({
        latitude: latitude,
        longitude: longitude,
        scale: 28,
        address: "河北省保定市易县东关领尚城南200米路东——易黄路18号",
      })
    }
    else{
      wx.switchTab({
        url: '../type/type'
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let that = this
    let url = "findLbtServlet"
    var params = {
     
    }
    wx.showLoading({
      title: '加载中...',
    }),
      network.POST(url, params).then((res) => {
        wx.hideLoading();
        // console.log("这里的结果是：" + res); //正确返回结果
        // console.log("商品的结果是：" + res.data.lbt[0].path);
        that.setData({
          banner: res.data.lbt,
          goods: res.data.goods
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
    return {
      title: '给您至尊VIP的享受',
      path: '/pages/index/index?id=123',
      success(e) {
        wx.showShareMenu({
          // 要求小程序返回分享目标信息
          withShareTicket: true
        });
      },
      fail(e) {
        // shareAppMessage:fail cancel
        // shareAppMessage:fail(detail message) 
        // console.log("用户取消了分享");
      },
      complete() { }
    }
  },
})