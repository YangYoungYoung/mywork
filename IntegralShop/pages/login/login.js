// pages/login/login.js
var network = require("../../utils/network.js")
var common = require("../../utils/common.js")
var app = getApp()
var parentOpenId = null;
var shopId = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    authorization: true,
    state: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.shopId != null) {
      shopId = options.shopId;
    }
    if (options.openId != null) {
      parentOpenId = options.openId;
    }
    var that = this
    // 登录
    wx.login({
      success: res => {
        app.globalData.code = res.code
        //取出本地存储用户信息，解决需要每次进入小程序弹框获取用户信息
        app.globalData.userInfo = wx.getStorageSync('userInfo')
        if (app.globalData.userInfo) {
          that.setData({
            authorization: false
          })
        }
        //wx.getuserinfo接口不再支持
        wx.getSetting({
          success: (res) => {
            //判断用户已经授权。不需要弹框
            if (!res.authSetting['scope.userInfo']) {
              that.setData({
                showModel: true
              })
            } else { //没有授权需要弹框
              that.setData({
                showModel: false
              })
              wx.showLoading({
                title: '加载中...'
              })
              that.getOP(app.globalData.userInfo)
            }
          },
          fail: function() {
            wx.showToast({
              title: '网络错误',
              icon: 'warn',
              duration: 1500,
            })
          }
        })
      },
      fail: function() {
        wx.showToast({
          title: '网络错误',
          icon: 'warn',
          duration: 1500,
        })
      }
    })
  },

  //获取用户信息新接口
  bindGetUserInfo: function(e) {
    //设置用户信息本地存储
    try {
      wx.setStorageSync('userInfo', e.detail.userInfo)
    } catch (e) {
      wx.showToast({
        title: '网络错误',
        icon: 'warn',
        duration: 1500,
      })
    }
    // wx.showLoading({
    //   title: '加载中...'
    // })
    let that = this
    if (e.detail.userInfo) {
      that.getOP(e.detail.userInfo)
    } else {
      wx.showModal({
        title: '提示',
        content: '小程序功能需要授权才能正确使用哦！请点击“确定”-“用户信息”再次授权',
        success: function(res) {
          if (res.confirm) {
            common.showTip("请点击授权按钮", "loading");
            that.setData({
              state: false
            })

            // wx.openSetting({
            //   success: (res) => {
            //     console.log('用户点击确定');
            //     if (res.authSetting['scope.userInfo']) {
            //       // that.getOP(e.detail.userInfo)
            //       wx.getUserInfo({
            //         success: res => {
            //           that.getOP(res.userInfo)
            //         }
            //       })
            //     }
            //   }
            // })
          }
        }
      })
    }
  },
  getOP: function(res) { //提交用户信息 获取用户id
    let that = this
    let userInfo = res
    app.globalData.userInfo = userInfo
    let url = "http://192.168.0.146:8081/weixin/getOpenId"
    console.log("当前的code值是：" + app.globalData.code);
    var params = {
      code: app.globalData.code
    }
    let method = "GET";

    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        console.log("openId的结果是：" + res.data.openid); //正确返回结果
        wx.setStorageSync('openId', res.data.openid); // 单独存储openid
        that.setData({
          authorization: false
        })
        // wx.switchTab({
        //   url: '../index/index'
        // })

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
  //二次授权
  handler: function(e) {

    if (e.detail.authSetting['scope.userInfo']) {

      wx.getUserInfo({
        success: res => {
          this.getOP(res.userInfo)
        }
      })
    }
  },
  //注册支付
  registered: function(e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确认支付五元注册为会员吗？',
      success: function(res) {

        //点击确定
        if (res.confirm) {
          //这里要做支付
          let url = "http://192.168.0.146:8081/weixin/getRepayId"
          let method = "GET"
          let openId = wx.getStorageSync("openId")
          // var money = that.data.totalMoney * 100
          // console.log("价格是：" + money);
          var params = {
            openId: openId,
            money: 1
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
                  that.registerRequ();
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
        }
      }
    })
  },
  //支付成功调用注册接口
  registerRequ: function() {
    var that = this;
    let openId = wx.getStorageSync("openId")
    let url = "http://192.168.0.146:8080/api/createShopUser"
    var params = {
      parentOpenId: parentOpenId,
      shopId: shopId,
      openId: openId
    }
    let method = "GET";

    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        if (res.data.status == 200) {
          common.showTip("注册成功！", "succes");
          wx.switchTab({
            url: '../index/index',
          })
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
  },
  login: function() {

    var that = this;
    let openId = wx.getStorageSync("openId")
    let url = "http://192.168.0.146:8080/api/isOrNotUser"
    var params = {

      openId: openId
    }
    let method = "GET";

    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        if (res.data == 0) {
          common.showTip("请先注册！", "loading");
        } else {
          wx.switchTab({
            url: '../index/index',
          })
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
    wx.switchTab({
      url: '../index/index',
    })
  }
})