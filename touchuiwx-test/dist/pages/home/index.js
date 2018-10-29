"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Page({
  data: {
    isShow: false
  },
  starShow: function starShow() {
    this.setData({
      isShow: true
    });
  },
  handleShowMask1: function handleShowMask1(e) {
    var show = e.currentTarget.dataset.show;
    this.setData({
      showMask1: show
    });
  },
  handleShowMask2: function handleShowMask2(e) {
    var show = e.currentTarget.dataset.show;
    this.setData({
      showMask2: show
    });
  },
  handleShowMask3: function handleShowMask3(e) {
    var show = e.currentTarget.dataset.show;
    this.setData({
      showMask3: show
    });
  },
  handleShowMask6: function handleShowMask6(e) {
    var show = e.currentTarget.dataset.show;
    this.setData({
      showMask6: show
    });
  }
});