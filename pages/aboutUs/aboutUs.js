Page({

  data: {

  },
  onLoad: function (options) {

  },
  onReady: function () {

  },
  onShow: function () {

  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') { // 来自页面内转发按钮  
    }
    return {
      title: '被我家的画美到了，快来一起看看吧~',
      path: '/pages/index/index?shareStatus=' + 1 + '&userId=' + wx.getStorageSync('userData').userId,
      imageUrl: 'http://wjdh.yccjb.com/shareIndex.png'
    }
  },
  // 呼叫
  callPhone1 () {
    wx.showActionSheet({
      itemList: ['呼叫', '400 666 1953'],
      success: function (res) {
        wx.makePhoneCall({
          phoneNumber: '4006661953'
        })
      }
    })
  },
  // 呼叫
  callPhone2() {
    wx.showActionSheet({
      itemList: ['呼叫', '010 8528 5571'],
      success: function (res) {
        wx.makePhoneCall({
          phoneNumber: '01085285571'
        })
      }
    })
  }
})