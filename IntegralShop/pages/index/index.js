//index.js
//获取应用实例
var network = require("../../utils/network.js")
var common = require("../../utils/common.js")
Page({
  data: {
    indicatorDots: true, //是否出现焦点  
    autoplay: true, //是否自动播放轮播图  
    interval: 4000, //时间间隔
    duration: 1000, //延时时间
    hiddenModal: true,
    circular: true,
    orderPrice: 49,
    banner: [],
    menu: []
  },
  
  
  onLoad: function () {
    let that = this
    let url = "https://mall.cmdd.tech/api/getShopInfo"
    var params = {
      
    }
    let method = "GET";
    wx.showLoading({
      title: '加载中...',
    }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
      // console.log("返回值是：" + res.data.mainType);
        that.setData({
          banner: res.data.picUrl,
          menu: res.data.mainType,
          shopInfo: res.data.shopInfo
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
  //跳转到详情页
  toDetail: function (event){
    var id = event.currentTarget.dataset.id;
    // console.log("当前点击的是："+id);
    wx.navigateTo({
      url: '../detail/detail?goodId='+id,
    })
  },
  //跳转到商品类型
  navigateToFunction: function (event){
    var id = event.currentTarget.dataset.id;
    console.log("当前点击的是"+id);
    wx.navigateTo({
      url: '../typeInfo/typeInfo?id='+id,
    })
  }

})
