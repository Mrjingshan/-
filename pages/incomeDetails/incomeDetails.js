// pages/incomeDetails/incomeDetails.js
const app = getApp()
Page({
  data: {
    chooseId: 0,
    itemData: [{
      id: 0,
      name: '今日收益'
    }, {
      id: 1,
      name: '本月收益'
    }, {
      id: 2,
      name: '累计收益'
    }],
    listData: [],
    page:"1"
  },
  onLoad: function(options) {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          scrollHeight: res.windowHeight - 54
        });
      }
    });
  },
  onReady: function() {

  },
  onShow: function() {
    this.fn('1');
  },
  onHide: function() {

  },
  onUnload: function() {

  },
  onPullDownRefresh: function() {

  },
  onReachBottom: function() {
    this.data.page++;
    this.setData({
      page:this.data.page
    })
    this.fn(this.data.chooseId+1)
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
  itemChoose(e) {
    var id = e.currentTarget.dataset.index + 1;
    this.setData({
      chooseId: id - 1,
      page:'1',
      listData:[]
    });
    this.fn(id);
  },
  fn(id){
    var that = this;
    wx.request({//获取用户的唯一openId
      url: app.globalData.ipPath + '/index.php/api/SaleOrderGoods/income',
      data: { 
        user_id: wx.getStorageSync('userData').userId,
        man_id: wx.getStorageSync('myMarketMan').id,
        source: id,
        page:that.data.page
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      complete: function () {
        wx.hideLoading();
      },
      success: function (res) {
        console.log(res)
        if(res.data.code == '1'){
          let arr = res.data.data;
          for(let i = 0; i < arr.length; i++){
            that.data.listData.push(arr[i])
          }
          that.setData({
            listData: that.data.listData
          })
        }
      },
      fail: function () {
        app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '获取收益明细失败', 1500);
      }
    })
  }
})