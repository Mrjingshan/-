var app = getApp();
Page({
  data: {
    sourceOjb: {}, //溯源码
    codeId:'',//溯源码ID
    arrList: ['溯源码', '订单编号', '下单时间', '付款时间', '发货时间', '成交时间'],
    tableList: [],
  },
  onLoad: function (options) {
    var that = this;
    if (options.goodCode && options.orderId) {
      that.getSourceDataByGoodsCode(options.goodCode, options.orderId);
    } else {
      app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '获取溯源码ID失败', 1500);
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
  //查询溯源码数据
  getSourceDataByGoodsCode(goodCode, orderId) {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    that.setData({ codeId: goodCode});
    wx.request({
      url: app.globalData.ipPath + '/index.php/api/Goods/goodsBySourceCode',
      data: {
        user_id: wx.getStorageSync('userData').userId,
        order_id: orderId, 
        code_id: goodCode
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
          if (res.data.data) {
            if (res.data.data.length == 1) {
              that.setData({ sourceOjb:res.data.data[0]});
              var tableList = [];
              var arrList = that.data.arrList;
              for (var i = 0; i < arrList.length; i++) {
                let obj = {};
                obj.name = arrList[i];
                if (i == 0) {
                  obj.content = that.data.codeId;
                }
                if (i == 1) {
                  obj.content = that.data.sourceOjb.order_id;
                }
                if (i == 2) {
                  obj.content = that.data.sourceOjb.goods_create_time;
                }
                if (i == 3) {
                  obj.content = that.data.sourceOjb.order_pay_time;
                }
                if (i == 4) {
                  obj.content = that.data.sourceOjb.order_delivery_time;
                }
                if (i == 5) {
                  obj.content = that.data.sourceOjb.order_deal_time;
                }
                tableList.push(obj);
              }
              that.setData({ tableList: tableList});
            } else {
              app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '查询作品溯源码失败', 1500);
            }
          } else {
            app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '查询作品溯源码失败', 1500);
          }
        } else if (res.data.code == 0) {
          app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '查询作品溯源码失败', 1500);
        } else {
          app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', res.data.message, 1500);
        }
      },
      fail: function () {
        app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '查询作品溯源码失败', 1500);
      }
    })
  }
})