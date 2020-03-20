// pages/sort/sort.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navData:[],
    currIndex:null,
    page:1,
    listData:[],
    navHeight: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options.id)
    var screenHeight = wx.getSystemInfoSync().windowHeight;
    var navHeight = screenHeight - 58;
    this.setData({ navHeight: navHeight});
    this.getindexType();
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
    wx.setStorageSync('orderChooseStatus', 0);//存储所选订单的类型
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // app.globalData.classifyId = null
    // this.setData({
    //   navData: [],
    //   currIndex: null,
    //   page: 1,
    //   listData: []
    // })
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
    this.data.page++;
    this.setData({
      page: this.data.page
    })
    this.getsecondGoods(this.data.currIndex, this.data.page)
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
  getindexType(){
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.ipPath + '/index.php/api/type/indexType',
      data: {
        basis: 2
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },// 设置请求的 header
      success: function (res) {
        console.log(res);
        if (res.statusCode == 200) {
          let data = res.data.data;
          for(let i = 0;i<data.length;i++){
            _this.data.navData.push(data[i])
          }
          if (app.globalData.classifyId == null) {
            _this.setData({
              navData: _this.data.navData,
              currIndex: _this.data.navData[0].id
            })
          }else{
            _this.setData({
              navData: _this.data.navData,
              currIndex: app.globalData.classifyId
            })
          }
          _this.getsecondGoods(_this.data.currIndex,_this.data.page)
        } else {
          console.log("index.js wx.request CheckCallUser statusCode" + res.statusCode)
        }
      },
      fail: function () {
        console.log("index.js wx.request CheckCallUser fail");
      },
      complete: function () {
       wx.hideLoading();
      }
    })
  },
  getsecondGoods:function(id,page){
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.ipPath + '/index.php/api/type/secondGoods',
      data: {
        typeid: id,
        page:page,
        basis:2
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },// 设置请求的 header
      success: function (res) {
        console.log(res)
        if (res.statusCode == 200) {
          let data = res.data.data;
          for(let i = 0; i<data.length;i++){
            _this.data.listData.push(data[i])
          }
          _this.setData({
            listData: _this.data.listData
          })
        } else {
          console.log("index.js wx.request CheckCallUser statusCode" + res.statusCode)
        }
      },
      fail: function () {
        
      },
      complete: function () {
        wx.hideLoading();
      }
    })
  },
  navChange:function(e){
    console.log(e.currentTarget.dataset.index)
    this.setData({
      currIndex: e.currentTarget.dataset.index,
      listData:[],
      page:1
    })
    this.getsecondGoods(this.data.currIndex, this.data.page)
  },
  goSearch: function () {
    wx.navigateTo({
      url: '../search/search'
    })
  },
  godetailsList: function (e) {
    let id = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../Commodity_details/Commodity_details?id=' + id
    })
  }
})