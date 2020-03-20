//获取应用实例
const app = getApp()
Page({
  data: {
    userInfo: {},
    navData: [],//分类数据
    productData: [],//商品数据
    currentTab: 0,
    navChooseId: 0,
    navHeight:0,//手机屏幕高度
    topNum:0,
  },
  //事件处理函数
  onLoad: function () {
    this.getindexType();
  },
  onShow: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          navHeight: (res.screenHeight-55.5)
        })
      }
    })
  },
  //跳转商品详情页
  godetailsList: function (e) {
    let id = e.currentTarget.dataset.index;
    console.log(id);
    wx.navigateTo({
      url: '/pages/Commodity_details/Commodity_details?id=' + id
    })
  },
  //获取某个分类下的商品数据
  getsecondGoods: function (id) {
    let _this = this;
    wx.request({
      url: app.globalData.ipPath + '/index.php/api/type/secondGoods',
      data: {
        typeid: id
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },// 设置请求的 header
      success: function (res) {
        console.log(res);
        if (res.data.code == 1) {
          var listData = res.data.data;
          _this.setData({
            productData: listData,
            topNum: 0
          });
        } else {
          console.log("error" + res.statusCode)
        }
      },
      fail: function () {

      },
      complete: function () {
        wx.hideLoading();
      }
    })
  },
  //获取分类分类数据
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
      success: function (res) {
        console.log(res);
        if (res.data.code == 1) {
          let data = res.data.data;
          _this.setData({
            navData: data,
            navChooseId: data[0].id
          });
          wx.showLoading({
            title: '加载中',
          })
          _this.getsecondGoods(_this.data.navChooseId);
        }
      },
      fail: function () {
        console.log("request fail");
      },
      complete: function () {
        wx.hideLoading();
      }
    })
  },
  //tab切换
  switchNav(event) {
    var cur = event.currentTarget.dataset.current;
    var curChooseId = event.currentTarget.dataset.item.id;
    //每个tab选项宽度占1/5
    var singleNavWidth = this.data.windowWidth / 5;
    //tab选项居中
    if (this.data.currentTab == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur
      })
    }
    this.setData({
      navChooseId: curChooseId
    });
    this.getsecondGoods(this.data.navChooseId);
  }
})