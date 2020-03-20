var app = getApp();
Page({
  data: {
    region: ["北京市", "北京市", "东城区"],
    username: '',
    userphone: '',
    addressDetails: '',
    pageState:0,//添加地址or编辑地址
    addressId:0,//地址ID
  },
  onLoad: function (options) {
    var that = this;
    var pageState = options.pageState;
    that.setData({pageState:pageState});
    if (pageState == 1) { // 新增地址
      wx.setNavigationBarTitle({
        title: '新增地址',
      })
    } else { // 编辑地址
      wx.setNavigationBarTitle({
        title: '编辑地址',
      })
      var userAddressData = JSON.parse(options.liaddress);
      that.setData({
        addressId: userAddressData.id,
        username: userAddressData.name,
        userphone: userAddressData.phone,
        addressDetails: userAddressData.address,
        region: [userAddressData.province, userAddressData.city, userAddressData.district]
      });
    }
  },
  onReady: function () {

  },
  onShow: function () {
    
  },
  addressName(e) {//收货人姓名绑定事件
    this.setData({
      username: e.detail.value
    });
  },
  addressPhoneNumber(e) {//收货人联系电话绑定事件
    this.setData({
      userphone: e.detail.value
    });
  },
  addressDetails(e) {//收货人详细地址绑定事件
    this.setData({
      addressDetails: e.detail.value
    });
  },
  addressSave: function () {//保存地址信息
    var that = this;
    if (that.data.pageState == 1) { //保存
      if (that.data.username == '') {
        app.maskToast(that, 'http://wjdh.yccjb.com/infoIcon.png', '请输入收货人姓名', 1500);
      } else {
        if (that.data.userphone == '') {
          app.maskToast(that, 'http://wjdh.yccjb.com/infoIcon.png', '请输入联系电话', 1500);
        } else {
          if (!/^1[34578]\d{9}$/.test(that.data.userphone)) {
            app.maskToast(that, 'http://wjdh.yccjb.com/infoIcon.png', '请输入正确的联系电话', 1500);
          } else {
            if (that.data.addressDetails == '') {
              app.maskToast(that, 'http://wjdh.yccjb.com/infoIcon.png', '请输入收货人详细地址', 1500);
            } else {
              var addressObj = {};
              addressObj.user_id = wx.getStorageSync('userData').userId;
              addressObj.name = that.data.username;
              addressObj.phone = that.data.userphone;
              addressObj.country = '中国';
              addressObj.province = that.data.region[0];
              addressObj.city = that.data.region[1];
              addressObj.district = that.data.region[2];
              addressObj.address = that.data.addressDetails;
              that.addressSaveRequest(addressObj);
            }
          }
        }
      }
    } else {//编辑
      if (that.data.username == '') {
        app.maskToast(that, 'http://wjdh.yccjb.com/infoIcon.png', '请输入收货人姓名', 1500);
      } else {
        if (that.data.userphone == '') {
          app.maskToast(that, 'http://wjdh.yccjb.com/infoIcon.png', '请输入联系电话', 1500);
        } else {
          if (!/^1[34578]\d{9}$/.test(that.data.userphone)) {
            app.maskToast(that, 'http://wjdh.yccjb.com/infoIcon.png', '请输入正确的联系电话', 1500);
          } else {
            if (that.data.addressDetails == '') {
              app.maskToast(that, 'http://wjdh.yccjb.com/infoIcon.png', '请输入收货人详细地址', 1500);
            } else {
              var addressObj = {};
              addressObj.id = that.data.addressId;
              addressObj.user_id = wx.getStorageSync('userData').userId;
              addressObj.name = that.data.username;
              addressObj.phone = that.data.userphone;
              addressObj.country = '中国';
              addressObj.province = that.data.region[0];
              addressObj.city = that.data.region[1];
              addressObj.district = that.data.region[2];
              addressObj.address = that.data.addressDetails;
              that.addressEditRequest(addressObj);
            }
          }
        }
      }
    }
  },
  addressEditRequest: function (addressObj) {//编辑地址事件
    var that = this;
    wx.request({
      url: app.globalData.ipPath + '/index.php/api/address/addresUpdate',
      data: {
        id: addressObj.id,
        user_id: addressObj.user_id,
        name: addressObj.name,
        phone: addressObj.phone,
        country: addressObj.country,
        province: addressObj.province,
        city: addressObj.city,
        district: addressObj.district,
        address: addressObj.address,
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.code === 1) {
          wx.navigateTo({
            url: '/pages/addressList/addressList',
          })
        } else if (res.data.code === 0) {
          app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '编辑地址失败', 1500);
        } else {
          app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', res.data.message, 1500);
        }
      },
      fail: function () {
        app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '编辑地址失败', 1500);
      }
    })
  },
  addressSaveRequest: function (addressObj){//保存地址事件
    var that = this;
    wx.request({
      url: app.globalData.ipPath + '/index.php/api/address/addressAdd',
      data: { 
        user_id: addressObj.user_id,
        name: addressObj.name,
        phone: addressObj.phone,
        country: addressObj.country,
        province: addressObj.province,
        city: addressObj.city,
        district: addressObj.district,
        address: addressObj.address,
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res);
        if (res.data.code === 1) {
          var currentPages = getCurrentPages();
          if (currentPages[currentPages.length - 2].route == 'pages/confirm_order/confirm_order') {
            wx.request({
              url: app.globalData.ipPath + '/index.php/api/Address/findAddressByDefault',
              data: {
                user_id: wx.getStorageSync('userData').userId,
              },
              method: 'POST',
              header: {
                'content-type': 'application/json'
              },// 设置请求的 header
              success: function (res) {
                console.log(res);
                if (res.statusCode == 200) {
                  let data = res.data.data;
                  if (data) {
                    wx.setStorageSync('addDefaultAddressInfo', data);
                    wx.navigateBack();
                  }
                } else {
                  app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '保存失败', 1500);
                }
              },
              fail: function () {
                app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '保存失败', 1500);
              }
            })
          } else {
            wx.setStorageSync('addDefaultAddressInfo', '');
            wx.navigateBack();
          }
          // if (wx.getStorageSync('getDefaultAddressFrom') == 0) {
          //   wx.navigateTo({
          //     url: '/pages/confirm_order/confirm_order',
          //   })
          // } else if (wx.getStorageSync('getDefaultAddressFrom') == 1){
          //   wx.navigateTo({
          //     url: '/pages/addressList/addressList',
          //   })
          // }
        } else if (res.data.code === 0) {
          app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '新增地址失败', 1500);
        } else {
          app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', res.data.message, 1500);
        }
      },
      fail: function () {
        app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '新增地址失败', 1500);
      }
    })
  },
  changeRegin(e) { // 所在地区选择事件
    var that = this;
    var addressHeader = e.detail.value;
    that.setData({
      region: addressHeader
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