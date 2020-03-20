//导入js
var util = require('./utils.js')
const app = getApp()
Page({
  data: {
    cgFlag: true,
    windowHeight:'',
    windowWidth:'',
    slider: [],
    swiperCurrent: 0,
    qrCode:'',
    imagePath:'',
    template: {
      "width": "750rpx",
      "height": "1070rpx",
      "background": "#E7EFF5",
      "views": [{
        "type": "image",
        "url": wx.getStorageSync('sourceCheckImg').picUrl,
        "css": {
          "width": "660rpx",
          "height": "980rpx",
          "left": "29rpx",
          "top": "25rpx",
          "borderRadius": "10rpx",
        }
      }, {
        "type": "image",
        "url": "http://wjdh.yccjb.com/logo.png",
        "css": {
          "width": "170rpx",
          "height": "170rpx",
          "right": "86rpx",
          "bottom": "90rpx",
          "borderRadius": "150rpx",
        }
      }]
    },
  },
  onLoad: function () {
    var that = this;
    //网络访问，获取轮播图的图片
    // util.getRecommend(function (data) {
    //   that.setData({
    //     slider: data.data.slider
    //   })
    // });
    wx.setStorageSync('sourceCheckImg', this.data.slider[this.data.swiperCurrent]);
    this.getadvertisingList();
  },
  onShow:function(){
    let _this = this;
    wx.getStorage({
      key: 'myMarketMan',
      success(res) {
        console.log(res.data.good_qr_code)
        _this.setData({
          qrCode: res.data.good_qr_code
        })
      }
    });
  },
  //轮播图的切换事件
  swiperChange: function (e) {
    //只要把切换后当前的index传给<swiper>组件的current属性即可
    this.setData({
      swiperCurrent: e.detail.current
    })
    var sourceCheckIndex = this.data.swiperCurrent;
    wx.setStorageSync('sourceCheckImg', this.data.slider[sourceCheckIndex]);
  },
  //点击指示点切换
  chuangEvent: function (e) {
    this.setData({
      swiperCurrent: e.currentTarget.id
    })
    console.log(this.data.swiperCurrent);
  },

  loadDiyImage() {
    let _this = this;
    let imgindex = this.data.swiperCurrent; // 获取当前图片下标
    let imgurl = this.data.slider[imgindex].picUrl;// 素材图片
    let qrCode = this.data.qrCode; // 合伙人素材二维码图片
    let phoneInfo = null
    wx.getSystemInfo({
      success: function (res) {
        phoneInfo = res
      }
    });
    var windowHeight = phoneInfo.windowHeight, windowWidth = phoneInfo.windowWidth
    this.setData({
      windowHeight: windowHeight,
      windowWidth: windowWidth
    })
    const wxGetImageInfo = util.promisify(wx.getImageInfo)
    //绘制二维码
    Promise.all([
      //背景图
      wxGetImageInfo({
        src: imgurl
      }),
      //二维码
      wxGetImageInfo({
        src: qrCode
      })
    ]).then(res => {
      console.log(res)
      if (res[0].errMsg == "getImageInfo:ok" && res[1].errMsg == "getImageInfo:ok") {
        const ctx = wx.createCanvasContext('shareCanvas')
        // 底图
        ctx.drawImage(res[0].path, 0, 0, windowWidth, windowHeight)
        // 小程序码
        const qrImgSize = 150
        ctx.drawImage(res[1].path, (windowWidth - qrImgSize) / 2 +90, windowHeight / 1.8+49, qrImgSize, qrImgSize)
        ctx.stroke()
        ctx.draw()
      } else {
        wx.showToast({
          title: '活动素材生成失败',
          icon: '../../asset/images/warning.png',
          duration: 1000
        })
      }
    })
    wx.showToast({
      title: '生成中',
      icon: 'loading',
      duration: 1000
    })
    this.setData({
      cgFlag:false
    })
  },
  saveImage() {//保存图片
    let tempFilePath = ''
    const wxCanvasToTempFilePath = util.promisify(wx.canvasToTempFilePath);
    const wxSaveImageToPhotosAlbum = util.promisify(wx.saveImageToPhotosAlbum)
    wxCanvasToTempFilePath({
      canvasId: 'shareCanvas'
    }, this).then(res => {
      console.log(res.tempFilePath)
      return wxSaveImageToPhotosAlbum({
        filePath: res.tempFilePath
      })
    }).then(res => {
      console.log(res)
      wx.showToast({
        title: '已保存',
        duration: 1000
      })
      this.setData({
        cgFlag: true
      })
    }).catch(res =>{
      console.log(res)
    })
  },
  getadvertisingList(){ // 获取广告素材
    let _this = this;
    wx.request({
      url: app.globalData.ipPath + '/index.php/api/Advertising/advertisingList',
      data: {},
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },// 设置请求的 header
      success: function (res) {
        console.log(res);
        if (res.statusCode == 200) {
          var swiperList = [];
          let data = res.data.data;
          for (let i = 0; i < data.length; i++) {
            if (data[i].show_key == 2) {
              let obj = {};
              obj.id = res.data.data[i].id;
              obj.linkUrl = '';
              obj.picUrl = res.data.data[i].image;
              swiperList.push(obj);
            }
          }
          // for(let i=0;i<res.data.data.length;i++){
          //   let obj = {};
          //   obj.id = res.data.data[i].id;
          //   obj.linkUrl = '';
          //   obj.picUrl = res.data.data[i].image;
          //   _this.data.slider.push(obj)
          // }
          _this.setData({
            slider: swiperList
          })
        } else {
          console.log("index.js wx.request CheckCallUser statusCode" + res.statusCode);
        }
      },
      fail: function () {
        console.log("index.js wx.request CheckCallUser fail");
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
  }
})
