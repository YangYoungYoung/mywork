var that;
var network = require("../../utils/network.js");
Page({

  /* 页面的初始数据 */
  data: {
    curNav: 1,
    /* 此变量用于判断该显示某个子item */
    curIndex: 1,
  },
  /* 把点击到的某一项 设为当前curNav */
  switchRightTab: function(e) {
    let id = e.target.dataset.id;
    console.log(id);
    this.setData({
      curNav: id,
      curIndex: id
    })
  },

  onLoad() {
    that = this //不要漏了这句，很重要
    var url = "querycpServlet";
    var params = {

    }
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params).then((res) => {
        wx.hideLoading();
        var menu = res.data.listCate
        that.setData({
          menu: menu
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '给您至尊VIP的享受',
      path: '/pages/index/index?id=123',
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
      complete() { }
    }
  },

})