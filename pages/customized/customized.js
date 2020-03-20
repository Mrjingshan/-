const app = getApp()
Page({
  data: {
    userInfo: {},
    dataList:[],
    dataFlag:2,
  },
  onLoad: function (options) {
    let that = this;
    that.setData({ userInfo: wx.getStorageSync('userInfo') });
    that.getData();
  },
  // 支付尾款/尾款
  payTailMoney(e){
    let that = this;
    var id = e.currentTarget.dataset.orderid;
    that.payMoney(id);
  },
  payMoney(id){
    let that = this;
    wx.request({
      url: app.globalData.ipPath + '/index.php/api/made/getPreMadeOrder',
      data: {
        order_id: id,
        open_id: wx.getStorageSync('uniqueId').openid
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },// 设置请求的 header
      success: function (res) {
        console.log(res);
        if (res.data.code == 1) {
          let resp = res.data.data;
          wx.requestPayment({
            'timeStamp': resp.timeStamp,
            'nonceStr': resp.nonceStr,
            'package': resp.package,
            'signType': resp.signType,
            'paySign': resp.paySign,
            'success': function (res) {
              console.log(res);
              app.maskToast(that, 'http://wjdh.yccjb.com/successIcon.png', '支付成功', 1500);
              that.getData();
            },
            'fail': function (res) {
              app.maskToast(that, 'http://wjdh.yccjb.com/infoIcon.png', '支付失败', 1500);
            }
          })
        } else if (res.data.code == 0) {
          app.maskToast(that, 'http://wjdh.yccjb.com/infoIcon.png', '支付失败', 1500);
        } else {
          app.maskToast(that, 'http://wjdh.yccjb.com/infoIcon.png', res.data.message, 1500);
        }
      }
    })
  },
  //查询订单详情
  goDetails(e){
    var id = e.currentTarget.dataset.orderid;
    wx.navigateTo({
      url: '/pages/customDetails/customDetails?id=' + id,
    })
  },
  // 查询数据
  getData: function () {
    var that = this;
    wx.request({
      url: app.globalData.ipPath + '/index.php/api/made/customlist',
      data: {
        linkman_phone: that.data.userInfo.phone
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },// 设置请求的 header
      success: function (res) {
        console.log(res);
        if (res.data.code == 1) {
          if (res.data.data.length == 0) {
            that.setData({ dataList: [], dataFlag: 0 });
          } else {
            that.setData({ dataList: res.data.data, dataFlag: 1 });
          }
        }
      }
    })
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

  }
})