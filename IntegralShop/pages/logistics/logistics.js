// pages/logistics/logistics.js
var network = require("../../utils/network.js")
var common = require("../../utils/common.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    state: 0,
    ShipperCode: "ZTO",
    LogisticCode: ""

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var shopId = options.shopId;
    var orderId = options.orderId;
    console.log("当前订单是："+orderId);
    let that = this
    let url = "http://192.168.0.146:8080/api/getLogistics"

    let method = "GET"
    var params = {
      shopId: shopId,
      orderId: orderId
    }
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        // console.log("订单的结果是：" + res.data.shopInfo[0].checked);
        var state = "";
      var Traces = res.data.Traces;
        switch (res.data.State) {
          case 0: //待付款
            state = "无轨迹";
            break;
          case 1: //已付款
            state = "已揽件";
            break;
          case 2: //已使用
            state = "在途中";
            break;
          case 3:
            state = "签收";
            break;
          case 4:
            state = "问题件";
            break;
          default: //全部状态
        }
        that.setData({
          state: State,
          ShipperCode: res.data.ShipperCode,
          LogisticCode: res.data.LogisticCode,
          Traces: Traces
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
  }
})