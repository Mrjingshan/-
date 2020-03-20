var app = getApp();
Page({
  data: {
    userInfo:{},//微信授权信息
    messageBool:null,
    phoneFlag: 2,
  },
  onLoad: function (options) {
  },
  onReady: function () {
  },
  onShow: function () {
    var that = this;
    that.setData({ userInfo: wx.getStorageSync('userInfo') });
    if (that.data.userInfo.phone == '0' || that.data.userInfo.phone == null || that.data.userInfo.phone == undefined || that.data.userInfo.phone == '') {
      that.setData({ phoneFlag: 0 });
    } else {
      that.setData({ phoneFlag: 1 });
    }
    // that.getUserInfoReload();
    wx.setStorageSync('orderChooseStatus', 0);//存储所选订单的类型
    that.getMessages();
  },
  //手机号码授权
  getPhoneNumber: function (res) {
    console.log(res);
    var that = this;
    var result = res.detail.errMsg;
    var encryptedData = res.detail.encryptedData;
    var iv = res.detail.iv;
    if (result == "getPhoneNumber:ok") { //同意授权用户手机号
      // 接下来需要后台解密
      // 解密成功之后
      wx.request({ //获取用户的唯一openId
        url: app.globalData.ipPath + '/index.php/api/wechat/getUserPhoneNumber',
        data: {
          wx_openid: wx.getStorageSync('uniqueId').openid,
          sessionKey: wx.getStorageSync('uniqueId').session_key,
          encryptedData: encryptedData,
          iv: iv
        },
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res);
          if (res.data.code == 1) {//手机号授权成功
            let userInfo = that.data.userInfo;
            userInfo.phone = res.data.data;
            that.setData({ userInfo: userInfo});
            wx.setStorageSync('userInfo', userInfo);
            wx.navigateTo({
              url: '/pages/customized/customized',
            })
          } else {//手机号授权失败
            app.maskToast(that, 'http://wjdh.yccjb.com/infoIcon.png', '手机号授权失败', 1500);
          }
        }
      })
    } else { //拒绝授权用户手机号
      app.maskToast(that, 'http://wjdh.yccjb.com/infoIcon.png', '手机号授权失败', 1500);
    }
  },
  //获取我的消息
  getMessages() {
    var that = this;
    wx.request({//获取用户的唯一openId
      url: app.globalData.ipPath + '/index.php/api/message/newReadedMessage',
      data: { user_id: wx.getStorageSync('userData').userId },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      complete: function () {
        wx.hideLoading();
      },
      success: function (res) {
        console.log(res)
        if(res.data.code == 1){
          if(res.data.data.length == 0){
            that.setData({
              messageBool: false
            })
          }else{
            that.setData({
              messageBool:true
            })
            
          }
        }
      },
      fail: function () {
        app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '获取用户系统消息失败', 1500);
      }
    })
  },
  // 跳转定制订单
  customized() {
    wx.navigateTo({
      url: '/pages/customized/customized',
    })
  },
  goPartner() { // 跳转至我是艺术合伙人
    wx.navigateTo({
      url: '/pages/partner/partner',
    })
  },
  goAgent() { // 跳转至我是艺术代理人
    wx.navigateTo({
      url: '/pages/agent/agent',
    })
  },
  goFavorites() { // 跳转至收藏夹
    wx.navigateTo({
      url: '/pages/favorites/favorites',
    })
  },
  aboutUs() { // 跳转至关于我们
    wx.navigateTo({
      url: '/pages/aboutUs/aboutUs',
    })
  },
  message() { // 跳转至我的消息
    wx.navigateTo({
      url: '/pages/message/message',
    })
  },
  addressList() { // 跳转至收货地址
    wx.navigateTo({
      url: '/pages/addressList/addressList',
    })
  },
  goFavorites() { // 跳转至收货地址
    wx.navigateTo({
      url: '/pages/favorites/favorites',
    })
  },
  goAllOrders() { // 跳转至全部订单
    wx.navigateTo({
      url: '/pages/orderList/orderList?chooseTabId=' + 0,
    })
  },
  goAllOrders1() { // 跳转至待付款
    wx.navigateTo({
      url: '/pages/orderList/orderList?chooseTabId=' + 1,
    })
  },
  goAllOrders2() { // 跳转至待发货
    wx.navigateTo({
      url: '/pages/orderList/orderList?chooseTabId=' + 2,
    })
  },
  goAllOrders3() { // 跳转至待收货
    wx.navigateTo({
      url: '/pages/orderList/orderList?chooseTabId=' + 3,
    })
  },
  goAllOrders4() { // 跳转至已完成
    wx.navigateTo({
      url: '/pages/orderList/orderList?chooseTabId=' + 4,
    })
  },
  // 重新获取用户数据
  getUserInfoReload(){
    var that = this;
    wx.request({ //获取用户的唯一openId
      url: app.globalData.ipPath + '/index.php/api/User/findUserByOpenId',
      data: {
        open_id: wx.getStorageSync('uniqueId').openid
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res);
        if (res.data.code == 1) { //已获取用户数据
          if (res.data.data) {
            var userInfo = {};
            userInfo.nickName = res.data.data.wx_name;
            userInfo.gender = res.data.data.wx_sex;
            userInfo.avatarUrl = res.data.data.wx_img;
            userInfo.is_saleman = res.data.data.is_saleman; //1普通用户 2营销员 3合伙人
            wx.setStorageSync('userInfo', userInfo);
          }
        } else if (res.data.code == 0) {
          app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '获取用户信息失败', 1500);
        } else {
          app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', res.data.message, 1500);
        }
      },
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