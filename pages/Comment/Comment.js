// pages/Comment/Comment.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    persolist:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getpaintlistid(options.id)
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

  onShareAppMessage: function (res) {
    if (res.from === 'button') { // 来自页面内转发按钮  
    }
    return {
      title: '其实你的家里还缺幅画~',
      path: '/pages/index/index?shareStatus='+1,
      imageUrl: 'http://wjdh.yccjb.com/eg.png'
    }
  },
  getpaintlistid: function (id) {
    let _this = this;
    wx.request({
      url: app.globalData.ipPath + '/index.php/api/paint/paintlistid',
      data: {
        pid: id
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },// 设置请求的 header
      success: function (res) {
        console.log(res)
        if (res.statusCode == 200) {
          let data = res.data.data[0];
          _this.data.persolist = data;
          _this.setData({
            persolist: _this.data.persolist
          })
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
  },
})