const app = getApp()
Page({
  data: {
    defaultAddress:'', // 默认地址
    headStatus: 0,
    addressList:null,
    list:[],
    total:0,
    remarks:''
  },
  onLoad: function (options) {
    if (options.settingAddressStatus==1) { // 已选择收货地址
      this.setData({
        defaultAddress: wx.getStorageSync('otherAddressInfo').province + wx.getStorageSync('otherAddressInfo').city + wx.getStorageSync('otherAddressInfo').district + wx.getStorageSync('otherAddressInfo').address,
        addressList: wx.getStorageSync('otherAddressInfo'),
        headStatus: 1,
        list: wx.getStorageSync('submitOrderInfo'),
        total: wx.getStorageSync('submitOrderTotal'),
      })
    } else if (options.orderGoodsList) { // 再次购买
      this.findAddressByDefault();
      this.confirmOrderDetail(options.orderGoodsList);
    } else {
      this.findAddressByDefault();
      this.confirmOrderDetail(options.list);
    }
  },
  onReady: function () {
  },
  onShow: function (options) {
    if (wx.getStorageSync('addDefaultAddressInfo') != '') {
      this.setData({
        defaultAddress: wx.getStorageSync('addDefaultAddressInfo').province + wx.getStorageSync('addDefaultAddressInfo').city + wx.getStorageSync('addDefaultAddressInfo').district + wx.getStorageSync('addDefaultAddressInfo').address,
        addressList: wx.getStorageSync('addDefaultAddressInfo'),
        headStatus: 1,
        list: wx.getStorageSync('submitOrderInfo'),
        total: wx.getStorageSync('submitOrderTotal'),
      })
    } else if (wx.getStorageSync('otherAddressInfo')!=''){
      this.setData({
        defaultAddress: wx.getStorageSync('otherAddressInfo').province + wx.getStorageSync('otherAddressInfo').city + wx.getStorageSync('otherAddressInfo').district + wx.getStorageSync('otherAddressInfo').address,
        addressList: wx.getStorageSync('otherAddressInfo'),
        headStatus: 1,
        list: wx.getStorageSync('submitOrderInfo'),
        total: wx.getStorageSync('submitOrderTotal'),
      })
    }else{
      this.setData({
        headStatus: 2,
      });
    }
  },
  onHide: function () {
    this.setData({
      defaultAddress: '',
      addressList: null,
      headStatus: 0
    })
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
  findAddressByDefault: function () { // 获取用户默认地址
    let _this = this;
    let userData = wx.getStorageSync('userData');
    wx.request({
      url: app.globalData.ipPath + '/index.php/api/Address/findAddressByDefault',
      data: {
        user_id: userData.userId,
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
            console.log('data true');
            wx.setStorageSync('defaultAddressInfo', data);
            let str = data.province + data.city + data.district + data.address;
            _this.setData({
              defaultAddress: str,
              addressList: data,
              headStatus: 1
            })
          } else {
            console.log('data false');
            wx.setStorageSync('defaultAddressInfo', '');
            _this.setData({
              headStatus: 2
            })
          }
        } else {
          console.log("index.js wx.request CheckCallUser statusCode" + res.statusCode);
        }
      },
      fail: function () {
        console.log("index.js wx.request CheckCallUser fail");
      },
      complete: function () {
        // complete
      }
    })
  },
  goaddaddress () { // 添加收货地址
    // wx.setStorageSync('getDefaultAddressFrom', 0);
    wx.setStorageSync('submitOrderInfo', this.data.list);
    wx.setStorageSync('submitOrderTotal', this.data.total);
    wx.navigateTo({
      url: '/pages/editAddress/editAddress?pageState=' + 1
    })
  },
  changeOtherAddress () {
    // wx.setStorageSync('getDefaultAddressFrom', 0);
    wx.setStorageSync('submitOrderInfo', this.data.list);
    wx.setStorageSync('submitOrderTotal', this.data.total);
    wx.navigateTo({
      url: '/pages/addressList/addressList'
    })
  },
  confirmOrderDetail:function (list) { // 获取订单数据
    let _this = this;
    wx.request({
      url: app.globalData.ipPath + '/index.php/api/Order/confirmOrderDetail',
      data: {
        goods_list: list,
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },// 设置请求的 header
      success: function (res) {
        console.log(res)
        if (res.statusCode == 200) {
          let total = 0;
          for (let i = 0; i < res.data.data.length; i++) {
            total += res.data.data[i].goods_size * res.data.data[i].goods_attr_price;
          }
          _this.setData({
            list:res.data.data,
            total: total
          })
          wx.setStorageSync('submitOrderInfo', _this.data.list);
          wx.setStorageSync('submitOrderTotal', _this.data.total);
        } else {
          wx.setStorageSync('submitOrderInfo','');
          wx.setStorageSync('submitOrderTotal',0);
          console.log("index.js wx.request CheckCallUser statusCode" + res.statusCode);
        }
      },
      fail: function () {
        console.log("index.js wx.request CheckCallUser fail");
      }
    })
  },
  remark:function(e){
    this.setData({
      remarks: e.detail.value
    })
  },
  Placorder:function(){ // 提交订单
    let user_id = wx.getStorageSync('userData').userId;
    let linkman_name = this.data.addressList.name;
    let linkman_phone = this.data.addressList.phone;
    console.log(this.data.addressList)
    let linkman_country = this.data.addressList.country;
    let linkman_province = this.data.addressList.province;
    let linkman_city = this.data.addressList.city;
    let linkman_district = this.data.addressList.district;
    let linkman_postal_code = this.data.addressList.postal_code;
    let linkman_address = this.data.addressList.address;
    let remark = this.data.remarks;
    let data = this.data.list;
    let arr = [];
    for(let i = 0; i< data.length;i++){
      let obj = {};
      obj.goods_id = data[i].goods_id;
      obj.goods_name = data[i].goods_name;
      obj.goods_attr_id = data[i].goods_attr_id;
      obj.goods_attr_name = data[i].goods_attr_name;
      obj.goods_price = data[i].goods_attr_price;
      obj.goods_size = data[i].goods_size;
      obj.goods_remark = '';
      obj.cart_id = data[i].cart_id;
      arr.push(obj)
    }
    let _this = this;
    var sceneValue = '';
    if (wx.getStorageSync('sceneValue') == undefined || wx.getStorageSync('sceneValue') == '') {
      sceneValue = wx.getStorageSync('userData').userId;
    } else {
      if (wx.getStorageSync('userInfo').is_saleman == 3 || wx.getStorageSync('userInfo').is_saleman == 2) {
        sceneValue = wx.getStorageSync('sceneValue');
      } else {
        sceneValue = '';
      }
    }
    console.log(sceneValue);
    wx.request({
      url: app.globalData.ipPath + '/index.php/api/Order/createOrder',
      data: {
        user_id: user_id,
        linkman_name: linkman_name,
        linkman_phone: linkman_phone,
        linkman_country: linkman_country,
        linkman_province: linkman_province,
        linkman_city: linkman_city,
        linkman_district: linkman_district,
        linkman_postal_code: linkman_postal_code,
        linkman_address: linkman_address,
        remark: remark,
        goods_list: JSON.stringify(arr),
        source_id: sceneValue,
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },// 设置请求的 header
      success: function (res) {
        console.log(res)
        if (res.statusCode == 200) {
          _this.getPreOrder(res.data.data);
        } else {
          console.log("index.js wx.request CheckCallUser statusCode" + res.statusCode);
        }
      },
      fail: function () {
        console.log("index.js wx.request CheckCallUser fail");
      },
      complete: function () {
        // complete
      }
    })
  },
  getPreOrder:function(orderid){
    let _this = this;
    wx.request({
      url: app.globalData.ipPath + '/index.php/api/Order/getPreOrder',
      data: {
        open_id: wx.getStorageSync('uniqueId').openid,
        order_id: orderid
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },// 设置请求的 header
      success: function (res) {
        console.log(res)
        if (res.statusCode == 200) {
          if (res.data.code == 1) {
            _this.requestPayment(res.data.data, orderid)
          } else if (res.data.code == 0) {
            wx.showToast({
              title: '订单有误',
            })
          } else {
            wx.showToast({
              title: res.data.message,
            })
          }
        } else {
          console.log("index.js wx.request CheckCallUser statusCode" + res.statusCode);
        }
      },
      fail: function () {
        console.log("index.js wx.request CheckCallUser fail");
      },
      complete: function () {
        // complete
      }
    })
  },
  requestPayment: function (resp, orderid){
    let _this = this;
    wx.requestPayment({
      'timeStamp': resp.timeStamp,
      'nonceStr': resp.nonceStr,
      'package': resp.package,
      'signType': resp.signType,
      'paySign': resp.paySign,
      'success': function (res) {
        console.log(res)
        wx.setStorageSync('otherAddressInfo', '');
        wx.navigateTo({
          url: '../orderDetails/orderDetails?orderId=' + orderid
        })
      },
      'fail': function (res) {
        wx.navigateTo({
          url: '../orderDetails/orderDetails?orderId=' + orderid
        })
        console.log('fail:' + JSON.stringify(res));
      }
    })
  }
})