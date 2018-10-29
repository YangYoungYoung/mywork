// pages/mine/mine.js
var common = require("../../utils/common.js");
var network = require("../../utils/network.js");
var app = getApp();
var shopId = null;
var openId = wx.getStorageSync('openId');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false,
    money: 0,
    shopId: '',
    role: 0,
    parentId: '',
    userInfo: {},
    actionSheetHidden: true,
    balance: 0,
    integral: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
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

    // console.log("............." + options.shopId);
    var that = this
    if (options.shopId != null && options.shopId != '') {
      that.setData({
        shopId: options.shopId
      })
    }
    if (options.parentId != null && options.parentId != '') {
      that.setData({
        parentId: options.parentId
      })
    }
    if (options.balance > 0) {
      
      that.setData({
        balance: options.balance
      })
    }
    console.log("当前积分为===：" + options.integral);
    if (options.integral > 0) {
      that.setData({
        integral: options.integral
      })
    }

    var role = options.role;
    // var role = 0;
    role = parseInt(role)

    if (role == 0) {
      that.setData({
        roleName: "运营者"
      })

    } else if (role == 1) {
      that.setData({
        roleName: "一级用户"
      })
    } else {
      that.setData({
        roleName: "二级用户"
      })
    }
    that.setData({
      role: role
    })

  },
  // 获取输入消费金额
  inputMoney: function(e) {
    this.setData({
      money: e.detail.value
    })
  },
  // 获取输入密码
  inputPwd: function(e) {
    this.setData({
      pwd: e.detail.value
    })
  },
  // 获取输入的手机号
  inputPhone: function(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  //运营者模块，用户消费
  parentShop: function() {
    let that = this;
    that.hideModal();
    // let url = "http://192.168.0.146:8083/api/parentShop"
    let url = "parentShop"
    let method = "GET"
    let openId = wx.getStorageSync("openId")
    var phone = that.data.phone;
    var pwd = that.data.pwd;
    var money = that.data.money;
    console.log("当前手机号：" + phone);
    if (phone == "" || phone == undefined) {
      common.showTip("手机号不能为空", "loading");
    } else if (pwd == "" || pwd == undefined) {
      common.showTip("金额不能为空", "loading");
    } else if (money == "" || money == undefined) {
      common.showTip("密码不能为空", "loading");
    } else {
      var params = {
        phone: phone,
        pwd: pwd,
        money: money
      }
      wx.showLoading({
          title: '加载中...',
        }),
        network.POST(url, params, method).then((res) => {
          wx.hideLoading();
          //后台交互
          if (res.data.status == 200) {
            common.showTip("消费成功", "success");
          } else {
            var message = res.data.message
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

  },

  //用户提现
  deposit: function() {
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
   * 对话框取消按钮点击事件
   */
  onCancel: function() {
    this.hideModal();
  },
  /**
   * 提现对话框确认按钮点击事件
   */
  onConfirm: function() {
    this.hideModal();
    let that = this;
    // let url = "http://192.168.0.146:8083/api/putForward"
    let url = "putForward"
    let method = "GET"
    let openId = wx.getStorageSync("openId")
    var money = that.data.money;

    console.log("价格是：" + money);
    var params = {
      openId: openId,
      money: money,
      shopId: that.data.shopId,
      parentId: that.data.parentId,
      role: that.data.role
    }
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        //后台交互
        if (res.data.status == 200) {
          common.showTip("提现申请成功", "success");
        } else {
          var message = res.data.message
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
  },
  //获取输入框里面的值
  inputChange: function(e) {
    this.setData({
      money: e.detail.value
    })
  },
  //查看返利和明细
  checkBalance: function() {
    var that = this;
    var shopId = that.data.shopId;
    wx.navigateTo({
      url: '../rebate/rebate?shopId=' + shopId,
    })
  },


  getUserInfo: function(e) {
    // console.log(e);
    app.globalData.userInfo = e.detail.userInfo;
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    var that = this;
    var shopId = that.data.shopId;

    var role = that.data.role;
    // var parentId = that.data.parentId;
    // if (parentId == null||parentId=='null') {
    var parentId = wx.getStorageSync("openId");
    // }
    role += 1
    console.log("shopId是：" + shopId);
    console.log("parentId是:" + parentId);
    console.log("role是:" + role);
    return {
      title: '子母卡系统分享',
      path: '/pages/register/register?shopId=' + shopId + '&parentId=' + parentId + '&role=' + role,
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
  }
})