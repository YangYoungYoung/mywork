//index.js
//获取应用实例

var app = getApp()
Page({
  data: {
    visible1: false,
    actions1: [
      {
        name: '选项1',
      },
      {
        name: '选项2'
      }
    ],  


    movies: [{
      url: "../images/eating_img.png"
    }, {
        url: "../images/empty_img.png"
    }, {
        url: "../images/underway_img.png"
    }],
    imagelist: [{
      name: "1",
      image: "../images/eating_img.png"
    }, {
      name: "2",
        image: "../images/empty_img.png"
    }, {
      name: "3",
        image: "../images/underway_img.png"
      }, {
        name: "1",
        image: "../images/eating_img.png"
      }, {
        name: "2",
        image: "../images/empty_img.png"
      }, {
        name: "3",
        image: "../images/underway_img.png"
      },
      {
        name: "1",
        image: "../images/eating_img.png"
      }, {
        name: "2",
        image: "../images/empty_img.png"
      }, {
        name: "3",
        image: "../images/underway_img.png"
      },
    ]
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  },
  handleOpen1() {
    this.setData({
      visible1: true
    });
    console.log("当前点击的是弹出");
  },

  handleCancel1() {
    this.setData({
      visible1: false
    });
    console.log("当前点击的是取消");
  },
  handleClickItem1({ detail }) {
    const index = detail.index + 1;

    console.log("当前点击的是"+index);
  },
})
