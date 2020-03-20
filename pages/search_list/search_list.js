// pages/search_list/search_list.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    search_value:'',
    search_list:[],
    listName: [],
    page:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.gettypeSearch(options.value)
    // let value = '云想衣裳';
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
    this.data.page++;
    this.setData({
      page: this.data.page
    })
    this.gettypeSearch(this.data.search_value)
    // console.log(this.data.search_value)
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
  inputName:function(e){
    this.setData({
      search_value: e.detail.value
    })
  },
  gettypeSearch:function(options){
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.ipPath + '/index.php/api/type/typeSearch',
      data: {
        name: options,
        page:_this.data.page
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },// 设置请求的 header
      success: function (res) {
        console.log(res)
        if (res.statusCode == 200) {
          let data = res.data.data;
          for(let i=0;i<data.length;i++){
            _this.data.search_list.push(data[i])
          }
          _this.setData({
            search_value: options,
          })
          for (let i = 0; i < _this.data.search_list.length; i++) {
            _this.data.search_list[i].g_name
              =
              _this.hilight_word(options, _this.data.search_list[i].g_name);
          }
          if(res.data.data.length != 0){
            var arr = _this.data.search_list.slice(-Number(res.data.data.length));
            for (let j = 0; j < arr.length; j++) {
              _this.data.listName.push(arr[j])
            }
            _this.setData({
              listName: _this.data.listName
            })
          }
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
  searchClick:function(){
    if (this.data.search_value!=''){
      let userData = wx.getStorageSync('userData');
      let _this = this;
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: app.globalData.ipPath + '/index.php/api/history/saveHistory',
        data: {
          user_id: userData.userId,
          keyword: _this.data.search_value
        },
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },// 设置请求的 header
        success: function (res) {
          if (res.statusCode == 200) {
            _this.setData({
              search_list: [],
              listName: [],
              page: 1
            })
            _this.gettypeSearch(_this.data.search_value)
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
      
    }
  },
  hilight_word: function (key, word) {
    if(key!=''){
      let idx = word.indexOf(key), t = [];
      if (idx > -1) {
        if (idx == 0) {
          t = this.hilight_word(key, word.substr(key.length));
          t.unshift({ key: true, str: key });
          return t;
        }

        if (idx > 0) {
          t = this.hilight_word(key, word.substr(idx));
          t.unshift({ key: false, str: word.substring(0, idx) });
          return t;
        }
      }
      return [{ key: false, str: word }];
    }
  },
  godetailsList: function (e) {
    let id = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../Commodity_details/Commodity_details?id=' + id
    })
  }
})