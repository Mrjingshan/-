const app = getApp()
Page({
  data: {
    orderData:[],
    page:1,
    shareStatus:''
  },
  onLoad: function (options) {
    var that = this;
    if (options.shareStatus == 1) { // 分享卡片进入小程序首页
      wx.setStorageSync('shareStatus', 1);
      // app.getUserWXData();
    } else {
      wx.setStorageSync('shareStatus', 0);
    }
    that.getpaintGood();
    var shareStatus = wx.getStorageSync('shareStatus');
    that.setData({ shareStatus: shareStatus});
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
    this.data.page++;
    this.setData({
      page: this.data.page
    })
    this.getpaintGood();
  },
  onShareAppMessage: function (res) {
    wx.showShareMenu({
      withShareTicket: true,
      success() {
        console.log('');
      }
    })
    return {
      title: '汇聚实力派画家,让收藏更有价值!',
      path: '/pages/secondary_two/secondary_two?shareStatus=' + 1,
      imageUrl: 'http://wjdh.yccjb.com/shareArtistDetails.png'
    }
  },
  getpaintGood:function(){
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.ipPath + '/index.php/api/paint/paintGood',
      data: {
        page:_this.data.page
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },// 设置请求的 header
      complete: function () {
        wx.hideLoading();
      },
      success: function (res) {
        console.log(res)
        if (res.statusCode == 200) {
          let data = res.data.data;
          for (let i = 0; i < data.length; i++){
            _this.data.orderData.push(data[i])
          }
          _this.setData({
            orderData: _this.data.orderData
          })
        } else {
          console.log("index.js wx.request CheckCallUser statusCode" + res.statusCode)
        }
      },
      fail: function () {
        console.log("index.js wx.request CheckCallUser fail");
      }
    })
  },
  // 跳转至首页
  artistListGoIndex() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  godetails: function (e) {
    var name = null;
    if (e.currentTarget.dataset.item.penname !== ''){
      name = e.currentTarget.dataset.item.penname
    }else{
      name = e.currentTarget.dataset.item.name
    }
    var id = e.currentTarget.dataset.item.id;
    console.log(name,id)
    wx.navigateTo({
      url: '/pages/perso_details/perso_details?id=' + id
    })
  },
  godetailsList: function (e) {
    let id = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../Commodity_details/Commodity_details?id=' + id
    })
  }
})