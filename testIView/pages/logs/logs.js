const { $Message } = require('../../dist/base/index');

Page({
  data: {
    visible1: false,
    actions1: [
      {
        name: '选项1',
      },
      {
        name: '选项2'
      },
     
    ],
    
  },



  handleOpen1() {
    this.setData({
      visible1: true
    });
  },

  handleCancel1() {
    this.setData({
      visible1: false
    });
  },


  handleClickItem1({ detail }) {
    const index = detail.index + 1;

    $Message({
      content: '点击了选项' + index
    });
  },


});