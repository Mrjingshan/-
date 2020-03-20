var app = getApp();
Page({
  data: {
    addresslist: {
      address_list: [],//用户收货地址列表数据
    }
  },
  onLoad: function (options) {

  },
  onShow: function () {
    var that = this;
    that.getUserAddressList();
    console.log(getCurrentPages());
    var currentPages = getCurrentPages();
    if (currentPages[currentPages.length - 2].route == 'pages/mine/mine') {
      that.setData({//0不可以点击
        isClick: 0
      });
    } else {
      that.setData({//1可以点击返回提交订单页面
        isClick: 1
      });
    }
  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  //设置默认地址事件
  listenerRadioCheck(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    wx.request({
      url: app.globalData.ipPath + '/index.php/api/address/defaultAddress',
      data: {
        user_id: wx.getStorageSync('userData').userId,
        id: id,
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res);
        if (res.data.code === 1) {
          app.maskToast(that, 'http://wjdh.yccjb.com/successIcon.png', '设置成功', 1500);
          that.getUserAddressList();
        } else if (res.data.code === 0) {
          app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '设置失败', 1500);
        } else {
          app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', res.data.message, 1500);
        }
      },
      fail: function () {
        app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '设置失败', 1500);
      }
    })
  },
  //修改默认地址
  updateAddress: function (e) {
    var that = this;
    var liaddress = JSON.stringify(e.currentTarget.dataset.item);
    // wx.setStorageSync('getDefaultAddressFrom', 1);
    wx.redirectTo({
      url: '../editAddress/editAddress?liaddress=' + liaddress + '&pageState=' + 2,
    })
  },
  //删除地址
  delteAddress: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '',
      content: '确定要删除该地址吗?',
      success: function (res) {
        if (res.confirm) {//用户点击确定
          wx.request({
            url: app.globalData.ipPath + '/index.php/api/address/delAddress',
            data: {
              user_id: wx.getStorageSync('userData').userId,
              id: id,
            },
            method: 'POST',
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              console.log(res);
              if (res.data.code === 1) {
                app.maskToast(that, 'http://wjdh.yccjb.com/successIcon.png', '删除成功', 1500);
                that.getUserAddressList();
              } else if (res.data.code === 0) {
                app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '删除失败', 1500);
              } else {
                app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', res.data.message, 1500);
              }
            },
            fail: function () {
              app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '删除失败', 1500);
            }
          })
        } else if (res.cancel) {//用户点击取消
        }
      }
    })
  },
  //新增收货地址
  addnewaddress: function () {
    var that = this;
    // wx.setStorageSync('getDefaultAddressFrom', 1);
    wx.navigateTo({
      url: '/pages/editAddress/editAddress?pageState=' + 1,
    })
  },
  chooseReceivGoods (e) {
    var addressInfo = e.currentTarget.dataset.item;
    console.log(addressInfo);
    if (this.data.isClick == 1) {
      wx.setStorageSync('otherAddressInfo', addressInfo);
      wx.navigateBack();
      // wx.navigateTo({
      //   url: '/pages/confirm_order/confirm_order?settingAddressStatus='+1,//1有默认地址
      // })
    }
    // if (wx.getStorageSync('getDefaultAddressFrom') == 1) {
    //   wx.navigateTo({
    //     url: '/pages/confirm_order/confirm_order?getOrderAddressFrom=' + 1,
    //   })
    // }
  },
  //获取用户地址列表数据
  getUserAddressList: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.ipPath + '/index.php/api/address/addressList',
      data: { user_id: wx.getStorageSync('userData').userId },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      complete: function () {
        wx.hideLoading()
      },
      success: function (res) {
        console.log(res);
        if (res.data.code === 1) {
          that.setData({ "addresslist.address_list": res.data.data });
        } else if (res.data.code === 0) {
          app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '获取用户地址数据失败', 1500);
        } else {
          app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', res.data.data.message, 1500);
        }
      },
      fail: function () {
        app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '获取用户地址数据失败', 1500);
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
  onUnload() {
    // wx.setStorageSync('getDefaultAddressFrom', 0);
  }
})