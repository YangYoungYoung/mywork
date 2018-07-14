// pages/details/details.js
var Zan = require('../../dist/index');
var common = require('../../utils/common.js');
const WxParse = require('../../utils/wxParse/wxParse.js');
var network = require("../../utils/network.js");
var app = getApp()
var that;
Page(Object.assign({}, Zan.Quantity, {
  data: {
    indicatorDots: true,//是否出现焦点  
    autoplay: true,//是否自动播放轮播图  
    interval: 4000,//时间间隔
    duration: 1000,//延时时间
    hiddenModal: true,
    quantity1: {
      quantity: 1,
      min: 1,
      max: 20,
    },
    actionType: 'payOrder',
    goodNumber: 999
  },


  onLoad: function (options) {
    that = this;
    that.setData({
      good_id: options.goodId
    })

    //查询商品详情
    var menu_cover = null;
    var good_id = this.data.good_id;
    let that = this
    let url = "menPiaoYuDingServlet"
    var params = {
      id: good_id
    }
    wx.showLoading({
      title: '加载中...',
    }),
      network.POST(url, params).then((res) => {
        wx.hideLoading();
        // console.log("这里的结果是：" + res); //正确返回结果
        // console.log("商品的结果是：" + res.data.gd.goodName);
        that.setData({
          goodName: res.data.gd.goodName,
          goodPrice: res.data.gd.goodPrice,
          orderPath: res.data.gd.orderPath,
          details: res.data.gd.details,
        })
      }).catch((errMsg) => {
        wx.hideLoading();
        // console.log(errMsg); //错误提示信息
        wx.showToast({
          title: '网络错误',
          icon: 'loading',
          duration: 1500,
        })
      });




    //查询商品图片
  

  },

  onShow: function () {
  },

  placeOrder: function (event) {
    var name = event.target.dataset.name;
    if (name == "order") {
      this.setData({
        actionType: 'payOrder'
      })
    } else if (name == "cart") {
      this.setData({
        actionType: 'addCart'
      })
    }
    if (this.data.showModalStatus) {
      this.hideModal();
    } else {
      this.showModal();
    }
  },

  showModal: function () {
    // 显示遮罩层  
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },

  hideModal: function () {
    // 隐藏遮罩层  
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },


  handleZanQuantityChange(e) {
    var componentId = e.componentId;
    var quantity = e.quantity;

    this.setData({
      [`${componentId}.quantity`]: quantity
    });
  },

  click_cancel: function () {
    this.hideModal();
  },

  payOrder: function () {
    //获取传递过来的数量，商品名称，价格
    var id = this.data.good_id;
    var number = this.data.quantity1.quantity;
    var price = this.data.goodPrice;
    var name = this.data.goodName;
    var pic = this.data.orderPath;
    var good_number = this.data.goodNumber;
    if (parseInt(number) > parseInt(good_number)) {
      common.showModal("货存不足！");
      return false;
    }
    var detailArray = new Array();
    detailArray = {id:id, number: number, price: price, name: name, pic: pic };
    var orderResult = new Array();
    orderResult.push(detailArray);

    //将选择的商品信息传给服务器生成订单
    let url = "createOrderSerclet"
    let openId = wx.getStorageSync('openid');
    // console.log("用户的opnId是：" + openId);
    var params = {
      orderResult: JSON.stringify(orderResult),
      openId: openId
    }
    wx.showLoading({
      title: '加载中...',
    }),
      network.POST(url, params).then((res) => {
        wx.hideLoading();
        // console.log("这里的结果是：" + res.data.orderId); //正确返回结果
        //返回的是订单Id
        var orderId = res.data.orderId;
        // that.navigateToPayOrder();
        wx.navigateTo({
          url: "../payorder/payorder?orderId=" + orderId
        })
      }).catch((errMsg) => {
        // wx.hideLoading();
        // console.log(errMsg); //错误提示信息
        wx.showToast({
          title: '网络错误',
          icon: 'loading',
          duration: 1500,
        })
      });
    // wx.setStorage({
    //   key: "orderResult",
    //   data: orderResult
    // })
    // wx.redirectTo({
    //   url: '../payorder/payorder'
    // })
  },

  addCart: function () {
    //购物车数据放进本地缓存
    var id = this.data.good_id;
    var number = this.data.quantity1.quantity;
    var price = this.data.goodPrice;
    var name = this.data.goodName;
    var pic = this.data.orderPath;
    var good_number = this.data.goodNumber;
    var cartResult = new Array();
    if (parseInt(number) > parseInt(good_number)) {
      common.showModal("货存不足！");
      return false;
    }
    var detailArray = { id: id, number: number, price: price, name: name, pic: pic, good_number: good_number, active: true };
    var oldcartResult = new Array;
    oldcartResult = wx.getStorageSync('cartResult');
    if (!oldcartResult) {
      cartResult.push(detailArray);
      wx.setStorage({
        key: "cartResult",
        data: cartResult
      })
    } else {
      oldcartResult.push(detailArray);
      wx.setStorage({
        key: "cartResult",
        data: oldcartResult
      })
    }

    wx.reLaunch({
      url: '../cart/cart'
    })
  },

  index: function () {
    wx.switchTab({
      url: '../home/home'
    })
  },

  cart: function () {
    wx.switchTab({
      url: '../cart/cart'
    })
  },

  selectAttributes: function () {
    common.showModal("商品属性功能还未完善！");
  }

}))
