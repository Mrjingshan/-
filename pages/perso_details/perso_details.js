// pages/perso_details/perso_details.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    persolist:{},
    workList:[],
    shareStatus: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (options.shareStatus == 1) { // 分享卡片进入小程序首页
      wx.setStorageSync('shareStatus', 1);
      // app.getUserWXData();
    } else {
      wx.setStorageSync('shareStatus', 0);
    }
    that.getpaintlistid(options.id);
    var shareStatus = wx.getStorageSync('shareStatus');
    that.setData({ shareStatus: shareStatus});
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  getpaintlistid:function(id){
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.ipPath + '/index.php/api/paint/paintlistid',
      data: {
        pid: id
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
          let data = res.data.data[0];
          _this.data.persolist = data;
          console.log(data.honor.length != 0)
          _this.setData({
            persolist: _this.data.persolist
          })
          // console.log(_this.data.persolist);
        } else {
          console.log("index.js wx.request CheckCallUser statusCode" + res.statusCode)
        }
      },
      fail: function () {
        console.log("index.js wx.request CheckCallUser fail");
      }
    })
  },
  CommentClick:function(e){
    var id = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../Comment/Comment?id=' + id
    })
  },
  goMoreworkslist: function (e) {
    var id = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../more_works/more_works?id=' + id
    })
  },
  // 跳转至首页
  artistListGoIndex() {
    if (wx.getStorageSync('userData')) {
      wx.switchTab({
        url: '/pages/index/index',
      })
    } else {
      wx.navigateTo({
        url: '/pages/home/home',
      })
    }
  },
  //分享
  onShareAppMessage: function (res) {
    wx.showShareMenu({
      withShareTicket: true,
      success() {
        console.log('');
      }
    })
    if (res.from === 'button') { // 来自页面内转发按钮  
    }
    var artist = this.data.persolist;
    var showName = '';
    if (artist.penname == '') {
      showName = artist.name;
    } else {
      showName = artist.penname;
    }
    return {
      title: showName + '  ' + this.data.persolist.label,
      path: '/pages/perso_details/perso_details?id=' + this.data.persolist.id + '&&shareStatus=' + 1 + '&userId=' + wx.getStorageSync('userData').userId,
      imageUrl: 'http://wjdh.yccjb.com/shareArtistList.png'
    }
  },
  // 返回首页
  artistDetailsGoIndex() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  // 进入商品详情页
  goProductDetails(e) {
    var that = this;
    console.log(e);
    var id = e.currentTarget.dataset.item.g_id;
    wx.navigateTo({
      url: '/pages/Commodity_details/Commodity_details?id='+id,
    })
  }
})