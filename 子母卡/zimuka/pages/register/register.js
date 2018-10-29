// pages/register/register.js
var network = require("../../utils/network.js")
var common = require("../../utils/common.js")
const app = getApp();
Page({
  data: {
    phone: '',
    authorization: true,
    state: true,
    role: 0, //role为角色，0为管理员，1为一级用户，2为二级用户
    name: '',
    pwd:'',
    shopId: '',
    parentId: ''
  },
  onLoad: function(options) {
    var that = this;
    var shopId = '';
    var parentId = '';
    var role = 0;
    //option中可以获取到商户id，母卡信息
    if (options != null && options != undefined) {
      if (options.shopId != null&&options.shopId!='') {
        shopId = options.shopId;
      }
      if (options.parentId != null&&options.parentId!='') {
        parentId = options.parentId;
      }
      if (options.role != null && options.role != 0) {
        var role = options.role
      }
      that.setData({
        shopId: shopId,
        parentId: parentId,
        role: role
      })
    }
    // console.log("当前role" + that.data.role);
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
    that.onShow();
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
  // 获取输入名称 
  nameInput: function(e) {
    this.setData({
      name: e.detail.value
    })
  },

  // 获取输入账号  
  phoneInput: function(e) {
    this.setData({
      phone: e.detail.value
    })
  },

  // 获取输入账号  
  passwordInput: function(e) {

    this.setData({
      pwd: e.detail.value
    })
  },
  // 注册 
  register: function() {
    var that = this
    if (that.data.phone.length != 11) {
      wx.showToast({
        title: '请输入正确手机号',
        icon: 'loading',
        duration: 2000
      })
    } else {
      if (that.data.role != 0 && that.data.name == "") {
        wx.showToast({
          title: '名称不能为空',
          icon: 'loading',
          duration: 1000
        })
      }
      // let url = "https://www.cmdd.tech/api/createUser"
      let url = "createUser"
      var openId = wx.getStorageSync('openId');
      var phone = that.data.phone;
      var name = that.data.name;
      var role = that.data.role;
      var pwd = that.data.pwd;
      var shopId = that.data.shopId;
      var parentId = that.data.parentId;
      var params = {
        openId: openId,
        //用户名称
        name: name,
        //手机号
        phone: phone,
        //role为角色，0为管理员，1为一级用户，2为二级用户
        role: role,
        //商户ID
        shopId: shopId,
        //上级ID
        parentId: parentId,
        //密码
        pwd: pwd
      }
      let method = "GET";
      wx.showLoading({
          title: '加载中...',
        }),
        network.POST(url, params, method).then((res) => {
          wx.hideLoading();
          if (res.data.status == 200) {
            common.showTip("注册成功！", "success");
            wx.redirectTo({
              url: '../login/login',
            })
          } else {
            var message = res.data.message;
            common.showTip(message, "loading");
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
  }
})