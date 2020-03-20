const app = getApp()
Page({
  data: {
    template: {},
    avatarUrl:'',
  },
  onLoad: function (options) {
  },
  onReady: function () {
  },
  onShow: function () {
    var that = this;

    wx.showLoading({
      title: '加载中',
    })
    if (wx.getStorageSync('userInfo').avatarUrl && wx.getStorageSync('myMarketMan').good_qr_code) {
      const downloadTask = wx.downloadFile({
        url: wx.getStorageSync('userInfo').avatarUrl, //仅为示例，并非真实的资源
        success: function (res) {
          // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
          if (res.statusCode === 200) {
            that.setData({
              avatarUrl: res.tempFilePath, //将下载的图片临时路径赋值给img_l,用于预览图片
            })
          }
        }
      })
      const downloadTask1 = wx.downloadFile({
        url: wx.getStorageSync('myMarketMan').good_qr_code, //仅为示例，并非真实的资源
        success: function (res) {
          // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
          console.log(res)
          if (res.statusCode === 200) {
            wx.hideLoading();
            that.setData({
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
                  "text": "被我家的画美到了，快来一起看看吧~",
                  "css": {
                    "left": "150rpx",
                    "top": "324rpx",
                    "fontSize": "32rpx",
                    "color": "#333333"
                  }
                },
                {
                  "type": "image",
                  "url": res.tempFilePath,
                  "css": {
                    "width": "400rpx",
                    "height": "400rpx",
                    "left": "180rpx",
                    "top": "430rpx",
                    "borderRadius": "300rpx",
                  }
                },
                {
                  "type": "image",
                  "url": "http://wjdh.yccjb.com/logo.png",
                  "css": {
                    "width": "64rpx",
                    "height": "64rpx",
                    "left": "180rpx",
                    "top": "892rpx",
                    "borderRadius": "150rpx",
                  }
                }, {
                  "type": "text",
                  "text": "让艺术走进生活，",
                  "css": {
                    "left": "290rpx",
                    "top": "888rpx",
                    "fontSize": "28rpx",
                    "color": "#333333"
                  }
                }, {
                  "type": "text",
                  "text": "使生活更美好~",
                  "css": {
                    "left": "310rpx",
                    "top": "928rpx",
                    "fontSize": "28rpx",
                    "color": "#333333"
                  }
                }]
              },
            })
          }
        }
      })
      downloadTask1.onProgressUpdate((res) => {})
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
      icon: 'success',
      duration: 1000
    })
  },
})