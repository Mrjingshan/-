const app = getApp()
Page({
  data: {
    accountName:'',//用户姓名
    accountPhone:'',//用户手机号
  },
  onLoad: function (options) {

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
  onShareAppMessage: function () {

  },
  // input用户真实姓名
  setAccountName(e){
    this.setData({ accountName:e.detail.value});
  },
  // input用户联系方式
  setAccountPhone(e) {
    this.setData({ accountPhone: e.detail.value });
  },
  // 保存用户代理商信息
  saveAccount() {
    var that = this;
    var reName = new RegExp('^[a-zA-Z\u4e00-\u9fa5]+$');
    var rePhone = new RegExp('^[a-zA-Z\u4e00-\u9fa5]+$');
    if (that.data.accountName) {
      if (reName.test(that.data.accountName)) {
        if (that.data.accountPhone) {
          if (/^1[34578]\d{9}$/.test(that.data.accountPhone)) {
            that.requestSaveAccount();
          } else {
            app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '请输入有效手机号码', 1500);
          }
        } else {
          app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '请输入手机号码', 1500);
        }
      } else {
        app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '姓名只包含中文/英文', 1500);
      }
    } else {
      app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '请输入真实姓名', 1500);
    }
  },
  // 请求后台接口
  requestSaveAccount() {
    var that = this;
    wx.request({
      url: app.globalData.ipPath + '/index.php/api/SalesMan/editSalesMan',
      data: {
        id: wx.getStorageSync('myMarketMan').user_id,
        man_id: wx.getStorageSync('myMarketMan').id,
        real_name: that.data.accountName,
        phone: that.data.accountPhone,
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res);
        if (res.data.code == 1) {
          wx.navigateBack({ changed: true });//返回上一页
        } else if (res.data.code == 0) {
          app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '设置成功', 1500);
        } else {
          app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', res.data.message, 1500);
        }
      },
      fail: function () {
        app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '设置失败', 1500);
      }
    })
  }
})