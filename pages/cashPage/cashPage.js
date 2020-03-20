

var app = getApp();
Page({
  data: {
    userInfo:{},
    userRole:{roleId:0},//用户角色
    myMarketMan: {},//营销员信息
    view_tip_status:0,//提示信息状态
    amount:0,
    drawableCash:0.00
  },
  onLoad: function (options) {

  },
  onReady: function () {

  },
  onShow: function () {
    this.getAgentData();
    this.setData({
      userInfo: wx.getStorageSync('userInfo'),
      myMarketMan: wx.getStorageSync('myMarketMan'),
    });
    var a = parseFloat(this.data.myMarketMan.account_balance);
    var b = parseFloat(this.data.myMarketMan.freezing_amount);
    this.setData({ drawableCash:(a - b).toFixed(2)});
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
  // input-blur事件
  cashInput(e){
    console.log(e);
    this.setData({
      amount:e.detail.value
    });
  },
  // 立即提现
  cashNow(){
    var that = this;
    wx.request({
      url: app.globalData.ipPath + '/index.php/api/SalePayInfo/saveCash',
      data: {
        user_id: wx.getStorageSync('userData').userId,
        man_id: wx.getStorageSync('myMarketMan').id,
        amount: that.data.amount,
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res);
        if (res.data.code == 1) {
          app.maskToast(that, 'http://wjdh.yccjb.com/successIcon.png', '提现已申请', 1500);
        } else if (res.data.code == 0) {
          app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '提现申请失败', 1500);
        } else {
          app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', res.data.message, 1500);
        }
      },
      fail: function () {
        app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '提现申请失败', 1500);
      }
    })
  },
  // 去微信账号
  setAccount(){
    wx.navigateTo({
      url: '/pages/setAccount/setAccount',
    })
  },
  // 显示/隐藏
  msgShow() {
    if (this.data.view_tip_status==0) {
      this.setData({ view_tip_status:1});
    } else {
      this.setData({ view_tip_status: 0});
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
  // 跳转至提现记录页面
  goCashRecord() {
    wx.navigateTo({
      url: '/pages/cashRecord/cashRecord',
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
})