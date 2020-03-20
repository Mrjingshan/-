var tdweapp = require('/utils/tdweapp.js');
App({
  onLaunch: function(options) {
    console.log(options);
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    wx.removeStorageSync('addDefaultAddressInfo');
    wx.removeStorageSync('otherAddressInfo');
  },
  onShow: function(options) {
    console.log(options);
    var that = this;
    that.wxUpdate(); // 小程序更新
    var sceneValue = options.query.userId;
    if (options.scene == '1007' || options.scene == '1006' || options.scene == '1044' || options.scene == '1008') {// 分享卡片进入小程序
      if (sceneValue == undefined){
        wx.removeStorageSync('sceneValue');
      } else {
        wx.setStorageSync('sceneValue', sceneValue);
      }
      wx.setStorageSync('shareStatus', 1);
      wx.setStorageSync('shareStatusPath', options.path);
      if (options.query.id) {
        wx.setStorageSync('shareStatusQueryId', options.query.id);
      } else {
        wx.setStorageSync('shareStatusQueryId', '');
      }
    } else if (options.scene == '1031' || options.scene == '1032' || options.scene == '1025' || options.scene == '1047' || options.scene == '1012' || options.scene == '1031' || options.scene == '1048'){//扫描一维码
      wx.setStorageSync('shareStatus', 0);
      wx.setStorageSync('shareStatusPath', '');
      wx.setStorageSync('shareStatusQueryId', '');
      var sceneValue = decodeURIComponent(options.query.scene);
      if (sceneValue == undefined) {
        wx.removeStorageSync('sceneValue');
        wx.setStorageSync('shareStatus', 0);
        wx.setStorageSync('shareStatusPath', '');
        wx.setStorageSync('shareStatusQueryId', '');
      } else {
        if (sceneValue) {
          wx.setStorageSync('sceneValue', sceneValue);
        } else {
          wx.setStorageSync('sceneValue', 0);
        }
      }
    } else {// 正常进入小程序
      wx.removeStorageSync('sceneValue');
      wx.setStorageSync('shareStatus', 0); 
      wx.setStorageSync('shareStatusPath', '');
      wx.setStorageSync('shareStatusQueryId', '');
    }
  },
  //全局变量
  globalData: {
    userInfo: null,
    classifyId: null, //tab选项卡选中值 全局使用
    ipPath: 'http://paint.youbicaifu.com:8080', // 测试服务器地址
    // ipPath: 'https://admin.youbicaifu.com/', // 正式服务器地址
  },
  //页面图文弹框
  maskToast: function(obj, tipicon, tipmsg, ms) {
    obj.setData({
      tipstate: true,
      tipmsg: tipmsg,
      tipicon: tipicon,
    });
    setTimeout(function() {
      obj.setData({
        tipstate: false,
      });
    }, ms);
  },
  //页面选择弹框
  maskConfirmToast: function(obj, tipmsg, ms) {
    obj.setData({
      confirmState: true,
      confirmTitle: tipmsg
    });
    setTimeout(function() {
      obj.setData({
        confirmState: false,
      });
    }, ms);
  },
  //联系客服
  contactService: function(e) {
    wx.showActionSheet({
      itemList: ['呼叫', '010 8528 5571'],
      success: function(res) {
        wx.makePhoneCall({
          phoneNumber: '01085285571'
        })
      }
    })
  },
  // 获取小程序更新机制兼容
  wxUpdate: function() {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate(function(res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function() {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function(res) {
                if (res.confirm) {
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function() {
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
            })
          })
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    };
  }
})