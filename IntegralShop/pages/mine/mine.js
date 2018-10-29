// pages/mine/mine.js
var common = require("../../utils/common.js");
var network = require("../../utils/network.js");
var app = getApp();
var shopId = null;
var openId = wx.getStorageSync('openId');
Page({
  data: {
    showModal: false,
    showShare: false,
    userInfo: {},
    money: 0,
    actionSheetHidden: true
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    if (app.globalData.userInfo) {
      console.log(app.globalData.userInfo.avatarUrl);
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo;
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    // console.log(e);
    app.globalData.userInfo = e.detail.userInfo;
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  //优惠券
  coupon: function() {
    wx.navigateTo({
      url: 'coupon/coupon',
    })
  },
  recharge: function() {
    this.showDialogBtn();
  },

  /**
   * 弹窗
   */
  showDialogBtn: function() {
    this.setData({
      showModal: true
    })
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function() {},
  /**
   * 隐藏模态对话框
   */
  hideModal: function() {
    this.setData({
      showModal: false
    });
  },
  /**
   * 隐藏分享对话框
   */
  hideShreModal: function() {
    this.setData({
      showShare: false
    });
  },

  /**
   * 分享弹窗
   */
  showShareDialogBtn: function() {
    this.setData({
      showShare: true
    })
  },
  /**
   * 隐藏分享模态对话框
   */
  hideShareModal: function() {
    this.setData({
      showShare: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancelShare: function() {
    this.hideShreModal();
  },

  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function() {
    this.hideModal();
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function() {
    this.hideModal();
    let that = this;
    let url = "http://192.168.0.146:8081/weixin/getRepayId"
    let method = "GET"
    let openId = wx.getStorageSync("openId")
    var money = that.data.money * 100
    console.log("价格是：" + money);
    var params = {
      openId: openId,
      money: money
    }
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        // console.log("支付的返回值是：" + res.data);
        wx.requestPayment({
          'timeStamp': res.data.timeStamp,
          'nonceStr': res.data.nonceStr,
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
            console.log("调起支付失败" + res)
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
  },
  //获取输入框里面的值
  inputChange: function(e) {
    this.setData({
      money: e.detail.value
    })
  },
  //唤出商品列表
  listenerButton: function() {
    let that = this;
    let url = "http://192.168.0.146:8080/api/findAllShop"
    let method = "GET"
    // let openId = wx.getStorageSync("openId")

    var params = {
      openId: openId
    }
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        console.log("返回的商家是：" + res.data.shop);
        var shop = res.data.shop;
        that.setData({
          shop: shop,
          //取反
          actionSheetHidden: !this.data.actionSheetHidden
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

  // 弹出商品列表进行选择
  chooseShop: function(e) {
    var that = this;
    shopId = e.currentTarget.dataset.id;
    that.setData({
      //取反
      actionSheetHidden: !this.data.actionSheetHidden
    })
    that.showShareDialogBtn();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    var that = this;
    that.hideShreModal();
    console.log("当前要分享。。。。" + shopId);

    if (res.from === 'button') {
      console.log("来自页面内转发按钮");
      // console.log(res.target);
      var path = null;
      if (shopId != null) {
        path = '/pages/login/login?openId=' + openId + '&shopId=' + shopId;
      } else {
        path = '/pages/login/login?openId=' + openId;
      }
      return {
        title: '新用户注册5元巨享55元豪礼',
        path: '/pages/login / login ? openId =' + openId,
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
        complete() {}
      }
    } else {
      console.log("来自右上角转发菜单")
    }

  },
})