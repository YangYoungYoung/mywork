// pages/order/order.js
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
    if (options.id > 0) {
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
    console.log("当前点击的是：" + currentTab);
    let url = "http://192.168.0.146:8080/api/getOrderByStatus";
    let openId = wx.getStorageSync("openId")
    var params = {
      openId: openId,
      status: currentTab
    }
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params).then((res) => {
        wx.hideLoading();
        // console.log();
        //订单列表初始化

        var noPayment = [], //待付款
          bought = [], //未发货
          used = [], //已发货
          have = []; //已完成

        switch (currentTab) {
          case 0: //待付款
            noPayment = res.data.order;
            break;
          case 1: //未发货
            bought = res.data.order;
            break;
          case 2: //已发货
            used = res.data.order;
            break;
          case 3: //已完成
            have = res.data.order;
            break;
          default: //全部状态
        }
        // console.log(noPayment[1].shopInfo.shopName);
        that.setData({
          noPayment: noPayment,
          bought: bought,
          used: used,
          have: have
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

    if (this.data.currentTab == e.target.dataset.current) {
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
    var shopId = e.target.dataset.id;
    var orderId = e.target.dataset.orderid;
    console.log("==================" + orderId);

    common.showModal('你确定取消订单吗？', '提示', true, function(e) {
      if (e.confirm) {
        let url = "http://192.168.0.146:8080/api/delOrderStatus";
        var params = {
          orderId: orderId,
          shopId: shopId
        }
        wx.showLoading({
            title: '加载中...',
          }),
          network.POST(url, params).then((res) => {
            wx.hideLoading();
            console.log("取消订单的结果是：" + res.data);
            if (res.data.status == 200) {
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
              setTimeout(function() {
                that.onShow()
              }, 3000);
            } else {
              common.showTip('使用失败');
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
  //查看物流
  logistics: function(e) {
    var orderId = e.target.dataset.orderid;
    var shopId = e.target.dataset.id;
    wx.navigateTo({
      url: '../logistics/logistics?orderId=' + orderId + "&shopId=" + shopId,
    })

  },
  // 发起支付
  payOrder: function(e) {
    var that = this;
    var shopId = e.target.dataset.id;
    var orderId = e.target.dataset.orderid;
    var money = e.target.dataset.price
    console.log("当前的订单id是：" + orderid + "总价是：" + money);
    let url = "http://192.168.0.146:8081/weixin/getRepayId"
    var params = {
      openid: wx.getStorageSync("openid"),

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
            that.paySuccess(orderId, shopId, 1);
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
  },
  //确认收货，更改状态
  confirmReceipt: function(e) {

    var that = this;
    var shopId = e.target.dataset.id;
    var orderId = e.target.dataset.orderid;
    common.showModal('你确定收货吗？', '提示', true, function(e) {

      if (e.confirm) {
        that.paySuccess(orderId, shopId, 3);

      }
    });
    that.onShow();
  },




  //支付成功的回调(这里的回调和之前的不一样)
  paySuccess: function(orderId, shopId, state) {
    let that = this;
    let url = "http://192.168.0.146:8080/api/orderStatus"
    let method = "GET"

    var params = {
      shopId: shopId,
      orderId: orderId,
      status: state
    }
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        // console.log("支付的返回值是：" + res.data);

      }).catch((errMsg) => {
        wx.hideLoading();
        console.log(errMsg); //错误提示信息
        wx.showToast({
          title: '网络错误',
          icon: 'loading',
          duration: 1500,
        })
      });
    that.onShow();
  }
});