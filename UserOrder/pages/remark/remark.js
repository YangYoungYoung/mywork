// pages/remark/remark.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text: "",
    tags: [{
        name: '不辣',
        checked: false,
        color: 'green'
      },
      {
        name: '微辣',
        checked: false,
        color: 'blue'
      },
      {
        name: '中辣',
        checked: false,
        color: 'yellow'
      },
      {
        name: '麻辣',
        checked: false,
        color: 'red'
      }
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

  bindTextAreaBlur: function(e) {
    console.log(e.detail.value);

    this.setData({
      text: e.detail.value,
    })
  },

  onChange(event) {
    const detail = event.detail;
    
    var remark = this.data.tags[event.detail.name].name;
    var text = this.data.text;
    var checked = false;
    //展示的为当前状态，未更改状态
    if (this.data.tags[event.detail.name].checked) {
      //点击取消备注
      checked = false;
      text = text.replace(remark, "");
      
    } else {
      //点击增加备注
      checked = true;
      text += remark;
    }
    this.setData({
      text: text,
      ['tags[' + event.detail.name + '].checked']: checked
    })

  }
})