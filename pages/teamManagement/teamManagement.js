var app = getApp();
Page({
  data: {
    partnerList:[],//合伙人列表数据
  },
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight-40
        });
      }
    });
    if (options.id == undefined) {
      app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '获取合伙人ID失败', 1500);
    } else {
      wx.request({
        url: app.globalData.ipPath + '/index.php/api/SalesMan/marketManTeam',
        data: {
          id: options.id
        },
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        complete: function () {
          wx.hideLoading();
        },
        success: function (res) {
          console.log(res);
          if (res.data.code == 1) {
            that.setData({ partnerList:res.data.data});
          } else if (res.data.code == 0) {
            app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '获取团队管理数据失败', 1500);
          } else {
            app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', res.data.message, 1500);
          }
        },
        fail: function () {
          app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '获取团队管理数据失败', 1500);
        }
      })
    }
  },
  onReady: function () {

  },
  onShow: function () {

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