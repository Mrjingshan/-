var app = getApp();
Page({
  data: {
    orderOjb:{},//订单详情
    min:'',//订单支付剩余时间
  },
  onLoad: function (options) {
    var that = this;
    var orderId = options.orderId;
    if (orderId) {
      that.checkOrderDetailsById(orderId);
    }else{
      app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '订单号获取失败', 1500);
    }
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
  gokuaidi () {
    wx.navigateTo({
      url: '/pages/out/out'
    })
  },
  // 立即支付
  payOrder () {
    var that = this;
    wx.request({
      url: app.globalData.ipPath + '/index.php/api/Order/getPreOrder',
      data: {
        open_id: wx.getStorageSync('uniqueId').openid,
        order_id: that.data.orderOjb.order_info.id,
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      complete: function () {
        wx.hideLoading();
      },
      success: function (res) {
        console.log(res);
        if (res.data.code == 1) {
          var jsonCode = res.data.data;
          wx.requestPayment({
            'timeStamp': jsonCode.timeStamp,
            'nonceStr': jsonCode.nonceStr,
            'package': jsonCode.package,
            'signType': jsonCode.signType,
            'paySign': jsonCode.paySign,
            success: function (re) {
              that.checkOrderDetailsById(that.data.orderOjb.order_info.id);
            },
            fail: function (re) {
              app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '订单支付失败', 1500);
            }
          })
        } else if (res.data.code == 0) {
          app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '订单支付失败', 1500);
        } else {
          app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', res.data.message, 1500);
        }
      },
      fail: function () {
        app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '订单支付失败', 1500);
      }
    })
  },
  // 取消订单
  cancelOrder () {
    var that = this;
    wx.showModal({
      title: '',
      content: '确定要取消该订单吗?',
      success: function (res) {
        if (res.confirm) {//用户点击确定
          wx.showLoading({
            title: '加载中',
          })
          wx.request({
            url: app.globalData.ipPath + '/index.php/api/order/cancelOrder',
            data: {
              user_id: wx.getStorageSync('userData').userId,
              order_id: that.data.orderOjb.order_info.id,
              remark: '',
            },
            method: 'POST',
            header: {
              'content-type': 'application/json'
            },
            complete: function () {
              wx.hideLoading();
            },
            success: function (res) {
              console.log(res);
              if (res.data.code == 1) {
                that.checkOrderDetailsById(that.data.orderOjb.order_info.id);
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
  //查询商品溯源码
  goodsSourceSearch(e){
    var that = this;
    var goodCode = e.currentTarget.dataset.goodscode;
    var orderId = e.currentTarget.dataset.orderid;
    wx.navigateTo({
      url: '/pages/sourceCode/sourceCode?goodCode=' + goodCode + '&orderId=' + orderId,
    })
  },
  //查询商品详情
  goProductDeatils(e){
    var that = this;
    var goodsId = e.currentTarget.dataset.goodsid;
    wx.navigateTo({
      url: '/pages/Commodity_details/Commodity_details?id=' + goodsId,
    })
  },
  //根据订单ID查询订单详情
  checkOrderDetailsById(orderId){
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.ipPath + '/index.php/api/order/orderDetail',
      data: {
        user_id: wx.getStorageSync('userData').userId,
        id: orderId,
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      complete:function(){
        wx.hideLoading();
      },
      success: function (res) {
        console.log(res);
        if (res.data.code == 1) {
          that.setData({ orderOjb:res.data.data});
          if (that.data.orderOjb.order_info.is_state == 1) {
            var createTime = that.data.orderOjb.order_info.create_time;
            setInterval(function () {
              var dateNow = Date.parse(new Date());
              var createTimeNew = Date.parse(new Date(createTime.replace(/-/g, '/')));
              if (dateNow - createTimeNew > 0) {
                var time = (dateNow - createTimeNew) / 1000;
                var min = 40 - parseInt(time / 60);
                if (min <= 0) {
                  min = 0;
                } else {
                  min = min;
                }
              }
              that.setData({ min: min });
            }, 1000);
          }
        } else if (res.data.code == 0) {
          app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '查询失败', 1500);
        } else {
          app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', res.data.data, 1500);
        }
      },
      fail: function () {
        app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '查询失败', 1500);
      }
    })
  },
  //弹框提示
  confirmReceipt() {
    var that = this;
    wx.showModal({
      title: '',
      content: '确定该订单已收货吗?',
      success: function (res) {
        if (res.confirm) {//用户点击确定
          wx.showLoading({
            title: '加载中',
          })
          wx.request({
            url: app.globalData.ipPath + '/index.php/api/order/receiptOrder',
            data: {
              user_id: wx.getStorageSync('userData').userId,
              order_id: that.data.orderOjb.order_info.id,
            },
            method: 'POST',
            header: {
              'content-type': 'application/json'
            },
            complete: function () {
              wx.hideLoading();
            },
            success: function (res) {
              console.log(res);
              if (res.data.code == 1) {
                that.checkOrderDetailsById(that.data.orderOjb.order_info.id);
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
  // 一键复制到剪切板
  copyOrderId (e) {
    var that = this;
    var orderId = e.currentTarget.dataset.id;
    wx.setClipboardData({
      data: orderId,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
          icon: 'succes',
          duration: 1000,
          mask: true
        })
      },
      fail: function() {
        wx.showToast({
          title: '复制失败',
          icon: 'error',
          duration: 1000,
          mask: true
        })
      }
    })
  },
  // 再次购买
  payOrderAgain (e) {
    var that = this;
    var orderGoodsList = e.currentTarget.dataset.goods;
    orderGoodsList = JSON.stringify(orderGoodsList);
    wx.navigateTo({
      url: '/pages/confirm_order/confirm_order?orderGoodsList=' + orderGoodsList,
    })
  },
  // 删除订单
  deleteOrder() {
    var that = this;
    wx.showModal({
      title: '',
      content: '确定要删除该订单吗?',
      success: function (res) {
        if (res.confirm) {//用户点击确定
          wx.showLoading({
            title: '加载中',
          })
          wx.request({
            url: app.globalData.ipPath + '/index.php/api/order/delOrder',
            data: {
              user_id: wx.getStorageSync('userData').userId,
              order_id: that.data.orderOjb.order_info.id,
            },
            method: 'POST',
            header: {
              'content-type': 'application/json'
            },
            complete: function () {
              wx.hideLoading();
            },
            success: function (res) {
              console.log(res);
              if (res.data.code == 1) {
                wx.navigateTo({
                  url: '/pages/orderList/orderList',
                })
              } else if (res.data.code == 0) {
                app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '订单删除失败', 1500);
              } else {
                app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', res.data.message, 1500);
              }
            },
            fail: function () {
              app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '订单删除失败', 1500);
            }
          })
        } else if (res.cancel) { }
      }
    })
  },
})