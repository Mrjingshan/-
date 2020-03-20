var app = getApp();
Page({
  data: {
    scrollTop: 0,
    scrollHeight: 0,
    favLiRightWidth: 360,
    optionText: '编辑',
    optionFlag: false,
    bottomOptionFlag: false,
    checkAllFlag: false,
    listData: [],
    chooseData: [],//选择的收藏夹
  },
  onLoad: function (options) {
    var that = this;
  },
  onReady: function () {

  },
  onShow: function () {
    var that = this;
    that.getFavorites();
    that.getRecommend();
    var listData = that.data.listData;
    for (var i = 0; i < listData.length; i++) {
      listData[i].checkState = false;
    }
    that.setData({
      listData: listData
    })
  },
  godetailsList: function (e) {
    // console.log(e)
    let id = e.currentTarget.dataset.item.goods_id;
    wx.navigateTo({
      url: '/pages/Commodity_details/Commodity_details?id=' + id
    })
  },
  favEdit() { // 收藏夹编辑操作
    var that = this;
    console.log(that);
    if (that.data.optionText === '编辑') {
      that.setData({
        favLiRightWidth: 294,
        optionText: '完成',
        optionFlag: true,
        bottomOptionFlag: true,
        scrollHeight: that.data.scrollHeight - 50,
      });
    } else if (that.data.optionText === '完成') {
      that.setData({
        favLiRightWidth: 360,
        optionText: '编辑',
        optionFlag: false,
        bottomOptionFlag: false,
        scrollHeight: that.data.scrollHeight + 50,
      });
    }
  },
  checkboxChange(e) { // 收藏夹编辑事件
    var that = this;
    var chooseArr = e.detail.value;
    console.log(chooseArr);
    var listData = that.data.listData;
    if (chooseArr.length == listData.length) {
      that.setData({
        checkAllFlag: true
      });
      for (var i = 0; i < listData.length; i++) {
        listData[i].checkState = that.data.checkAllFlag;
      }
    } else {
      that.setData({
        checkAllFlag: false
      });
      for (var i = 0; i < listData.length; i++) {
        listData[i].checkState = false;
      }
      for (var i = 0; i < chooseArr.length; i++) {
        for (var j = 0; j < listData.length; j++) {
          if (chooseArr[i] == listData[j].id) {
            listData[j].checkState = true;
          }
        }
      }
    }
    that.setData({
      listData: listData,
      chooseData: chooseArr,
    });
  },
  checkAll(e) { // 全选
    var that = this;
    that.setData({
      checkAllFlag: !that.data.checkAllFlag
    });
    var listData = that.data.listData;
    for (var i = 0; i < listData.length; i++) {
      listData[i].checkState = that.data.checkAllFlag;
    }
    var chooseData = [];
    if (that.data.checkAllFlag) {//全选
      for (var i = 0; i < listData.length; i++) {
        chooseData.push(listData[i].id);
      }
    } else {
      chooseData: []
    }
    that.setData({
      listData: listData,
      chooseData: chooseData
    });
  },
  //取消收藏
  favCancel() {
    var that = this;
    var chooseDataStr = that.data.chooseData.join(',');
    if (chooseDataStr == '') {
      app.maskToast(that, 'http://wjdh.yccjb.com/infoIcon.png', '请选择要取消的数据', 1500);
    } else {
      wx.request({
        url: app.globalData.ipPath + '/index.php/api/CollectGoods/cancelCollect',
        data: { 
          user_id: wx.getStorageSync('userData').userId,
          id: chooseDataStr
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
            that.getFavorites();
          } else if (res.data.code == 0) {
            app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '取消收藏失败', 1500);
          } else {
            app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', res.data.message, 1500);
          }
        },
        fail:function(){
          app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '取消收藏失败', 1500);
        }
      })
    }
  },
  //获取用户收藏夹列表
  getFavorites() {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.ipPath + '/index.php/api/CollectGoods/collectList',
      data: { user_id: wx.getStorageSync('userData').userId },
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
          var listData = res.data.data;
          for (var i = 0; i < listData.length; i++) {
            listData[i].checkState = false;
          }
          that.setData({
            listData: listData
          });
        } else if (res.data.code == 0) {
          app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '获取用户收藏夹数据失败', 1500);
        } else {
          app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', res.data.message, 1500);
        }
      }
    })
  },
  //热门推荐
  getRecommend(){
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.ipPath + '/index.php/api/goods/typeGoodsHot',
      data: { type: 2 },
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
            hotList: res.data.data
          });
        } else if (res.data.code == 0) {
          app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '获取用户推荐数据失败', 1500);
        } else {
          app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', res.data.message, 1500);
        }
      },
      fail:function(){
        app.maskToast(that, 'http://wjdh.yccjb.com/errorIcon.png', '获取用户推荐数据失败', 1500);
      }
    })
  },
  //跳转商品详情页
  goProductDetailsInFavLi (e) {
    var that = this;
    var item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '/pages/Commodity_details/Commodity_details?id=' + item.id,
    })
  },
  //跳转商品详情页
  goProductDetails(e){
    var that = this;
    var id = e.currentTarget.dataset.id;
    console.log(id);
    wx.navigateTo({
      url: '/pages/Commodity_details/Commodity_details?id='+id,
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