var util = require('../../utils/util.js')
var app = getApp();
Page({
  data: {
    inputSearch:'',//订单搜索关键字
    orderData: [],//所有订单数据
    orderDataStatus: 2,//页面数据展示状态
  },
  onLoad: function (options) {
    var that = this;
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
  //搜索框绑定事件
  inputSearch(e) {
    var that = this;
    var inputSearch = e.detail.value;
    that.setData({ inputSearch: inputSearch});
  },
  //搜索按钮事件
  handleSearch(){
    var that = this;
    if (that.data.inputSearch == '') {
      app.maskToast(that, 'http://wjdh.yccjb.com/infoIcon.png', '请输入搜索关键字', 1500);
    } else {
      that.searchOrderList(that.data.inputSearch);
    }
  },
  //查询搜索关键字
  searchOrderList(inputSearch){
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({//获取用户的唯一openId
      url: app.globalData.ipPath + '/index.php/api/order/orderSearch',
      data: {
        user_id: wx.getStorageSync('userData').userId,
        search: inputSearch,
        page:''
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      complete: function(){
        wx.hideLoading();
      },
      success: function (res) {
        console.log(res);
        if (res.data.code == 1) {
          if (res.data.data.length == 0){
            that.setData({ orderData: [], orderDataStatus: 0 });
            // app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '订单查询失败', 1500);
          } else {
            var listData = res.data.data;
            var newListData = [];
            for (var i in listData) {
              newListData.push(listData[i]);
            }
            var newData = [];
            for (var i = 0; i < newListData.length; i++) {
              var obj = {};
              obj = newListData[i];
              if (obj.is_state == 1) {
                var dateNow = Date.parse(new Date());
                var createTime = Date.parse(new Date(obj.create_time.replace(/-/g, '/')));
                if (dateNow - createTime > 0) {
                  var time = (dateNow - createTime) / 1000;
                  var min = 40 - parseInt(time / 60);
                  if (min <= 0) {
                    obj.min = 0;
                  } else {
                    obj.min = min;
                  }
                }
              } else {
                obj.min = 0;
              }
              newData.push(obj);
            }
            that.setData({ orderData: newData, orderDataStatus: 1});
          }
        } else if (res.data.code == 0) {
          that.setData({ orderData: [], orderDataStatus: 0 });
          // app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '订单查询失败', 1500);
        } else {
          app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', res.data.data, 1500);
        }
      },
      fail: function () {
        that.setData({ orderData: [], orderDataStatus: 0 });
        // app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '订单查询失败', 1500);
      }
    })
  },
  // 查询商品详情
  goProductDeatils(e) {
    var that = this;
    var goodsId = e.currentTarget.dataset.goodsid;
    wx.navigateTo({
      url: '/pages/Commodity_details/Commodity_details?id=' + goodsId,
    })
  },
  // 待收货订单确认收货
  confirmReceipt(e) {
    var that = this;
    var orderId = e.currentTarget.dataset.orderid;
    wx.showModal({
      title: '',
      content: '确定该订单已收货吗?',
      success: function (res) {
        if (res.confirm) {//用户点击确定
          wx.request({
            url: app.globalData.ipPath + '/index.php/api/order/receiptOrder',
            data: {
              user_id: wx.getStorageSync('userData').userId,
              order_id: orderId,
            },
            method: 'POST',
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              console.log(res);
              if (res.data.code == 1) {
                that.searchOrderList(that.data.inputSearch);
              } else if (res.data.code == 0) {
                app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '订单确认失败', 1500);
              } else {
                app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', res.data.message, 1500);
              }
            },
            fail: function () {
              app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '订单确认失败', 1500);
            }
          })
        } else if (res.cancel) { }
      }
    })
  },
  // 已取消订单删除订单
  deleteOrder(e) {
    var that = this;
    var orderId = e.currentTarget.dataset.orderid;
    wx.showModal({
      title: '',
      content: '确定要删除该订单吗?',
      success: function (res) {
        if (res.confirm) {//用户点击确定
          wx.request({
            url: app.globalData.ipPath + '/index.php/api/order/delOrder',
            data: {
              user_id: wx.getStorageSync('userData').userId,
              order_id: orderId,
            },
            method: 'POST',
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              console.log(res);
              if (res.data.code == 1) {
                that.searchOrderList(that.data.inputSearch);
              } else if (res.data.code == 0) {
                app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '订单取消失败', 1500);
              } else {
                app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', res.data.message, 1500);
              }
            },
            fail: function () {
              app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '订单取消失败', 1500);
            }
          })
        } else if (res.cancel) { }
      }
    })
  },
  //待付款取消订单
  cancelOrder(e) {
    var that = this;
    var orderId = e.currentTarget.dataset.orderid;
    wx.showModal({
      title: '',
      content: '确定要取消该订单吗?',
      success: function (res) {
        if (res.confirm) {//用户点击确定
          wx.request({
            url: app.globalData.ipPath + '/index.php/api/order/cancelOrder',
            data: {
              user_id: wx.getStorageSync('userData').userId,
              order_id: orderId,
              remark: '',
            },
            method: 'POST',
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              console.log(res);
              if (res.data.code == 1) {
                that.searchOrderList(that.data.inputSearch);
              } else if (res.data.code == 0) {
                app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '订单取消失败', 1500);
              } else {
                app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', res.data.message, 1500);
              }
            },
            fail: function () {
              app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '订单取消失败', 1500);
            }
          })
        } else if (res.cancel) { }
      }
    })
  },
  // 跳转订单详情
  goOrderDetails(e) {
    var that = this;
    var orderId = e.currentTarget.dataset.id;
    wx.setStorageSync('orderChooseStatus', that.data.chooseTabId);//存储所选订单的类型
    wx.navigateTo({
      url: '/pages/orderDetails/orderDetails?orderId=' + orderId,
    })
  },
  //马上去购买--跳转首页
  goIndexPage() {
    var that = this;
    wx.switchTab({
      url: '/pages/index/index',
    })
  }
})