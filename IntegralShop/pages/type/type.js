// pages/type/type.js
var network = require("../../utils/network.js")
var common = require("../../utils/common.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: [],
    toView: '0',
    scrollTop: 100,
    foodCounts: 0,
    totalPrice: 0, // 总价格
    
    totalCount: 0, // 总商品数
    carArray: [],
    minPrice: 0, //起送價格
  },

  //选择左侧类列表
  selectMenu: function(e) {
    var index = e.currentTarget.dataset.itemIndex;
    this.setData({
      toView: 'order' + index.toString()
    })
    console.log(this.data.toView);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    let that = this
    let url = "http://192.168.0.146:8080/api/getAllShop"
    var params = {
      // code: app.globalData.code
    }
    let method = "GET";

    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        console.log("返回值是：" + res.data);
        that.setData({
          goods: res.data,

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
  onShow: function() {
    this.onLoad();
  },
  //跳转到详情页
  toDetail: function(event) {
    var id = event.currentTarget.dataset.id;
    console.log("-------" + id);
    wx.navigateTo({
      url: '../detail/detail?goodId=' + id,
    })
  }

})