const app = getApp()
Page({
  data: {
    dataObj:{},
    signObj:'',
    imageArr:[],
  },
  onLoad: function (options) {
    var id = options.id;
    this.getDetails(id);
  },
  //查看单个商品溯源码
  sourceDetails(e){
    let id = e.currentTarget.dataset.item.id;
    wx.navigateTo({
      url: '/pages/sourceOrder/sourceOrder?id=' + id,
    })
  },
  // 查看单个商品详情
  checkDetails(e){
    let data = e.currentTarget.dataset.item;
    let imageArr = [];
    if (data.reference_img == '') {
      imageArr = [];
    } else {
      imageArr = data.reference_img.split(',');
    }
    this.setData({ signObj: data, imageArr: imageArr});
  },
  // 查看订单详情
  getDetails(id){
    var that = this;
    wx.request({
      url: app.globalData.ipPath + '/index.php/api/made/customdetails',
      data: {
        orderid: id
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },// 设置请求的 header
      success: function (res) {
        console.log(res);
        if (res.data.code == 1) {
          that.setData({ dataObj: res.data.data });
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