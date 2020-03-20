var app = getApp();
Page({
  data: {
    sourceOjb:'',
  },
  onLoad: function (options) {
    var id = options.id;
    this.getData(id);
  },
  getData(id){
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.ipPath + '/index.php/api/made/soundcode',
      data: {
        orderid: id,
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
        that.setData({ sourceOjb:res.data.data});
      },
      fail: function () {
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