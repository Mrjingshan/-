var wxapi = require("../../utils/wxapi.js");
var app = getApp();
Page({
  data: {
    getUserInfoFlag: false,
    getPhoneFlag: false,
    contentFlag: 2,
    homeDescMessage: '登录后即可继续当前操作',
  },
  onLoad: function (options) {
    var that = this;
    var shareStatus = wx.getStorageSync('shareStatus');
    var sceneValue = wx.getStorageSync('sceneValue');
    if (options.codeStr) {//跳转页参数
      if (options.codeStr == 2) {
        // app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '微信未授权', 1500);
        that.setData({
          getUserInfoFlag: true,
          getPhoneFlag: false,
          contentFlag: 0,
        });
      } else if (options.codeStr == 4) {
        // app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '微信未授权', 1500);
        that.setData({
          getUserInfoFlag: true,
          getPhoneFlag: false,
          contentFlag: 0,
        });
      } else if (options.codeStr == 5) {
        // app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '手机号码未授权', 1500);
        that.setData({
          getUserInfoFlag: false,
          getPhoneFlag: true,
          contentFlag: 0,
        });
      }
    } else {
      wx.login({ //获取用户code
        success: res => {
          console.log(res);
          if (res.code) {
            wx.request({ //获取用户的唯一openId
              url: app.globalData.ipPath + '/index.php/api/Wechat/login',
              data: {
                code: res.code
              },
              method: 'POST',
              header: {
                'content-type': 'application/json'
              },
              success: function (res) {
                console.log(res);
                if (res.data.openid) {
                  wx.setStorageSync('uniqueId', res.data);
                  wx.request({ //获取用户的唯一openId
                    url: app.globalData.ipPath + '/index.php/api/User/findUserByOpenId',
                    data: {
                      open_id: res.data.openid
                    },
                    method: 'POST',
                    header: {
                      'content-type': 'application/json'
                    },
                    success: function (res) {
                      console.log(res);
                      if (res.data.code == 1) { //已获取用户数据
                        if (res.data.data) {
                          var userData = {};
                          userData.userId = res.data.data.wx_id;
                          wx.setStorageSync('userData', userData);
                          if (res.data.data.wx_name == undefined || res.data.data.wx_name == null || res.data.data.wx_name == '' || res.data.data.wx_img == undefined || res.data.data.wx_img == null || res.data.data.wx_img == '') {
                            that.setData({
                              getUserInfoFlag: true,
                              getPhoneFlag: false,
                              contentFlag: 0,
                            });
                          } else {
                            var userInfo = {};
                            userInfo.nickName = res.data.data.wx_name;
                            userInfo.gender = res.data.data.wx_sex;
                            userInfo.avatarUrl = res.data.data.wx_img;
                            userInfo.is_saleman = res.data.data.is_saleman; //1普通用户 2营销员 3合伙人
                            wx.setStorageSync('userInfo', userInfo);
                            var shareStatus = wx.getStorageSync('shareStatus');
                            var shareStatusPath = wx.getStorageSync('shareStatusPath');
                            var shareStatusQueryId = wx.getStorageSync('shareStatusQueryId');
                            that.setData({
                              contentFlag: 2,
                            });
                            wx.switchTab({
                              url: '/pages/index/index',
                            })
                          }
                        } else {
                          that.setData({
                            getUserInfoFlag: true,
                            getPhoneFlag: false,
                            contentFlag: 0,
                          });
                        }
                      } else { //获取用户数据失败
                        wx.showToast({
                          title: 'userInfo error',
                          image: 'http://wjdh.yccjb.com/errorIcon.png'
                        })
                      }
                    },
                  })
                } else {
                  wx.showToast({
                    title: 'openid error',
                    image: 'http://wjdh.yccjb.com/errorIcon.png'
                  })
                }
              },
            })
          } else {
            wx.showToast({
              title: 'code error',
              image: 'http://wjdh.yccjb.com/errorIcon.png'
            })
          }
        }
      })
    }
  },
  onReady: function () {

  },
  onShow: function () {
    var that = this;
  },
  getUserInfo: function (data) {
    console.log(data)
    var isSuccess = data.detail.errMsg;
    if (isSuccess == "getUserInfo:ok") {
      wx.setStorageSync("userInfo", data.detail.userInfo);
      this.setData({
        getPhoneFlag: true,
        getUserInfoFlag: false,
        contentFlag: 0,
      });
    } else {
      wx.showModal({
        title: '拒绝授权',
        content: '拒绝授权您将不能使用任何功能, 如想重新授权,请先删除小程序之后再次添加授权,才能使用',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            wx.navigateBack({
              delta: 0
            })
          }
        }
      })
    }
  },
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
            app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '手机号获取失败', 1500);
          }
        }
      })
    } else { //拒绝授权用户手机号
      that.setUserInfo('');
    }
  },
  // 添加用户数据
  setUserInfo(userPhone) {
    var that = this;
    wx.login({ //获取用户code
      success: res => {
        if (res.code) {
          wx.request({ //获取用户的唯一openId
            url: app.globalData.ipPath + '/index.php/api/Wechat/login',
            data: {
              code: res.code
            },
            method: 'POST',
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              console.log(res);
              var userInfo = wx.getStorageSync('userInfo');
              wx.request({ //获取用户的唯一openId
                url: app.globalData.ipPath + '/index.php/api/User/saveUser',
                data: {
                  wx_name: userInfo.nickName,
                  wx_img: userInfo.avatarUrl,
                  wx_account: '', //微信账户
                  wx_sex: userInfo.gender,
                  open_id: res.data.openid,
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
                    if (wx.getStorageSync('sceneValue')) {
                      that.setData({
                        contentFlag: 2,
                      });
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
                          if (res.data.code == 1) {
                            wx.showLoading({
                              title: '跳转中',
                            })
                            wx.switchTab({
                              url: '/pages/index/index',
                            })
                          } else if (res.data.code == 2) {
                            wx.navigateTo({
                              url: '/pages/home/home?codeStr=' + 2,
                            })
                          } else if (res.data.code == 4) {
                            wx.navigateTo({
                              url: '/pages/home/home?codeStr=' + 4,
                            })
                          } else if (res.data.code == 5) {
                            wx.navigateTo({
                              url: '/pages/home/home?codeStr=' + 5,
                            })
                          } else if (res.data.code == 7) {
                            wx.showLoading({
                              title: '跳转中',
                            })
                            wx.switchTab({
                              url: '/pages/index/index',
                            })
                          } else if (res.data.code == 0) {
                            app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '获取数据失败', 1500);
                          } else {
                            app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', res.data.message, 1500);
                          }
                        }
                      })
                    } else {
                      wx.showLoading({
                        title: '跳转中',
                      })
                      that.setData({
                        contentFlag: 2,
                      });
                      wx.switchTab({
                        url: '/pages/index/index',
                      })
                    }
                    // if (shareStatus == 1) {//分享卡片进入
                    //   if (shareStatusPath != 'pages/index/index') {
                    //     if (shareStatusQueryId == '') {// 跳转页面不需要传参
                    //       wx.navigateTo({
                    //         url: '/' + shareStatusPath,
                    //       })
                    //     } else {
                    //       wx.navigateTo({
                    //         url: '/' + shareStatusPath + '?id=' + shareStatusQueryId,
                    //       })
                    //     }
                    //   } else {
                    //     wx.switchTab({
                    //       url: '/pages/index/index',
                    //     })
                    //   }
                    // } else {
                    //   wx.switchTab({
                    //     url: '/pages/index/index',
                    //   })
                    // }
                  } else if (res.data.code == 0) {
                    app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '新增用户失败', 1500);
                  } else {
                    app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', res.data.message, 1500);
                  }
                },
              })
            },
          })
        } else {
          wx.showToast({
            title: 'code error',
            image: 'http://wjdh.yccjb.com/errorIcon.png'
          })
        }
      }
    })
  },
  onHide: function () {
    wx.hideLoading();
  },
  onUnload: function () {
    wx.hideLoading();
  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  }
})