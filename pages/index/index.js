const app = getApp()
Page({
  data: {
    swiper: [], // 轮播图
    currentSwiper: 0, //轮播图index
    sort: [ // 一级分类图片及id
      {
        "id": '0',
        "url": 'http://wjdh.yccjb.com/gh.png',
      }, {
        "id": '1',
        "url": 'http://wjdh.yccjb.com/yh.png',
      }, {
        "id": '2',
        "url": 'http://wjdh.yccjb.com/sf.png',
      }
    ],
    name: [], // 一级分类名字
    imglist: [], // 为您优选
    authorMask: false,
    indicatorDots: false,
    interval: 1000,
    duration: 1000,
    wxFlag: false,
    phoneFlag: false,
    boutiqueData: [],// 精品推荐
  },
  onLoad: function (options) {
    this.getadvertisingList();// 首页轮播图
    this.getindexType(); // 首页一级分类
    if (options.shareStatus == 1) { // 分享卡片进入小程序首页
      wx.setStorageSync('shareStatus', 0);
    }
  },
  onShow: function () {
    this.getAuthorInfo();
    this.gettypeGoodsHot(); // 首页商品为你优选
    wx.setStorageSync('orderChooseStatus', 0);//存储所选订单的类型
  },
  // 获取用户授权信息
  getAuthorInfo() {
    var that = this;
    wx.login({ //获取用户code
      success: res => {
        console.log(res);
        if (res.code) {
          wx.request({ //获取用户的唯一openI
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
              if (res.data.openid == undefined || res.data.openid == null || res.data.openid == '') {//未授权
                wx.removeStorageSync('uniqueId');
              } else {//已授权
                wx.setStorageSync('uniqueId', res.data);
                if (res.data.openid) {
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
                          var userData = {};
                          userData.userId = res.data.data.wx_id;
                          wx.setStorageSync('userData', userData);
                          var userInfo = {};
                          userInfo.nickName = res.data.data.wx_name;
                          userInfo.gender = res.data.data.wx_sex;
                          userInfo.avatarUrl = res.data.data.wx_img;
                          userInfo.phone = res.data.data.phone;
                          userInfo.is_saleman = res.data.data.is_saleman; //1普通用户 2营销员 3合伙人
                          wx.removeStorageSync('userInfo');
                          wx.setStorageSync('userInfo', userInfo);
                          var shareStatus = wx.getStorageSync('shareStatus');
                          var shareStatusPath = wx.getStorageSync('shareStatusPath');
                          var shareStatusQueryId = wx.getStorageSync('shareStatusQueryId');
                          that.setData({
                            wxFlag: false,
                            phoneFlag: false,
                          });
                        } else {
                          that.setData({
                            wxFlag: true,
                            phoneFlag: false,
                          });
                        }
                      } else { //获取用户数据失败
                        wx.showToast({
                          title: 'userInfo error',
                          image: 'http://wjdh.yccjb.com/errorIcon.png'
                        })
                      }
                    }
                  })
                } else {
                  wx.showToast({
                    title: 'openid error',
                    image: 'http://wjdh.yccjb.com/errorIcon.png'
                  })
                }
              }
            }
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
  //微信授权
  getUserInfo: function (data) {
    console.log(data)
    var isSuccess = data.detail.errMsg;
    if (isSuccess == "getUserInfo:ok") {
      wx.setStorageSync("userInfo", data.detail.userInfo);
      this.setData({
        wxFlag: false,
        phoneFlag: true
      });
    } else {
      this.setData({
        wxFlag: true,
        phoneFlag: false,
      });
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
            that.setData({
              wxFlag: false,
              phoneFlag: false,
            });
            that.setUserInfo(res.data.data);
          } else {
            that.setData({
              wxFlag: false,
              phoneFlag: false,
            });
            that.setUserInfo('');
          }
        }
      })
    } else { //拒绝授权用户手机号
      that.setData({
        wxFlag: false,
        phoneFlag: false,
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
          that.setData({
            wxFlag: false,
            phoneFlag: false
          });
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
          that.setData({
            wxFlag: true,
            phoneFlag: false
          });
          app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '新增用户失败', 1500);
        } else {
          that.setData({
            wxFlag: true,
            phoneFlag: false
          });
          app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', res.data.message, 1500);
        }
      },
    })
  },
  getadvertisingList: function () { // 首页轮播图
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.ipPath + '/index.php/api/Advertising/advertisingList',
      data: {},
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },// 设置请求的 header
      complete: function () {
        wx.hideLoading();
      },
      success: function (res) {
        console.log(res);
        var swiperList = [];
        if (res.statusCode == 200) {
          let data = res.data.data;
          for (let i = 0; i < data.length; i++) {
            if (data[i].show_key == 1) {
              let obj = {};
              obj.url = data[i].image;
              swiperList.push(obj);
            }
          }
          _this.setData({
            swiper: swiperList
          })
        } else {
          app.maskToast(_this, 'http://wjdh.yccjb.com/errorIcon.png', '轮播图加载失败', 1500);
        }
      },
      fail: function () {
        app.maskToast(_this, 'http://wjdh.yccjb.com/errorIcon.png', '轮播图加载失败', 1500);
      }
    })
  },
  //首页轮播图跳转事件
  swiperCatchtapFun: function (e) {
    // if (e.currentTarget.dataset.item == '0') {
    //   wx.navigateTo({
    //     url: '/pages/ad1/ad1?fromStatus=' + 1,
    //   })
    // } else if (e.currentTarget.dataset.item == '1') {
    //   wx.navigateTo({
    //     url: '/pages/ad1/ad1?fromStatus=' + 2,
    //   })
    // }
  },
  getindexType: function () { // 首页一级分类
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.ipPath + '/index.php/api/type/indexType',
      data: {
        basis: 1
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },// 设置请求的 header
      complete: function () {
        wx.hideLoading();
      },
      success: function (res) {
        console.log(res);
        var nameList = [];
        if (res.statusCode == 200) {
          let data = res.data.data;
          for (let i = 0; i < data.length; i++) {
            let obj = {};
            obj.name = data[i].name;
            obj.id = data[i].id;
            nameList.push(obj);
          }
          _this.setData({
            name: nameList
          })
        } else {
          app.maskToast(_this, 'http://wjdh.yccjb.com/errorIcon.png', '一级分类获取失败', 1500);
        }
      },
      fail: function () {
        app.maskToast(_this, 'http://wjdh.yccjb.com/errorIcon.png', '一级分类获取失败', 1500);
      }
    })
  },
  gettypeGoodsHot: function () { //首页商品为你优选
    let _this = this;
    wx.request({
      url: app.globalData.ipPath + '/index.php/api/goods/typeGoodsHot',
      data: {
        type: 1
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },// 设置请求的 header
      complete: function () {},
      success: function (res) {
        console.log(res)
        if (res.statusCode == 200) {
          let data = [];
          let boutiqueData = [];
          if (res.data.data.is_hot != undefined) {
            data = res.data.data.is_hot;
          }
          if (res.data.data.is_boutique != undefined) {
            boutiqueData = res.data.data.is_boutique;
          }
          _this.setData({ imglist: data, boutiqueData: boutiqueData});
        } else {
          app.maskToast(_this, 'http://wjdh.yccjb.com/errorIcon.png', '商品数据加载失败', 1500);
        }
      }
    })
  },
  fnTabSort: function (e) {
    var tabSortId = e.currentTarget.dataset.index.id;
    var name = e.currentTarget.dataset.index.name;
    wx.navigateTo({
      url: '/pages/secondary_one/secondary_one?id=' + tabSortId + '&name=' + name
    })
  },
  goMingJia: function () {
    wx.navigateTo({
      url: '/pages/secondary_two/secondary_two'
    })
  },
  godetailsList: function (e) {
    let id = e.currentTarget.dataset.index.g_id;
    wx.navigateTo({
      url: '/pages/Commodity_details/Commodity_details?id=' + id
    })
  },
  swiperChange: function (e) { //轮播事件
    //判断来源，防止循环切换tab
    console.log(e);
    // if (e.detail.source != "touch") {
    //   return
    // } else {
    //   this.setData({
    //     currentSwiper: e.detail.current
    //   })
    // }
    this.setData({
        currentSwiper: e.detail.current
      })
  },
  // 首页搜索事件
  indexSearch() {
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },
  // 精品推荐点击事件
  boutique_Go(e){
    var id = e.currentTarget.dataset.item.g_id;
    wx.navigateTo({
      url: '/pages/Commodity_details/Commodity_details?id=' + id
    })
  },
  //分享
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