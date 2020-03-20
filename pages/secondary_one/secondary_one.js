const app = getApp()
Page({
  data: {
    tabdata: [],
    id: null,
    curTabIndex: 0,
    orderData: [],
    orderDataStatus: 2,//没有请求到数据0  请求到数据1  其他2
  },
  onLoad: function (options) {
    this.getsecondType(options.id);
    this.setData({
      curTabIndex: options.id
    })
    wx.setNavigationBarTitle({
      title: options.name //页面标题为路由参数
    });
  },
  getsecondType(id) {
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.ipPath + '/index.php/api/type/secondType',
      data: {
        parent_id: id,
        basis:1
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      }, // 设置请求的 header
      complete: function(){
        wx.hideLoading();
      },
      success: function(res) {
        console.log(res);
        if (res.statusCode == 200) {
          let data = res.data.data;
          if (data.length > 0) {
            let listNew = [];
            for (let i = 0; i < data.length; i++) {
              listNew.push(data[i]);
            }
            _this.setData({
              tabdata: listNew,
              curTabIndex: listNew[0].id
            })
            console.log(_this.data.curTabIndex);
            _this.getsecondGoods(_this.data.curTabIndex);
          }else{
            _this.getsecondGoods(id);
          }
        } else {
          console.log("index.js wx.request CheckCallUser statusCode" + res.statusCode)
        }
      },
      fail: function() {
        console.log("index.js wx.request CheckCallUser fail");
      },
    })
  },
  getsecondGoods: function(id) {
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.ipPath + '/index.php/api/type/secondGoods',
      data: {
        typeid: id
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      }, // 设置请求的 header
      complete: function() {
        wx.hideLoading();
      },
      success: function(res) {
        console.log(res)
        if (res.statusCode == 200) {
          let data = res.data.data;
          if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
              _this.data.orderData.push(data[i])
            }
            _this.setData({
              orderData: _this.data.orderData,
              orderDataStatus: 1
            })
          } else {
            _this.setData({
              orderData: [],
              orderDataStatus: 0
            })
          }
        } else {
          console.log("index.js wx.request CheckCallUser statusCode" + res.statusCode);
        }
      },
      fail: function() {
        console.log("index.js wx.request CheckCallUser fail");
      }
    })
  },
  onTabsItemTap: function(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      curTabIndex: index,
      orderData: []
    })
    this.getsecondGoods(this.data.curTabIndex);
  },
  godetails: function(e) {
    let id = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '/pages/Commodity_details/Commodity_details?id=' + id
    })
  },
  // 分享
  onShareAppMessage: function(res) {
    if (res.from === 'button') { // 来自页面内转发按钮  
    }
    return {
      title: '被我家的画美到了，快来一起看看吧~',
      path: '/pages/index/index?shareStatus=' + 1 + '&userId=' + wx.getStorageSync('userData').userId,
      imageUrl: 'http://wjdh.yccjb.com/shareIndex.png'
    }
  },
})