// pages/payOrder/payOrder.js
var network = require("../../utils/network.js")
var common = require("../../utils/common.js")
var orderId;
var totalMoney;
var couponList=[];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showAddr: false,
    showAddAddr: true,
    totalMoney: 0,
    detail: [],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    orderId = options.orderId;
    console.log("------------" + orderId)
    let that = this
    let url = "http://192.168.0.146:8080/api/getOrder"

    let method = "GET"
    var params = {
      orderId: orderId
    }
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        console.log("订单的结果是：" + res.data.shopInfo[0].checked);
        var goods = res.data.shopInfo;

        var total = 0;
        for (let i = 0; i < goods.length; i++) {
          total += goods[i].number * goods[i].integral;
        }
        totalMoney = total
        that.setData({
          detail: goods,
          totalMoney: total
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
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  //获取用户地址
  getAddress() {
    if (wx.chooseAddress) {

      wx.chooseAddress({
        success: (res) => {
          this.setData({
            showAddAddr: false,
            showAddr: true,
            name: res.userName,
            addrdetail: res.provinceName + res.cityName + res.countyName + res.detailInfo,
            tel: res.telNumber
          })

        },
      })
    } else {
      common.showTip("当前微信版本不支持获取地址", "loading");
    }
  },
  //选择使用现金券
  selectTap: function(e) {
    var  that = this;
    var index = e.currentTarget.dataset.index;
  
    var list = that.data.detail;
    console.log("点击前的状态是" + list[parseInt(index)].checked);
    if (index != null) {
      
      
      //优惠券
      var coupon = list[parseInt(index)].coupon.coupon
      //当前总金额
      var money = list[parseInt(index)].totalMoney
      //如果之前是选中的状态
      if (list[parseInt(index)].checked) {
       
        list[parseInt(index)].checked=false;
        that.setData({
          detail: list,
          totalMoney: money
        })
       
      } else {
       
        list[parseInt(index)].checked = true;
        money = money - coupon;
        that.setData({
          detail: list,
          totalMoney: money
        })
      }

    }
  },
  //支付
  payOrder: function() {

    let that = this;
    if (!that.data.showAddr) {
      common.showTip("请先选择地址", "loading");
      return;
    }
    let url = "http://192.168.0.146:8081/weixin/getRepayId"
    let method = "GET"
    let openId = wx.getStorageSync("openId")
    var money = that.data.totalMoney * 100
    console.log("价格是：" + money);
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
            that.paySuccess();
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
  },
  //支付返回通知
  paySuccess: function() {
    let that = this;
    let url = "http://192.168.0.146:8080/api/editOrderStatus"
    let method = "GET"
    
    //当前的商品数组
    var list = that.data.detail;
    for(var i=0;i<list.length;i++){
      if(list[i].checked){
        console.log("当前优惠券是："+list[i].coupon.id);
        couponList.push(list[i].coupon.id);
      }
    }

    var params = {
      couponList:couponList,
      orderId: orderId,
      status: 1
    }
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        // console.log("支付的返回值是：" + res.data);

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
})