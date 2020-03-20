var app = getApp();
Page({
  data: {
    userInfo:{},//userInfo
    marketManUrl:'',
    marketManName:'',
    btnStatus:0,
    keyText:'',
    adLogoStatus:0,
  },
  onLoad: function (options) {
  },
  onReady: function () {
  },
  onShow: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    if (wx.getStorageSync('userInfo').nickName == undefined || wx.getStorageSync('userInfo').nickName == '') {
      that.setData({ btnStatus: 1, keyText:''});
    } else {
      if (wx.getStorageSync('userInfo').phone == undefined || wx.getStorageSync('userInfo').phone == '') {
        that.setData({ btnStatus: 2, keyText: '成为艺术代理商，必须授权电话号码哦!', });
      }
    }
    // 拿到scene获取用户头像和昵称
    wx.request({ //获取用户的唯一openId
      url: app.globalData.ipPath + '/index.php/api/salesMan/marketManByuser',
      data: {
        user_id: wx.getStorageSync('sceneValue'),
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
          that.setData({
            marketManUrl: res.data.data.wx_img,
            marketManName: res.data.data.wx_name,
          })
        }
      }
    })
  },
  //微信授权
  getUserInfo: function (data) {
    console.log(data)
    var isSuccess = data.detail.errMsg;
    if (isSuccess == "getUserInfo:ok") {
      wx.setStorageSync("userInfo", data.detail.userInfo);
      this.setData({
        btnStatus: 2,
        keyText: '成为艺术代理商，必须授权电话号码哦!',
      });
    } else {
      this.setData({
        btnStatus: 1,
        keyText: '',
      });
      wx.showModal({
        title: '拒绝授权',
        content: '拒绝授权您将不能使用任何功能, 如想重新授权,请先删除小程序之后再次添加授权,才能使用',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {}
        }
      })
    }
  },
  // 一键成为艺术代理商
  keyComes() {
    var that = this;
    var codeStr = 0;
    wx.request({ //获取用户的唯一openId
      url: app.globalData.ipPath + '/index.php/api/SalesMan/saveSalesMan',
      data: {
        id: wx.getStorageSync('userData').userId,
        man_id: wx.getStorageSync('sceneValue'),
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
        if (res.data.code == 2 || res.data.code == 4) {
          that.setData({
            btnStatus:1,
            keyText: '',
            adLogoStatus: 0,
          });
        } else if (res.data.code == 5) {
          that.setData({
            btnStatus: 2,
            keyText: '成为艺术代理商，必须授权电话号码哦!',
            adLogoStatus: 0,
          });
        } else if (res.data.code == 7) {
          that.setData({
            btnStatus: 0,
            keyText: '',
            adLogoStatus:0,
          });
          app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '你已经是代理商，不能重复哦~', 1500);
          setTimeout(function () {
            wx.switchTab({
              url: '/pages/index/index',
            })
          }, 1500);
        } else if (res.data.code == 8){
          that.setData({
            btnStatus: 0,
            keyText: '',
            adLogoStatus: 0,
          });
          app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '你已经是合伙人，身份不能重复哦~', 1500);
          setTimeout(function(){
            wx.switchTab({
              url: '/pages/index/index',
            })
          },1500);
        } else if (res.data.code == 0) {
          that.setData({
            btnStatus: 0,
            keyText: '',
            adLogoStatus: 0,
          });
          app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '获取数据失败', 1500);
        } else if (res.data.code == 1){
          wx.switchTab({
            url: '/pages/index/index',
          })
        }
      }
    })
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
          if (res.data.code == 1) {
            that.setUserInfo(res.data.data);
          } else if (res.data.code == 0) {
            app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '手机号码获取失败', 1500);
          }
        }
      })
    } else { //拒绝授权用户手机号
      that.setData({
        btnStatus: 0,
        keyText: '',
        adLogoStatus: 1,
      });
      that.setUserInfo('');
    }
  },
  // 添加用户数据
  setUserInfo(userPhone) {
    var that = this;
    var userInfo = wx.getStorageSync('userInfo');
    wx.request({ //获取用户的唯一openId
      url: app.globalData.ipPath + '/index.php/api/User/saveUser',
      data: {
        wx_name: userInfo.nickName,
        wx_img: userInfo.avatarUrl,
        wx_account: '', //微信账户
        wx_sex: userInfo.gender,
        open_id: wx.getStorageSync('uniqueId').openid,
        unionid: '',
        phone: userPhone,
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res);
        if (res.data.code == 1) {
          var userData = {
            userId: res.data.data
          };
          wx.setStorageSync('userData', userData);
          var shareStatus = wx.getStorageSync('shareStatus');
          var shareStatusPath = wx.getStorageSync('shareStatusPath');
          var shareStatusQueryId = wx.getStorageSync('shareStatusQueryId');
          that.keyComes();
        } else if (res.data.code == 0) {
          app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '新增用户失败', 1500);
        } else {
          app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', res.data.message, 1500);
        }
      },
    })
  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  }
})