var app = getApp();
Page({
  data: {
    agentObj:{},//艺术代理商数据
    userInfo:{},//用户微信授权信息
    time:0,
    touchDot: 0,//触摸时的原点
    interval:'',
    flag_hd:true,
    navIndex:1,
    drawableCash:0.00
  },
  onLoad: function (options) {
    var that = this;
    that.setData({userInfo:wx.getStorageSync('userInfo')});
    that.setData({
      flag_hd: true,//重新进入页面之后，可以再次执行滑动切换页面代码
      time:0,
    });
    // clearInterval(interval); // 清除setInterval
  },
  onReady: function () {

  },
  onShow: function () {
    this.getAgentData();
    this.setData({
      myMarketMan: wx.getStorageSync('myMarketMan')
    });
    var a = parseFloat(this.data.myMarketMan.account_balance);
    var b = parseFloat(this.data.myMarketMan.freezing_amount);
    this.setData({ drawableCash: (a - b).toFixed(2) });
  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  // 立即提现
  cashOperation(){
    wx.navigateTo({
      url: '/pages/cashPage/cashPage',
    })
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
  // 获取艺术代理商数据
  getAgentData() {
    var that = this;
    wx.request({
      url: app.globalData.ipPath + '/index.php/api/SalesMan/mySalesMan',
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
            app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '代理商信息查询失败', 1500);
          } else {
            that.setData({ agentObj: res.data.data });
            wx.setStorageSync('myMarketMan', res.data.data);
          }
        } else if (res.data.code == 0) {
          app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '代理商信息查询失败', 1500);
        } else {
          app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', res.data.message, 1500);
        }
      },
      fail: function () {
        app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '代理商信息查询失败', 1500);
      }
    })
  },
  agentRules () { // 跳转至代理商佣金规则
    var that = this;
    if (that.data.agentObj.id == undefined) {
      app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '获取代理商ID失败', 1500);
    } else {
      wx.navigateTo({
        url: '/pages/commissRules/commissRules?id=' + that.data.agentObj.id,
      })
    }
  },
  goAllOrders () {
    wx.navigateTo({
      url: '/pages/agentOrderList/agentOrderList?man_id=' + this.data.agentObj.id,
    })
  },
  goIncome() {
    wx.navigateTo({
      url: '/pages/incomeDetails/incomeDetails',
    })
  },
  goAgentDirectCode() {
    wx.navigateTo({
      url: '/pages/agentDirectCode/agentDirectCode',
    })
  },
  touchStart(e) {
    var touchDot = e.touches[0].pageX; // 获取触摸时的原点
    console.log(touchDot);
    if (touchDot < 268) {
      this.setData({
        navIndex: 2,
        navScrollLeft: 600
      });
    }
  },
  touchStart1(e) {
    console.log(e);
    var touchDot = e.touches[0].pageX; // 获取触摸时的原点
    console.log(touchDot);
    if (touchDot >= 150) {
      this.setData({
        navIndex: 1,
        navScrollLeft: -600
      });
    }
  },
  changeNavItem1(e){
    this.setData({ 
      navIndex: e.target.dataset.nav,
      navScrollLeft:-600
    });
  },
  changeNavItem2(e) {
    this.setData({ 
      navIndex: 2,
      navScrollLeft: 600
    });
  },
  // 跳转至活动素材
  goActivitySource() {
    wx.navigateTo({
      url: '/pages/activitySource/activitySource',
    })
  }
})