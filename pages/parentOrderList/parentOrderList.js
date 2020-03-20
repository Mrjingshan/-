var app = getApp();
Page({
    data: {
      //1待付款    2待发货  3待收货   4已完成  5已关闭  6退款待处理  7退款完成  8  退款拒 绝  9已删除
    orderData: [{ orderState: 1 }, { orderState: 2 }, { orderState: 3 }, { orderState: 4 }, { orderState: 5 }],
    chooseTabId: 0,
    barItems: [{ id: 0, "name": "全部订单" }, { id: 1, "name": "待付款" }, { id: 2, "name": "待发货" }, { id: 3, "name": "待收货" }, { id: 4, "name": "已完成" }],
    orderList:[],
    pageIndex:1,
  },
  onLoad: function (options) {

  },
  onReady: function () {

  },
  onShow: function () {
    this.getorderListBySource(this.data.chooseTabId, this.data.pageIndex);
  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {
    this.data.pageIndex++;
    this.setData({
      pageIndex: this.data.pageIndex
    })
    this.getorderListBySource(this.data.chooseTabId,this.data.pageIndex);
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
  getorderListBySource(navId, pageIndex){
    let _this = this;
    if (navId == undefined){
      navId = '0'
    }
    wx.request({
      url: app.globalData.ipPath + '/index.php/api/order/orderListBySource',
      data: {
        user_id: wx.getStorageSync('userData').userId,
        man_id: wx.getStorageSync('myMarketMan').id,
        status: navId,
        page: pageIndex,
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        if(res.data.code == 1){
          if (pageIndex == 1) {
            _this.setData({ orderList:res.data.data});
          } else {
            var orderList = _this.data.orderList;
            var data = res.data.data; 
            for (var i = 0; i < data.length; i++) {
              orderList.push(data[i]);
            }
            _this.setData({ orderList: orderList});
          }
        }
      },
      fail: function () {
        app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '订单信息查询失败', 1500);
      }
    })
  },
  // nav切换
  switchItem(e){
    this.setData({
      orderList: [],
      chooseTabId: e.target.dataset.item.id,
    })
    this.getorderListBySource(this.data.chooseTabId,this.data.pageIndex);
  }
})