var app = getApp();
Page({
  data: {//1待付款    2待发货  3待收货   4已完成  5已关闭  6退款待处理  7退款完成  8  退款拒绝  9已删除
    orderData: [{ orderState: 1 }, { orderState: 2 }, { orderState: 3 }, { orderState: 4 }, { orderState: 5 }], 
    chooseTabId: 0,
    pageIndex:1,//页码
    barItems: [{ id: 0, "name": "全部订单" }, { id: 1, "name": "待付款" }, { id: 2, "name": "待发货" }, { id: 3, "name": "待收货" }, { id: 4, "name": "已完成" }],
    orderList:[],
    man_id:'',
  },
  onLoad: function (options) {
    if (options.man_id) {
      this.setData({ man_id: options.man_id});
      this.getOrdrData(options.man_id, this.data.chooseTabId, this.data.pageIndex);
    } else {
      app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '获取代理人ID失败', 1500);
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
    var that = this;
    that.data.pageIndex++;
    that.setData({ pageIndex: that.data.pageIndex });
    that.getOrdrData(that.data.man_id, that.data.chooseTabId, that.data.pageIndex);
  },
  // nav切换事件
  switchItem(e){
    this.setData({ chooseTabId: e.currentTarget.dataset.item.id, orderList:[]});
    this.getOrdrData(this.data.man_id, this.data.chooseTabId, this.data.pageIndex);
  },
  // 获取订单数据
  getOrdrData(man_id, status, pageIndex) {
    var that = this;
    wx.request({
      url: app.globalData.ipPath + '/index.php/api/order/orderListBySource',
      data: {
        user_id: wx.getStorageSync('userData').userId,
        man_id: man_id,
        status: status,
        page: pageIndex,
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res);
        if (res.data.code == 1) {
          if (res.data.data == null) {
            app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '订单数据查询失败', 1500);
          } else {
            if (pageIndex == 1) {
              that.setData({ orderList: res.data.data });
            } else {
              var getData = res.data.data;
              var orderList = that.data.orderList;
              for (var i = 0; i < getData.length; i++) {
                orderList.push(getData[i]);
              }
              that.setData({ orderList: orderList});
            }
          }
        } else if (res.data.code == 0) {
          app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '订单数据查询失败', 1500);
        } else {
          app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', res.data.data, 1500);
        }
      },
      fail: function () {
        app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '代理商信息查询失败', 1500);
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
})