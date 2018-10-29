// pages/menu/menu.js
const app = getApp()

Page({
  /* 页面的初始数据 */
  data: {
    curNav: 1,
    /* 此变量用于判断该显示某个子item */
    curIndex: 1,
    menus: [{
      id: 1,
      menu: '菜单一',
      listpath: [{
        id: 1,
        title: '湖南辣椒小炒肉1',
        price: 12,
        active: false,
        num: 0
      }, {
        id: 2,
        title: '湖南辣椒小炒肉2',
        price: 13,
        active: false,
        num: 0
      }]
    }, {
      id: 2,
      menu: '菜单二',
        listpath: [{
          id: 3,
          title: '湖南辣椒小炒肉3',
          price: 12,
          active: false,
          num: 0
        }, {
          id: 4,
          title: '湖南辣椒小炒肉4',
          price: 13,
          active: false,
          num: 0
        }]
    }, {
      id: 3,
      menu: '菜单三',
        listpath: [{
          id: 5,
          title: '湖南辣椒小炒肉5',
          price: 12,
          active: false,
          num: 0
        }, {
          id: 6,
          title: '湖南辣椒小炒肉6',
          price: 13,
          active: false,
          num: 0
        }]
    }, {
      id: 4,
      menu: '菜单四',
        listpath: [{
          id: 7,
          title: '湖南辣椒小炒肉7',
          price: 12,
          active: false,
          num: 0
        }, {
          id: 8,
          title: '湖南辣椒小炒肉8',
          price: 13,
          active: false,
          num: 0
        }]
    }, {
      id: 5,
      menu: '菜单五',
        listpath: [{
          id: 9,
          title: '湖南辣椒小炒肉9',
          price: 12,
          active: false,
          num: 0
        }, {
          id: 10,
          title: '湖南辣椒小炒肉10',
          price: 13,
          active: false,
          num: 0
        }]
    }],
    // 商品列表
    items: [{
      id: 1,
      title: '湖南辣椒小炒肉1',
      price: 12,
      active: false,
      num: 1
    }, {
      id: 2,
      title: '湖南辣椒小炒肉2',
      price: 13,
      active: false,
      num: 1
    }, {
      id: 3,
      title: '湖南辣椒小炒肉3',
      price: 14,
      active: false,
      num: 1
    }, {
      id: 4,
      title: '湖南辣椒小炒肉4',
      price: 15,
      active: false,
      num: 1
    }, {
      id: 5,
      title: '湖南辣椒小炒肉5',
      price: 16,
      active: false,
      num: 1
    }, {
      id: 6,
      title: '湖南辣椒小炒肉5',
      price: 17,
      active: false,
      num: 1
    }, {
      id: 7,
      title: '湖南辣椒小炒肉5',
      price: 18,
      active: false,
      num: 1
    }]
  },
  /* 把点击到的某一项 设为当前curNav */
  switchRightTab: function(e) {
    tabid = e.target.dataset.id;

    this.setData({
      curNav: tabid,
      curIndex: tabid
    })
  },

  handleChange1({ detail }) {
    this.setData({
      value1: detail.value
    })
  },
  tabMenu: function(event) {
    let index = event.target.dataset.index;
    this.setData({
      tabIndex: index
    });
  },
  // 点击去购物车结账
  card: function() {
    let that = this;
    // 判断是否有选中商品
    if (that.data.orderCount.num !== 0) {
      // 跳转到购物车订单也
      wx.redirectTo({
        url: '../order/order'
      });
    } else {
      wx.showToast({
        title: '您未选中任何商品',
        icon: 'none',
        duration: 2000
      })
    }
  },
  addOrder: function(event) {
    let that = this;
    let id = event.target.dataset.id;
    let index = event.target.dataset.index;
    let param = this.data.items[index];
    let subOrders = []; // 购物单列表存储数据
    param.active ? param.active = false : param.active = true;
    // 改变添加按钮的状态
    this.data.items.splice(index, 1, param);
    that.setData({
      items: this.data.items
    });
    // 将已经确定的菜单添加到购物单列表
    this.data.items.forEach(item => {
      if (item.active) {
        subOrders.push(item);
      }
    });
    // 判断底部提交菜单显示隐藏
    if (subOrders.length == 0) {
      that.setData({
        bottomFlag: false
      });
    } else {
      that.setData({
        bottomFlag: true
      });
    }
    let money = 0;
    let num = subOrders.length;
    subOrders.forEach(item => {
      money += item.price; // 总价格求和
    });
    let orderCount = {
      num,
      money
    }
    // 设置显示对应的总数和全部价钱
    this.setData({
      orderCount
    });
    // 将选中的商品存储在本地
    wx.setStorage({
      key: "orders",
      data: subOrders
    });
  },
  onLoad: function() {

  }
})