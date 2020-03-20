var app = getApp();
Page({
  data: {
    listData: []
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
    wx.request({
      url: app.globalData.ipPath + '/index.php/api/SalePayInfo/salesPayInfoList',
      data: {
        user_id: wx.getStorageSync('myMarketMan').user_id,
        man_id: wx.getStorageSync('myMarketMan').id,
        page:1,
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      complete: function(){
        wx.hideLoading();
      },
      success: function (res) {
        console.log(res);
        if (res.data.code == 1) {
          if (res.data.data == null) {
            app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '查询失败', 1500);
          } else {
            that.setData({ listData:res.data.data});
          }
        } else if (res.data.code == 0) {
          app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '查询失败', 1500);
        } else {
          app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', res.data.message, 1500);
        }
      },
      fail: function () {
        app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '查询失败', 1500);
      }
    })
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
      path: '/pages/index/index?shareStatus=' + 1 + '&userId=' + wx.getStorageSync('userData').userId,
      imageUrl: 'http://wjdh.yccjb.com/shareIndex.png'
    }
  },
})