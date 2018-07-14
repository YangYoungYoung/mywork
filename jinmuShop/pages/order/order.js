var that;
var common = require("../../utils/common.js");
var network = require("../../utils/network.js");
Page({
  data: {
    currentTab: 0,
    winHeight: null,

  },
  onLoad: function(options) {
    that = this;
    if (options.id>0) {
      that.setData({
        currentTab: options.id
      })
    }
    // 页面初始化 options为页面跳转所带来的参数
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight,
        });
      }
    });
    // that.onShow();
  },
  onShow: function() {
    // 页面显示
    //获取全部订单信息
    var that = this;
    var currentTab = that.data.currentTab;
    let url = "notPayMentServlet";
    let openid = wx.getStorageSync("openid")
    var params = {
      openid: openid,
      state: currentTab
    }
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params).then((res) => {
        wx.hideLoading();
        // console.log();
        //订单列表初始化

        var noPayment = [], //待付款
          bought = [], //已购买
          used = []; //已使用

        switch (currentTab) {
          case 0: //待付款
            noPayment = res.data.Lists;
            break;
          case 1: //已付款
            bought = res.data.Lists;
            break;
          case 2: //已使用
            used = res.data.Lists;
            break;
          default: //全部状态
        }
        that.setData({
          noPayment: noPayment,
          bought: bought,
          used: used
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

  swichNav: function(e) {

    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
    that.onShow();
  },

  bindChange: function(e) {

    that = this;
    that.setData({
      currentTab: e.detail.current
    });
    that.onShow()
  },

  onPullDownRefresh: function() {
    wx.stopPullDownRefresh();
    that.onShow()
  },

  //取消订单
  cancelOrder: function(e) {
    var that = this;
    var orderid = e.target.dataset.id;

    common.showModal('你确定取消订单吗？', '提示', true, function(e) {
      if (e.confirm) {
        let url = "deleteOrderServlet";
        var params = {
          orderId: orderid
        }
        wx.showLoading({
            title: '加载中...',
          }),
          network.POST(url, params).then((res) => {
            wx.hideLoading();
            console.log("取消订单的结果是：" + res.data);
            if (res.data.state == 1) {
              common.showTip('取消订单成功');
              setTimeout(function() {
                that.onShow()
              }, 3000);
            } else {
              common.showTip('取消订单失败');
              setTimeout(function() {
                that.onShow()
              }, 3000);
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
        that.onShow()
      }
    });
  },

  //使用订单
  overOrder: function(e) {
    var that = this;
    var orderid = e.target.dataset.id;
    common.showModal('你确定使用这个商品吗？', '提示', true, function(e) {

      if (e.confirm) {
        let url = "updateOrderStateServlet";
        var params = {
          orderId: orderid
        }
        wx.showLoading({
          title: '加载中...',
        }),
          network.POST(url, params).then((res) => {
            wx.hideLoading();
            console.log("使用订单的结果是：" + res.data);
            if (res.data.state == 1) {
              common.showTip('使用成功');
              setTimeout(function () {
                that.onShow()
              }, 3000);
            } else {
              common.showTip('使用失败');
              setTimeout(function () {
                that.onShow()
              }, 3000);
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
        that.onShow()
      }
    });
  },
  //删除订单
  deleteOrder: function(e) {
    var that = this;
    var orderid = e.target.dataset.id;
    common.showModal('你确定删除订单吗？', '提示', true, function(e) {

      if (e.confirm) {
        let url = "deleteOrderServlet";
        var params = {
          orderId: orderid
        }
        wx.showLoading({
            title: '加载中...',
          }),
          network.POST(url, params).then((res) => {
            wx.hideLoading();
            console.log("取消订单的结果是：" + res.data);
            if (res.data.state == 1) {
              common.showTip('取消订单成功');
              setTimeout(function() {
                that.onShow()
              }, 3000);
            } else {
              common.showTip('取消订单失败');
              setTimeout(function() {
                that.onShow()
              }, 3000);
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
        that.onShow()
      }
    });
  },
  logistics: function(e) {
    var orderid = e.target.dataset.id;
    console.log(1)

  },
  // 发起支付
  payOrder: function(e) {
    var that= this;
    var orderid = e.target.dataset.id;
    var money = e.target.dataset.price
console.log("当前的订单id是："+orderid+"总价是："+money);
    let url = "appPayMentServlet"
    var params = {
      openid: wx.getStorageSync("openid"),
      orderId: orderid,
      totalPrice: money
    }
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params).then((res) => {

        console.log("支付的返回值是：" + res.data);
        wx.requestPayment({
          'timeStamp': res.data.timeStamp,
          'nonceStr': res.data.nonce_str,
          'package': res.data.package,
          'signType': 'MD5',
          'paySign': res.data.paySign,
          'success': function(res) {
            // console.log("调起支付成功")
            wx.hideLoading();
            wx.showToast({
              title: "支付成功",
              icon: 'succes',
              duration: 1500
            })
            // that.updateOrderState();
          },
          'fail': function(res) {
            console.log("调起支付失败" + res.data)
            wx.showToast({
              title: "支付失败",
              duration: 1500
            })
          },
          'complete': function(res) {}
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

});