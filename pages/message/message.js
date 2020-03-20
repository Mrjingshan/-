var app = getApp();
Page({
  data: {
    messageList: []
  },
  onLoad: function (options) {

  },
  onReady: function () {

  },
  onShow: function () {
    var that = this;
    that.getMessages();
    this.setReadedMessage();
  },
  onHide: function () {

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
  clearMessages() {//清空所有消息
    var that = this;
    wx.showModal({
      title: '',
      content: '确定要清除所有消息吗?',
      success: function (res) {
        if (res.confirm) {//用户点击确定
          wx.request({//获取用户的唯一openId
            url: app.globalData.ipPath + '/index.php/api/Message/cleanMessage',
            data: { user_id: wx.getStorageSync('userData').userId },
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
                that.getMessages();
              } else if (res.data.code == 0) {
                app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '系统消息清楚失败', 1500);
              } else {
                app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', res.data.message, 1500);
              }
            },
            fail: function () {
              app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '系统消息清楚失败', 1500);
            }
          })
        }
      }
    })
  },
  setReadedMessage () { // 设置已读
    wx.request({//获取用户的唯一openId
      url: app.globalData.ipPath + '/index.php/api/Message/setReadedMessage',
      data: { user_id: wx.getStorageSync('userData').userId },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      complete: function () {
        wx.hideLoading();
      },
      success: function (res) {
        console.log(res,'QQQ');
      },
      fail: function () {
        app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '获取用户系统消息失败', 1500);
      }
    })
  },
  //获取用户所有通知消息
  getMessages() {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({//获取用户的唯一openId
      url: app.globalData.ipPath + '/index.php/api/Message/messageList',
      data: { user_id: wx.getStorageSync('userData').userId },
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
          that.setData({ messageList: res.data.data });
        } else if (res.data.code == 0) {
          app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '获取用户系统消息失败', 1500);
        } else {
          app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', res.data.message, 1500);
        }
      },
      fail: function () {
        app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '获取用户系统消息失败', 1500);
      }
    })
  }
})