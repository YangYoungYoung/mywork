// pages/home/home.js
var common = require("../../utils/common.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true, //是否出现焦点  
    autoplay: true, //是否自动播放轮播图  
    interval: 4000, //时间间隔
    duration: 1000, //延时时间
    hiddenModal: true,
    circular: true,
    orderPrice: 49,
    banner: [{
      path: "../images/lbt1.png"
    }, {
        path: "../images/lbt2.png"
    }],
    menu:[
      {
        name:"开始点餐",
        image:"../images/order_food.png"
      },
      {
        name: "菜品进度",
        image: "../images/schedule.png"
      },
      {
        name: "联系我们",
        image: "../images/phone.png"
      },
      {
        name: "后厨风采",
        image: "../images/back_home.png"
      },
      {
        name: "奖品查询",
        image: "../images/gift.png"
      },

      {
        name: "意见反馈",
        image: "../images/opinion.png"
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  navigateToFunction:function(e){
    var index = e.currentTarget.dataset.index;
    console.log('点击的是第几个？？'+index);
    if(index==0){
      wx.navigateTo({
        url: '../index/index',
      })
    }
    else if(index==1){
      wx.navigateTo({
        url: '../order/order',
      })
    }else if(index==2){
      wx.navigateTo({
        url: '../relation/relation',
      })
    }else if(index==5){
      wx.navigateTo({
        url: '../remark/remark',
      })
    }else{
      common.showTip("敬请期待", "loading");
    }
  }
})