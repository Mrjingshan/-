var app = getApp();
Page({
  data: {
    partnerData: {},//合伙人数据
    userInfo: {},//用户微信数据
  },
  onLoad: function (options) {
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    });
  },
  onReady: function () {

  },
  onShow: function () {
    var that = this;
    that.getPartnerData();
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
  // 获取合伙人详情
  getPartnerData() {
    var that = this;
    wx.request({
      url: app.globalData.ipPath + '/index.php/api/SalesMan/myMarketMan',
      data: {
        user_id: wx.getStorageSync('userData').userId,
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res);
        if (res.data.code == 1) {
          if (res.data.data == null) {
            app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '合伙人信息查询失败', 1500);
          } else {
            that.setData({
              partnerData : res.data.data
            })
            wx.setStorageSync('myMarketMan', res.data.data);
          }
        } else if (res.data.code == 0) {
          app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '合伙人信息查询失败', 2000);
          setTimeout(function () {
            wx.navigateBack({ changed: true });//返回上一页
          },2000);
        } else {
          app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', res.data.data, 2000); 
          setTimeout(function () {
            wx.navigateBack({ changed: true });//返回上一页
          }, 2000);
        }
      },
      fail: function () {
        app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '合伙人信息查询失败', 2000);
        setTimeout(function () {
          wx.navigateBack({ changed: true });//返回上一页
        }, 2000);
      }
    })
  },
  // 合伙人佣金规则
  goRules() {
    var that = this;
    if (that.data.partnerData.id == undefined) {
      app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '获取合伙人ID失败', 1500);
    } else {
      wx.navigateTo({
        url: '/pages/parentRules/parentRules?id=' + that.data.partnerData.id,
      })
    }
  },
  // 合伙人订单
  goAllOrders() {
    wx.navigateTo({
      url: '/pages/parentOrderList/parentOrderList',
    })
  },
  // 收入明细
  goIncome() {
    var that = this;
    if (that.data.partnerData.id == undefined) {
      app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '获取合伙人ID失败', 1500);
    } else {
      wx.navigateTo({
        url: '/pages/incomeDetails/incomeDetails',
      })
    }
  },
  // 团队管理
  goTeam() {
    var that = this;
    if (that.data.partnerData.id == undefined) {
      app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '获取合伙人ID失败', 1500);
    } else {
      wx.navigateTo({
        url: '/pages/teamManagement/teamManagement?id=' + that.data.partnerData.id,
      })
    }
  },
  // 前往直接销售--小程序码
  goPartnerCode1() {
    wx.navigateTo({
      url: '/pages/agentDirectCode/agentDirectCode',
    })
  },
  // 前往发展艺术代理商--小程序码
  goPartnerCode2() {
    wx.navigateTo({
      url: '/pages/partnerDirectCode/partnerDirectCode',
    })
  },
  goActivity(){
    wx.navigateTo({
      url: '/pages/activitySource/activitySource',
    })
  }
})