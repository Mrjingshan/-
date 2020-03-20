// pages/search/search.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Search_history:[
      { id: 0, name: '山水水墨画' },
      { id: 1, name: '花鸟鱼虫' },
      { id: 2, name: '客厅装饰挂画' },
      { id: 3, name: '牡丹盛放图' },
      { id: 4, name: '餐厅装饰挂画' },
      { id: 5, name: '书房装饰书法' },
    ],
    Search_hot:[],
    historyList:[],
    TitleFlag:false,
    alert_msg: '已清空!',
    imgurl_tishi: 'http://wjdh.yccjb.com/Group@2x.png',
    addcarFlag: true,
    inputValue:'',
    userId:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userId = wx.getStorageSync('userData').userId;
    this.setData({
      userId: userId
    })
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
    let userId = wx.getStorageSync('userData').userId;
    this.setData({
      historyList: [],
      inputValue: '',
      userId: userId
    })
    this.gethistoryList();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // this.setData({
    //   historyList:[],
    //   inputValue: ''
    // })
    // this.gethistoryList();
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
  getindexType() {
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
      complete: function () {
       wx.hideLoading();
      },
      success: function (res) {
        if (res.statusCode == 200) {
          let data = res.data.data;
          for(let i = 0; i<3;i++){
            _this.data.Search_hot.push(data[i])
          }
          _this.setData({
            Search_hot: _this.data.Search_hot
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
  emptyClick:function(){
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.ipPath + '/index.php/api/history/cleanHistory',
      data: {
        user_id: _this.data.userId
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },// 设置请求的 header
      complete: function () {
        wx.hideLoading();
      },
      success: function (res) {
        if (res.statusCode == 200) {
          _this.setData({
            historyList:[]
          })
          _this.gethistoryList();
        } else {
          console.log("index.js wx.request CheckCallUser statusCode" + res.statusCode)
        }
      },
      fail: function () {
        console.log("index.js wx.request CheckCallUser fail");
      }
    })
  },
  watchPassWord: function (event) {
    this.setData({
      inputValue: event.detail.value
    })
  },
  gethistoryList:function(){
    let _this = this;
    // console.log(_this.data.userId)
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.ipPath + '/index.php/api/history/historyList',
      data: {
        user_id: _this.data.userId,
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },// 设置请求的 header
      complete: function () {
        wx.hideLoading();
      },
      success: function (res) {
        if (res.statusCode == 200) {
          console.log(res)
          let data = res.data.data;
          if(data.length>6){
            for (let i = 0; i < 6; i++) {
              _this.data.historyList.push(data[i])
            }
            _this.setData({
              historyList: _this.data.historyList
            })
          } else {
            for (let i = 0; i < data.length; i++) {
              _this.data.historyList.push(data[i])
            }
            _this.setData({
              historyList: _this.data.historyList
            })
          }
        } else {
          console.log("index.js wx.request CheckCallUser statusCode" + res.statusCode)
        }
      },
      fail: function () {
        console.log("index.js wx.request CheckCallUser fail");
      }
    })
  },
  searchClick:function(){
    // console.log(this.data.inputValue)
    if (this.data.inputValue !== ''){
      // let userData = wx.getStorageSync('userData');
      let _this = this;
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: app.globalData.ipPath + '/index.php/api/history/saveHistory',
        data: {
          user_id: _this.data.userId,
          keyword: _this.data.inputValue
        },
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },// 设置请求的 header
        complete: function () {
          wx.hideLoading();
        },
        success: function (res) {
          if (res.statusCode == 200) {
            console.log(res)
            wx.navigateTo({
              url: '../search_list/search_list?value=' + _this.data.inputValue
            })
          } else {
            console.log("index.js wx.request CheckCallUser statusCode" + res.statusCode)
          }
        },
        fail: function () {
          console.log("index.js wx.request CheckCallUser fail");
        }
      })
    }
  },
  historyClick:function(e){
    console.log(e.currentTarget.dataset.index)
    wx.navigateTo({
      url: '../search_list/search_list?value=' + e.currentTarget.dataset.index
    })
  },
  hotClick:function(e){
    let id = e.currentTarget.dataset.index;
    app.globalData.classifyId = id
    wx.switchTab({
      url: '/pages/sort/sort'
    })
  }
})