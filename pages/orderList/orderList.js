var util = require('../../utils/util.js')
var app = getApp();
Page({
  data: {//1待付款    2待发货  3待收货   4已完成  5已关闭  6退款待处理  7退款完成  8  退款拒绝  9已删除
    chooseTabId: 0,
    pageIndex: 1,
    barItems: [{ id: 0, "name": "全部订单" }, { id: 1, "name": "待付款" }, { id: 2, "name": "待发货" }, { id: 3, "name": "待收货" }, { id: 4, "name": "已完成" }],
    orderData: [],//所有订单数据
    timeData: [],//所有订单数据
    orderListShowFlag: 3,//暂无数据弹框显示Flag
  },
  onLoad: function (options) {
    var that = this;
    var orderChooseStatus = wx.getStorageSync('orderChooseStatus');
    if (orderChooseStatus == 0) {
      if (options.chooseTabId == undefined) {
        that.setData({ chooseTabId: 0 });
      } else {
        that.setData({ chooseTabId: options.chooseTabId });
      }
    } else {
      that.setData({ chooseTabId: orderChooseStatus });
    }
    that.getAllOrders(that.data.chooseTabId, that.data.pageIndex);
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
    var that = this;
    that.data.pageIndex++;
    that.setData({ pageIndex: that.data.pageIndex });
    that.getAllOrders(that.data.chooseTabId, that.data.pageIndex);
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
  // 立即支付
  payOrder(e) {
    var that = this;
    var orderId = e.currentTarget.dataset.orderid;
    wx.request({
      url: app.globalData.ipPath + '/index.php/api/Order/getPreOrder',
      data: {
        open_id: wx.getStorageSync('uniqueId').openid,
        order_id: orderId,
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
              wx.navigateTo({
                url: '../orderDetails/orderDetails?orderId=' + orderId
              })
            },
            fail: function (re) {
              wx.navigateTo({
                url: '../orderDetails/orderDetails?orderId=' + orderId
              })
            }
          })
          that.getAllOrders(that.data.chooseTabId, that.data.pageIndex);
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
  },
  // 再次购买
  payOrderAgain(e) {
    var that = this;
    var orderInfo = e.currentTarget.dataset.item;
    // var orderDetails = {};
    // orderDetails.id = orderInfo.id;
    // orderDetails.linkman_address = orderInfo.linkman_address;
    // orderDetails.linkman_city = orderInfo.linkman_city;
    // orderDetails.linkman_country = orderInfo.linkman_country;
    // orderDetails.linkman_district = orderInfo.linkman_district;
    // orderDetails.linkman_name = orderInfo.linkman_name;
    // orderDetails.linkman_phone = orderInfo.linkman_phone;
    // orderDetails.linkman_province = orderInfo.linkman_province;
    // orderDetails.total = orderInfo.total;
    // orderDetails.remark = orderInfo.remark;
    var orderGoodsList = orderInfo.order_goods;
    var goodsListNew = [];
    for (var i = 0; i < orderGoodsList.length; i++) {
      var obj = {};
      obj.goods_id = orderGoodsList[i].goods_id;
      obj.goods_attr_id = orderGoodsList[i].goods_attr_id;
      obj.goods_size = orderGoodsList[i].goods_size;
      goodsListNew.push(obj);
    }
    goodsListNew = JSON.stringify(goodsListNew);
    wx.navigateTo({
      url: '/pages/confirm_order/confirm_order?orderGoodsList=' + goodsListNew,
    })
    // wx.request({
    //   url: app.globalData.ipPath + '/index.php/api/order/againBuy',
    //   data: {
    //     user_id: wx.getStorageSync('userData').userId,
    //     id: orderId,
    //   },
    //   method: 'POST',
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   complete: function () {
    //     wx.hideLoading();
    //   },
    //   success: function (res) {
    //     console.log(res);
    //     var reOrderId = res.data.data;
    //     if (res.data.code == 1) {
    //       wx.request({
    //         url: app.globalData.ipPath + '/index.php/api/Order/getPreOrder',
    //         data: {
    //           open_id: wx.getStorageSync('uniqueId').openid,
    //           order_id: res.data.data,
    //         },
    //         method: 'POST',
    //         header: {
    //           'content-type': 'application/json'
    //         },
    //         complete: function () {
    //           wx.hideLoading();
    //         },
    //         success: function (res) {
    //           console.log(res);
    //           if (res.data.code == 1) {
    //             var jsonCode = res.data.data;
    //             wx.requestPayment({
    //               'timeStamp': jsonCode.timeStamp,
    //               'nonceStr': jsonCode.nonceStr,
    //               'package': jsonCode.package,
    //               'signType': jsonCode.signType,
    //               'paySign': jsonCode.paySign,
    //               success: function (re) {
    //                 wx.navigateTo({
    //                   url: '../orderDetails/orderDetails?orderId=' + reOrderId
    //                 })
    //               },
    //               fail: function (re) {
    //                 wx.navigateTo({
    //                   url: '../orderDetails/orderDetails?orderId=' + reOrderId
    //                 })
    //               }
    //             })
    //           } else if (res.data.code == 0) {
    //             app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '再次购买失败', 1500);
    //           } else {
    //             app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', res.data.message, 1500);
    //           }
    //         },
    //         fail: function () {
    //           app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '再次购买失败', 1500);
    //         }
    //       })
    //     } else if (res.data.code == 0) {
    //       app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '再次购买失败', 1500);
    //     } else {
    //       app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', res.data.message, 1500);
    //     }
    //   },
    //   fail: function () {
    //     app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '再次购买失败', 1500);
    //   }
    // })
  },
  // 订单搜索页面
  goOrderSearch() {
    wx.navigateTo({
      url: '/pages/orderSearch/orderSearch',
    })
  },
  // 查询订单详情
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
          wx.showLoading({
            title: '加载中',
          })
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
            complete: function () {
              wx.hideLoading();
            },
            success: function (res) {
              console.log(res);
              if (res.data.code == 1) {
                that.getAllOrders(that.data.chooseTabId, that.data.pageIndex);
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
          wx.showLoading({
            title: '加载中',
          })
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
            complete: function () {
              wx.hideLoading();
            },
            success: function (res) {
              console.log(res);
              if (res.data.code == 1) {
                that.getAllOrders(that.data.chooseTabId, that.data.pageIndex);
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
  //待付款取消订单
  cancelOrder(e) {
    var that = this;
    var orderId = e.currentTarget.dataset.orderid;
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
              order_id: orderId,
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
                that.getAllOrders(that.data.chooseTabId, that.data.pageIndex);
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
  // tab切换
  switchItem(e) {
    var that = this;
    var tabIndex = e.currentTarget.dataset.item.id;
    that.setData({ chooseTabId: tabIndex, pageIndex: 1 });
    that.getAllOrders(that.data.chooseTabId, that.data.pageIndex);
  },
  // 跳转订单详情
  AgoOrderDetails(e) {
    var that = this;
    var orderId = e.currentTarget.dataset.item.express_number;
    wx.setClipboardData({
      data: orderId,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
          icon: 'succes',
          duration: 1000,
          mask: true
        });
        setTimeout(function () {
          wx.navigateTo({
            url: '/pages/out/out'
          })
        }, 1000)
      },
      fail: function () {
        wx.showToast({
          title: '复制失败',
          icon: 'error',
          duration: 1000,
          mask: true
        })
      }
    })
  },
  // 跳转订单详情
  goOrderDetails(e) {
    var that = this;
    var orderInfo = e.currentTarget.dataset.item;
    wx.setStorageSync('orderChooseStatus', that.data.chooseTabId);//存储所选订单的类型
    if (orderInfo.is_state < 6) {
      wx.navigateTo({
        url: '/pages/orderDetails/orderDetails?orderId=' + orderInfo.id,
      })
    }
  },
  // 获取用户订单数据
  getAllOrders(status, pageIndex) {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({//获取用户的唯一openId
      url: app.globalData.ipPath + '/index.php/api/order/orderList',
      data: {
        user_id: wx.getStorageSync('userData').userId,
        status: status,
        page: that.data.pageIndex,
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
          if (pageIndex == 1) {
            var requestData = res.data.data;
            if (requestData.length > 0) {
              that.setData({ orderListShowFlag: 1 });
              var newData = requestData;
              setInterval(function () {
                var timeData = [];
                for (var i = 0; i < requestData.length; i++) {
                  var item = {};
                  var obj = requestData[i];
                  if (obj.is_state == 1) {
                    item.status = 1;
                    var dateNow = Date.parse(new Date());
                    var createTimeNew = Date.parse(new Date(obj.create_time.replace(/-/g, '/')));
                    if (dateNow - createTimeNew > 0) {
                      var time = (dateNow - createTimeNew) / 1000;
                      var min = 40 - parseInt(time / 60);
                      if (min <= 0) {
                        min = 0;
                      } else {
                        min = min;
                      }
                    }
                    item.min = min;
                  } else {
                    item.status = 0;
                    item.min = 0;
                  }
                  timeData.push(item);
                }
                that.setData({ timeData: timeData });
              }, 1000);
              that.setData({ orderData: newData });
            } else {
              that.setData({ orderListShowFlag: 2, orderData: [] });
            }
          } else {
            that.setData({ orderListShowFlag: 1 });
            var timeData = that.data.timeData;
            var orderData = that.data.orderData;
            var requestData = res.data.data; 
            for (var i = 0; i < requestData.length; i++) {
              var obj = {};
              obj = requestData[i];
              orderData.push(obj);
            }
            that.setData({ orderData: orderData});
            setInterval(function () {
              for (var i = 0; i < requestData.length; i++) {
                var item = {};
                var obj = requestData[i];
                if (obj.is_state == 1) {
                  item.status = 1;
                  var dateNow = Date.parse(new Date());
                  var createTimeNew = Date.parse(new Date(obj.create_time.replace(/-/g, '/')));
                  if (dateNow - createTimeNew > 0) {
                    var time = (dateNow - createTimeNew) / 1000;
                    var min = 40 - parseInt(time / 60);
                    if (min <= 0) {
                      min = 0;
                    } else {
                      min = min;
                    }
                  }
                  item.min = min;
                } else {
                  item.status = 0;
                  item.min = 0;
                }
                timeData.push(item);
              }
              that.setData({ timeData: timeData });
            }, 1000);
          }
        } else if (res.data.code == 0) {
          app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '订单数据获取失败', 1500);
        } else {
          app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', res.data.message, 1500);
        }
      },
      fail: function () {
        app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '订单数据获取失败', 1500);
      }
    })
  },
  // 去首页
  goIndexPage() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
})