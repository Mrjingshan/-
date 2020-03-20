
Page({
  data: {
    template: {}
  },
  onLoad: function (options) {
  },
  onReady: function () {
  },
  onShow: function () {
    wx.showLoading({
      title: '加载中',
    })
    if (wx.getStorageSync('userInfo').avatarUrl && wx.getStorageSync('myMarketMan').market_qr_code) {
      wx.hideLoading();
      this.setData({
        template: {
          "width": "750rpx",
          "height": "1070rpx",
          "background": "#E7EFF5",
          "views": [{
            "type": "image",
            "url": "http://wjdh.yccjb.com/codeBgNew.png",
            "css": {
              "width": "825rpx",
              "height": "1180rpx",
            }
          }, {
            "type": "image",
            "url": wx.getStorageSync('userInfo').avatarUrl,
            "css": {
              "width": "140rpx",
              "height": "140rpx",
              "left": "305rpx",
              "top": "58rpx",
              "borderRadius": "150rpx",
            }
          }, {
            "type": "text",
            "text": wx.getStorageSync('userInfo').nickName,
            "css": {
              "width": "750rpx",
              "align": "center",
              "fontSize": "32rpx",
              "color": "#000",
              "left": "370rpx",
              "top": "210rpx",
            }
          }, {
            "type": "image",
            "url": "http://wjdh.yccjb.com/rightShape.png",
            "css": {
              "width": "14rpx",
              "height": "20rpx",
              "left": "108rpx",
              "top": "332rpx",
            }
          }, {
            "type": "text",
            "text": "0门槛、无投入，加入我家的画",
            "css": {
              "left": "150rpx",
              "top": "292rpx",
              "fontSize": "32rpx",
              "color": "#333333"
            }
          }, {
            "type": "text",
            "text": "轻松创业，你也有机会年薪百万~",
            "css": {
              "left": "150rpx",
              "top": "358rpx",
              "fontSize": "32rpx",
              "color": "#333333"
            }
          }, {
            "type": "image",
            "url": wx.getStorageSync('myMarketMan').market_qr_code,
            "css": {
              "width": "400rpx",
              "height": "400rpx",
              "left": "180rpx",
              "top": "450rpx",
              "borderRadius": "300rpx",
            }
          }, {
            "type": "image",
            "url": "http://wjdh.yccjb.com/logo.png",
            "css": {
              "width": "64rpx",
              "height": "64rpx",
              "left": "180rpx",
              "top": "912rpx",
              "borderRadius": "150rpx",
            }
          }, {
            "type": "text",
            "text": "让艺术走进生活，",
            "css": {
              "left": "290rpx",
              "top": "908rpx",
              "fontSize": "28rpx",
              "color": "#333333"
            }
          }, {
            "type": "text",
            "text": "使生活更美好~",
            "css": {
              "left": "310rpx",
              "top": "948rpx",
              "fontSize": "28rpx",
              "color": "#333333"
            }
          }]
        },
      });
    }
  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  // 分享
  onShareAppMessage: function (res) {
    if (res.from === 'button') { // 来自页面内转发按钮  
    }
    return {
      title: '被我家的画美到了，快来一起看看吧~',
      path: '/pages/index/index?shareStatus=' + 1 + '&userId=' + wx.getStorageSync('userData').userId + '&pageFrom=' + 1,
      imageUrl: 'http://wjdh.yccjb.com/shareIndex.png'
    }
  },
  onImgOK(e) {
    this.imagePath = e.detail.path;
    console.log(e);
  },
  saveImage() {
    wx.saveImageToPhotosAlbum({
      filePath: this.imagePath,
    });
    wx.showToast({
      title: '已保存',
      duration: 1000
    })
  },
})