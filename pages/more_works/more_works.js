const app = getApp()
Page({
  data: {
    page: 1,
    id: null,
    note: []
  },
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    this.GoodsMore(options.id, this.data.page)
  },
  // 跳转商品详情页
  goProductDetails(e) {
    var id = e.currentTarget.dataset.item.g_id
    wx.navigateTo({
      url: '/pages/Commodity_details/Commodity_details?id=' + id,
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
    this.data.page++;
    this.setData({
      page: this.data.page
    })
    this.GoodsMore(this.data.id,this.data.page)
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
  GoodsMore:function(id,page){
    let _this = this;
    wx.request({
      url: app.globalData.ipPath + '/index.php/api/paint/GoodsMore',
      data: {
        pid: id,
        page: page
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },// 设置请求的 header
      success: function (res) {
        if (res.statusCode == 200) {
          let data = res.data.data;
          for (let i = 0; i < data.length; i++){
            _this.data.note.push(data[i])
          }
          _this.setData({
            note: _this.data.note
          })
          console.log(res)
        } else {
          console.log("index.js wx.request CheckCallUser statusCode" + res.statusCode)
        }
      },
      fail: function () {
        console.log("index.js wx.request CheckCallUser fail");
      },
      complete: function () {
        // complete
      }
    })
  }
})