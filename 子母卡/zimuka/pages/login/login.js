// pages/login/login.js
var network = require("../../utils/network.js")
var common = require("../../utils/common.js")
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    var that = this
    // 登录
    wx.login({
      success: res => {
        app.globalData.code = res.code
        //取出本地存储用户信息，解决需要每次进入小程序弹框获取用户信息
        app.globalData.userInfo = wx.getStorageSync('userInfo')
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
              title: '系统提示:网络错误',
              icon: 'warn',
              duration: 1500,
            })
          }
        })
      },
      fail: function() {
        wx.showToast({
          title: '系统提示:网络错误',
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
        title: '系统提示:网络错误',
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
            // console.log('用户点击确定');
            wx.openSetting({
              success: (res) => {
                if (res.authSetting['scope.userInfo']) {
                  // that.getOP(e.detail.userInfo)
                  wx.getUserInfo({
                    success: res => {
                      that.getOP(res.userInfo)
                    }
                  })
                }
              }
            })
          }
        }
      })
    }
  },
  getOP: function(res) { //提交用户信息 获取用户id
    let that = this
    let userInfo = res
    app.globalData.userInfo = userInfo
    // let url = "http://192.168.0.146:8081/weixin/getopen"

    let url = "getOpenId"
    console.log("当前的code值是：" + app.globalData.code);
    var params = {
      code: app.globalData.code
    }
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params).then((res) => {
        wx.hideLoading();
        // console.log("这里的结果是：" + res); //正确返回结果
        wx.setStorageSync('openId', res.data.openid); // 单独存储openid
        that.login();
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
  //校验身份并登录
  login: function() {
    let that = this
    // let url = "http://192.168.0.146:8083/api/getUser"

    let url = "getUser"
    var openId = wx.getStorageSync('openId');
    var params = {
      openId: openId
    }
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params).then((res) => {
        wx.hideLoading();
        // console.log("=============" + res.data.user.shopId);
        if (res.data.user) {
          var role = res.data.user.role;
          var parentId = '';
          var shopId = '';
          console.log("当前身份是：" + role);
          if (res.data.user.parentOpenId != null && res.data.user.parentOpenId != '') {
            parentId = res.data.user.parentOpenId
          }
          if (res.data.user.shopId != null && res.data.user.shopId != '') {
            shopId = res.data.user.shopId
          }
          console.log("登录：shopId:" + res.data.user.shopId);
          console.log("登录：parentId:" + res.data.user.parentOpenId);
          var balance = 0; //余额
          if (res.data.user.balance != null && res.data.user.balance != undefined) {
            
            balance = res.data.user.balance;
          }
          var integral = 0; //积分
          if (res.data.user.integral != null && res.data.user.integral != undefined) {
            integral = res.data.user.integral;
          }
          console.log("登录时积分：" + integral);
          wx.redirectTo({
            url: '../mine/mine?role=' + role + '&&shopId=' + shopId + '&&parentId=' + parentId + '&&balance=' + balance + '&&integral=' + integral ,
          })
        } else {
          common.showTip("您不是会员", "loading");
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
  registered: function() {
    var shopId = '';
    var parentId = '';
    wx.redirectTo({
      url: '../register/register?+shopId=' + shopId + '&parentId=' + parentId,
    })
  }
})