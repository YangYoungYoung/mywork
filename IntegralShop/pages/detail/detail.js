// pages/detail/detail.js
var network = require("../../utils/network.js")
var common = require("../../utils/common.js")
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {

    showModalStatus: false, //是否显示
    gg_id: 0, //规格ID
    gg_txt: '', //规格文本
    gg_price: 0, //规格价格
    guigeList: [{
      guige: '100',
      price: '150'
    }, {
      guige: '200',
      price: '150'
    }, {
      guige: '300',
      price: '150'
    }],
    num: 1, //初始数量
  },
  filter: function(e) {
    //console.log(e);
    var self = this,
      id = e.currentTarget.dataset.id,
      txt = e.currentTarget.dataset.txt,
      price = e.currentTarget.dataset.price
    self.setData({
      gg_id: id,
      gg_txt: txt,
      gg_price: price
    });
  },

  /* 点击减号 */
  bindMinus: function() {
    var num = this.data.num;
    // 如果大于1时，才可以减  
    if (num > 1) {
      num--;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },
  /* 点击加号 */
  bindPlus: function() {
    var num = this.data.num;
    // 不作过多考虑自增1  
    num++;
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num < 1 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },

  //显示对话框
  showModal: function() {
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
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  //隐藏对话框
  hideModal: function() {
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
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;

    that.setData({
      goodId: options.goodId
    })
    let url = "http://192.168.0.146:8080/api/getShopDetail"
    var params = {
      id: options.goodId
    }
    let method = "GET";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        // console.log("返回值是：" + res.data.shopImg);
        that.setData({
          orderPath: res.data.shopDetail.shopImage,
          goodName: res.data.shopDetail.shopName,
          integral: res.data.shopDetail.integral,
          goodPrice: res.data.shopDetail.money,
          sold: res.data.shopDetail.sold,
          list_image: res.data.shopImg
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

  //加入购物车
  addToCart: function() {
    var that = this;
    var id = that.data.goodId;
    var orderPath = that.data.orderPath;
    var goodName = that.data.goodName;
    var goodPrice = that.data.goodPrice;
    var number = that.data.num
    console.log("当前数量是："+number);
    var cartResult = new Array();

    var detailArray = {
      id: id,
      goodPrice: goodPrice,
      goodName: goodName,
      orderPath: orderPath,
      active: true,
      number:number
    };
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
    common.showTip("添加成功", "success");
    that.hideModal();
    // wx.reLaunch({
    //   url: '../cart/cart'
    // })
  },

  buyNow: function(e) {
    var that = this;
    that.hideModal();
    var id = that.data.goodId;
    let url = "http://192.168.0.146:8080/api/createOrder";
    var openId = wx.getStorageSync("openId");



    var orderList = new Array();;
    var shop = {
      id: id,
      number: that.data.num
    }
    orderList.push(shop);
    console.log("orderList:" + orderList[0].number+"openId:"+openId);
    var params = {
      // orderList: orderList,
      orderList: JSON.stringify(orderList),
      openId: openId
    }
    let method = "POST";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
      console.log("返回值是：" + res.data.orderId);
      if (res.data.orderId>0) {
          wx.navigateTo({
            url: '../payOrder/payOrder?orderId=' + res.data.orderId,
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
})