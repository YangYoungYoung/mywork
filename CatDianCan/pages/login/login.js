// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    password: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
  },
  // 获取输入账号 
  phoneInput: function(e) {
    this.setData({
      phone: e.detail.value
    })
  },

  // 获取输入密码 
  passwordInput: function(e) {
    this.setData({
      password: e.detail.value
    })
  },
  // 登录 
  login: function() {
    if (this.data.phone.length == 0 || this.data.password.length == 0) {
      wx.showToast({
        title: '数据不能为空',
        icon: 'loading',
        duration: 2000
      })  
    } else {
      // 这里修改成跳转的页面 
      wx.navigateTo({
        url: '../index/index',
        success: function(res) {
          wx.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 2000
          })
        },
        fail: function(res) {},
        complete: function(res) {},
      })
      
    }
  }
})