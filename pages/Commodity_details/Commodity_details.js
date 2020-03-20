const app = getApp()
var a;
Page({
  data: {
    btndisabled:false,
    switchToastStatus: 0, //弹框状态
    shareStatus:'',//分享状态
    detailsData:{},
    imageWidth: 0,
    imageHeight: 0,
    currentSwiper:0,
    g_label: ['真迹保障', '永久溯源', '七天无理由退货', '精心装裱'],
    carList:{},
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    sizeType:null,
    colorType:null,
    attr:null,
    orderData: [],
    maskFlag:true,
    typedata:[],
    typedata2: [],
    num: 1,
    // 使用data数据对象设置样式名
    minusStatus: 'disabled',
    minusStatusAdd: 'normal',
    chicunIndex: -1,
    chicunIndexTow: -1,
    Stock:'',
    btnclass: '',
    btnclass1: '',
    str:'选择尺寸 / 画框颜色',
    str1:'',
    str2:'',
    alert_msg:'添加购物车成功!',
    imgurl_tishi:'http://wjdh.yccjb.com/Group@2x.png',
    addcarFlag:true,
    goodsId:null, // 商品id
    attrId:null, // 属性id
    price:null,
    shoucang:'',
    shoucangid:'',
    cg_id:'',
    imgalist:[],
    goIndex:false,
    contactMsgPath: '',
    specialFlag:'',
  },
  onLoad: function (options) {
    var that = this;
    if (options.shareStatus == 1) { // 分享卡片进入小程序首页
      wx.setStorageSync('shareStatus', 1);
    } else {
      wx.setStorageSync('shareStatus', 0);
    }
    var shareStatus = wx.getStorageSync('shareStatus'); 
    if (shareStatus == 1){
      that.setData({
        goIndex: true
      })
    }
    that.getGoodstype(options.id);
    that.getGoodsDetails(options.id);
    let num = that.data.num;
    let Stock = that.data.Stock;
    let minusStatusAdd = num < Stock ? 'normal' : 'disabled';
    that.setData({
      minusStatusAdd: minusStatusAdd,
      goodsId: options.id,
      contactMsgPath: '/pages/Commodity_details/Commodity_details?id=' + options.id
    });
    console.log(that.data.contactMsgPath);
    that.GoodsCollection();
  },
  onReady: function () {
  },
  onShow: function () {
  },
  onHide: function () {
  },
  onUnload: function () {
  },
  onPullDownRefresh: function () {
  },
  onReachBottom: function () {
  },
  // 确认商品时间
  handleSure: function (){
    var that = this;
  },
  previewImage:function(e){
    a = true
    console.log(a)
    var current = e.target.dataset.src;
    // WeixinJSBridge.invoke('imagePreview', {
    //   current: current,
    //   urls: this.data.imgalist 
    // }, function (res) {
    //   console.log(res.err_msg)
    // })
    wx.previewImage({
      current: current,
      urls: this.data.imgalist,
      success: function (res) {
        console.log(res)
      }
    })
    // console.log(current)
    // wx.previewImage({
    //   current: current, // 当前显示图片的http链接
    //   urls: this.data.imgalist // 需要预览的图片http链接列表
    // })
  },
  getGoodstype:function(id) {
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.ipPath + '/index.php/api/goods/goodsCart',
      data: {
        gid: id
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },// 设置请求的 header
      success: function (res) {
        console.log(res)
        if (res.statusCode == 200) {
          let data = res.data.data;
          if (data.attr.length == 1){
            let arr = [];
            for (let i = 0; i < data.attr.length; i++) {
              arr.push(data.attr[i].name)
            }
            console.log(arr)
            let str1 = arr[0].split("--")[0];
            let str2 = arr[0].split("--")[1];
            _this.setData({
              str: '已选择' + str1 + '/' + str2  + '1副',
              chicunIndex:0,
              chicunIndexTow:0,
            })
            _this.getgoodsStock(id,data.attr[0].id);
          }
        } else {}
      },
      fail: function () {},
      complete: function () {
       wx.hideLoading();
      }
    })
  },
  GoodsCollection:function(){
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.ipPath + '/index.php/api/goods/GoodsCollection',
      data: {
        user_id: wx.getStorageSync('userData').userId,
        goods_id: _this.data.goodsId
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },// 设置请求的 header
      success: function (res) {
        console.log(res)
        if (res.statusCode == 200) {
          if(res.data.data.length == 0){
            _this.setData({
              shoucang: 'http://wjdh.yccjb.com/%E6%94%B6%E8%97%8F@2x.png'
            })
          }else{
            if (res.data.data[0].cg_is_state == '0'){
              _this.setData({
                shoucang: 'http://wjdh.yccjb.com/%E6%94%B6%E8%97%8F@2x%201.png'
              })
            }else{
              _this.setData({
                shoucang: 'http://wjdh.yccjb.com/%E6%94%B6%E8%97%8F@2x.png'
              })
            }
          }
        } else {}
      },
      fail: function () {},
      complete: function () {
        wx.hideLoading();
      }
    })
  },
  goIndexs:function(){
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  saveCollect:function(){
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.ipPath + '/index.php/api/CollectGoods/saveCollect',
      data: {
        user_id: wx.getStorageSync('userData').userId,
        goods_id: _this.data.goodsId
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },// 设置请求的 header
      success: function (res) {
        console.log(res)
        if (res.statusCode == 200) {
          _this.GoodsCollection();
        } else {}
      },
      fail: function () {},
      complete: function () {
        wx.hideLoading();
      }
    })
  },
  getGoodsDetails:function(id){ // 请求详情
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.ipPath + '/index.php/api/goods/GoodsDetails',
      data: {
        gid: id
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },// 设置请求的 header
      success: function (res) {
        console.log(res)
        if (res.statusCode == 200) {
          let data = res.data.data;
          wx.setNavigationBarTitle({
            title: data.product_name
          });
          for (let i = 0; i < data.moreimg.length;i++){
            _this.data.imgalist.push(data.moreimg[i].img_url)
          }
          // _this.g_label = data.g_label.split(',');
          _this.setData({
            detailsData: data,
            // g_label: _this.g_label,
            imgalist: _this.data.imgalist
          })
          // console.log(_this.data.detailsData)
        } else {}
      },
      fail: function () {},
      complete: function(){
        wx.hideLoading();
      }
    })
  },
  showFlag: function (e) { //弹层显示
    if (e.currentTarget.dataset.status == undefined) {
      this.setData({ switchToastStatus: '0' });
    } else {
      var status = e.currentTarget.dataset.status;
      this.setData({ switchToastStatus: status }); // 1加入购物车 2立即结算
    }
    if (wx.getStorageSync('userData') == null || wx.getStorageSync('userData')== undefined ){
      wx.navigateTo({
        url: '/pages/confirm_order/confirm_order?list=' + JSON.stringify(arr)
      })
    }else{
      if (this.data.attrId != null) {
        this.getgoodsStock(e.currentTarget.dataset.index, this.data.attrId)
        this.setData({
          maskFlag: false
        })
      } else {
        let _this = this;
        wx.showLoading({
          title: '加载中',
        })
        wx.request({
          url: app.globalData.ipPath + '/index.php/api/goods/goodsCart',
          data: {
            gid: e.currentTarget.dataset.index
          },
          method: 'POST',
          header: {
            'content-type': 'application/json'
          },// 设置请求的 header
          success: function (res) {
            console.log(res)
            if (res.statusCode == 200) {
              if (res.data.data != '' || res.data.data != undefined) {
                let data = res.data.data;
                let arr = [];
                for (let i = 0; i < data.attr.length; i++) {
                  arr.push(data.attr[i].name)
                }
                let sizeType = [];
                let colorType = [];
                for (let j = 0; j < arr.length; j++) {
                  sizeType.push(arr[j].split("--")[0] + '（带画框）')
                  colorType.push(arr[j].split("--")[1])
                }
                let tmp = [sizeType[0]];//存储原数组第一个元素
                for (let i = 1; i < sizeType.length; i++) {//从第二个开始遍历
                  if (tmp.indexOf(sizeType[i]) === -1) {
                    tmp.push(sizeType[i]);
                  }
                }
                let tmp2 = [colorType[0]];//存储原数组第一个元素
                for (let i = 1; i < colorType.length; i++) {//从第二个开始遍历
                  if (tmp2.indexOf(colorType[i]) === -1) {
                    tmp2.push(colorType[i]);
                  }
                }
                console.log(_this.data.detailsData)
                _this.setData({
                  maskFlag: false,
                  carList: data,
                  sizeType: tmp,
                  colorType: tmp2,
                  Stock: data.current,
                  attr: data.attr,
                  specialFlag:1,
                })
                console.log(_this.data.carList);
              }
            } else {}
          },
          fail: function () {},
          complete: function () {
            wx.hideLoading();
          }
        })
      }
    }
  },
  hideFlag: function () { //弹层隐藏
    this.setData({
      maskFlag: true,
    })
  },
  swiperChange: function (e) { //轮播事件
    console.log(e.detail.current)
    this.setData({
      currentSwiper: e.detail.current
    })
  },
  bindMinus: function () {
    let _this = this;
    let num = this.data.num;
    let Stock = this.data.Stock;
    // 如果大于1时，才可以减
    if (num > 1) {
      num--;
    }
    let price = Number(num) * _this.data.carList.price
    let minusStatus = num <= 1 ? 'disabled' : 'normal';
    let minusStatusAdd = num < Stock ? 'normal' : 'disabled';
    // 将数值与状态写回
    this.setData({
      num: num,
      minusStatus: minusStatus,
      minusStatusAdd: minusStatusAdd,
      price: price
      // carList: _this.data.carList.price
    });
    if(this.data.str!='请选择尺寸/画框颜色'){
      this.setData({
        str: '已选择' + _this.data.str1 + '/' + _this.data.str2 + _this.data.num + '副'
      })
    }
  },
  /* 点击加号 */
  bindPlus: function () {
    let _this = this;
    let num = this.data.num;
    let Stock = this.data.Stock;
    // 不作过多考虑自增1
    if (this.data.num < Stock){
      num++;
      // 只有大于一件的时候，才能normal状态，否则disable状态
      let minusStatus = num < 1 ? 'disabled' : 'normal';
      let minusStatusAdd = num >= Stock ? 'disabled' : 'normal';
      // 将数值与状态写回
      let price = Number(num) * _this.data.carList.price
      this.setData({
        num: num,
        minusStatus: minusStatus,
        minusStatusAdd: minusStatusAdd,
        price: price
      });
      this.setData({
        str: '已选择' + _this.data.str1 + '/' + _this.data.str2 + _this.data.num + '副'
      })
    }else{
      this.setData({
        imgurl_tishi:'http://wjdh.yccjb.com/infoIcon.png',
        alert_msg: '数量超出范围~',
        addcarFlag: false
      })
      setTimeout(function () {
        _this.setData({
          addcarFlag: true
        })
      }, 1000)
    }
  },
  tabclick: function (e) { //选择尺寸分类
    let _this = this;
    this.setData({
      chicunIndex: e.currentTarget.dataset.index
    });
    let item = e.currentTarget.dataset.item
    this.setData({
      str1: item.split('（')[0]
    })
    if (this.data.chicunIndex !== -1 && this.data.chicunIndexTow !== -1){
      let str = '';
      str = this.data.str1 + '--' + this.data.str2;
      this.setData({
        str: '已选择' + _this.data.str1 + '/' + _this.data.str2 + _this.data.num + '副'
      })
      console.log(str)
      for (let i = 0; i < this.data.attr.length;i++){
        if (this.data.attr[i].name == str){
          _this.setData({
            attrId: this.data.attr[i].id,
            num: 1,
            price:null,
            btndisabled: false,
            addcarFlag: true
          })
          _this.getgoodsStock(_this.data.attr[i].goods_id, _this.data.attr[i].id);
          return false;
        }else{
          this.setData({
            imgurl_tishi: 'http://wjdh.yccjb.com/infoIcon.png',
            alert_msg: '请选择其他尺寸',
            addcarFlag: false,
            btndisabled: true,
            Stock: 0
          })
          setTimeout(function () {
            _this.setData({
              addcarFlag: true
            })
          }, 1000)
        }
      }
    }
  },
  tabclickTwo: function(e) { // 选择画框分类z
    let _this = this;
    this.setData({
      chicunIndexTow: e.currentTarget.dataset.index
    });
    let item = e.currentTarget.dataset.item
    this.setData({
      str2: item
    })
    if (this.data.chicunIndex !== -1 && this.data.chicunIndexTow !== -1) {
      let str = '';
      str = this.data.str1 + '--' + this.data.str2
      this.setData({
        str: '已选择' + _this.data.str1 + '/' + _this.data.str2 + _this.data.num + '副'
      })
      console.log(str)
      for (let i = 0; i < this.data.attr.length; i++) {
        if (this.data.attr[i].name == str) {
          _this.getgoodsStock(_this.data.attr[i].goods_id, _this.data.attr[i].id)
          _this.setData({
            attrId: this.data.attr[i].id,
            num: 1,
            price: null,
            addcarFlag: true,
            btndisabled:false,
            specialFlag: 2,
          })
          return false;
        }else{
          this.setData({
            imgurl_tishi: 'http://wjdh.yccjb.com/infoIcon.png',
            alert_msg: '请选择其他颜色',
            addcarFlag: false,
            btndisabled:true,
            Stock:0
          })
          setTimeout(function () {
            _this.setData({
              addcarFlag: true
            })
          }, 1000)
        }
      }
    }
  },
  getgoodsStock: function (gid, attrid){
    this.setData({
      attrid: attrid
    })
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.ipPath + '/index.php/api/goods/goodsStock',
      data: {
        gid: gid,
        attrid: attrid
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },// 设置请求的 header
      success: function (res) {
        console.log(res,'res')
        if (res.statusCode == 200) {
          _this.data.carList.img_url = res.data.data.icon
          _this.data.carList.price = res.data.data.attr_price
          _this.data.carList.attr_id = res.data.data.attr_id
          _this.setData({
            Stock: res.data.data.s_current,
            carList: _this.data.carList
          });
          console.log(_this.data.carList)
          // console.log(_this.data.carList, 'carList', _this.data.price)
          if (_this.data.Stock > 1) {
            _this.setData({
              minusStatusAdd: 'normal'
            })
          }
        } else {}
      },
      fail: function () {},
      complete: function () {
        wx.hideLoading();
      }
    })
  },
  alertShow:function () {//加入购物车
    let _this = this;
    let user_id = wx.getStorageSync('userData').userId;
    let goods_id = this.data.goodsId;
    let goods_attr_id = this.data.carList.attr_id;
    if (goods_attr_id == undefined){
      goods_attr_id = this.data.carList.attr[0].id;
    }
    console.log(this.data.carList)
    let goods_size = this.data.num;
    let goods_price = this.data.carList.price;
    let price;
    if (this.data.price == null){
      price = this.data.carList.price
    }else{
      price = this.data.price
    }
    // console.log(_this.data.goodsId, _this.data.attrId, _this.data.num)
    if (this.data.chicunIndex !== -1 && this.data.chicunIndexTow !== -1 && this.data.Stock>0) {
      let _this = this;
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: app.globalData.ipPath + '/index.php/api/Cart/addCart',
        data: {
          user_id: user_id,
          goods_id: goods_id,
          goods_attr_id: goods_attr_id,
          goods_size: goods_size,
          goods_price: goods_price,
          goods_total: Number(price)
        },
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },// 设置请求的 header
        success: function (res) {
          console.log(res,'加入购物车')
          if (res.statusCode == 200) {
            _this.setData({
              alert_msg: '添加购物车成功！',
              addcarFlag: false,
              imgurl_tishi: 'http://wjdh.yccjb.com/Group@2x.png'
            })
          } else {}
        },
        fail: function () {},
        complete: function () {
          wx.hideLoading();
        }
      })
      setTimeout(function () {
        _this.setData({
          addcarFlag: true,
          maskFlag: true
        })
      }, 1000)
    } else if (this.data.str == '选择尺寸 / 画框颜色') {
      this.setData({
        imgurl_tishi: 'http://wjdh.yccjb.com/infoIcon.png',
        alert_msg:'请选择商品属性',
        addcarFlag: false
      })
      setTimeout(function () {
        _this.setData({
          addcarFlag: true
        })
      }, 1000)
    } else if (this.data.Stock <= 0) {
      this.setData({
        imgurl_tishi: 'http://wjdh.yccjb.com/infoIcon.png',
        alert_msg: '库存不足',
        addcarFlag: false
      })
      setTimeout(function () {
        _this.setData({
          addcarFlag: true
        })
      }, 1000)
    }
  },
  gopurchase:function(){//立即购买
    console.log(wx.getStorageSync('userData').userId)
    var arr = [];
    var obj = {};
    obj.goods_id = this.data.goodsId;
    obj.goods_attr_id = this.data.carList.attr_id;
    if (obj.goods_attr_id == undefined){
      obj.goods_attr_id = this.data.carList.attr[0].id
    }
    obj.goods_size = this.data.num;
    arr.push(obj);
    let _this = this;
    if (this.data.chicunIndex !== -1 && this.data.chicunIndexTow !== -1 && this.data.Stock > 0) {
      if (wx.getStorageSync('userData').userId!=undefined){
        wx.navigateTo({
          url: '/pages/confirm_order/confirm_order?list=' + JSON.stringify(arr)
        })
      }else{
        wx.navigateTo({
          url: '/pages/home/home'
        })
      }
      setTimeout(function () {
        _this.setData({
          addcarFlag: true,
          maskFlag: true
        })
      }, 1000)
    } else if (this.data.str == '选择尺寸 / 画框颜色') {
      this.setData({
        imgurl_tishi: 'http://wjdh.yccjb.com/infoIcon.png',
        alert_msg: '请选择商品属性',
        addcarFlag: false
      })
      setTimeout(function () {
        _this.setData({
          addcarFlag: true
        })
      }, 1000)
      console.log(this.data.addcarFlag)
    } else if (this.data.Stock <= 0) {
      this.setData({
        imgurl_tishi: 'http://wjdh.yccjb.com/infoIcon.png',
        alert_msg: '库存不足',
        addcarFlag: false
      })
      setTimeout(function () {
        _this.setData({
          addcarFlag: true
        })
      }, 1000)
    }
  },
  //分享
  onShareAppMessage: function (res) {
    wx.showShareMenu({
      withShareTicket: true,
      success() {
        console.log('');
      }
    })
    if (res.from === 'button') { // 来自页面内转发按钮
      console.log(res);
    }
    return {
      title: '【' + this.data.detailsData.g_name + '】' + this.data.detailsData.desc,
      path: '/pages/Commodity_details/Commodity_details?id=' + this.data.goodsId + '&&shareStatus=' + 1+'&userId='+wx.getStorageSync('userData').userId,
      imageUrl: this.data.detailsData.moreimg[0].img_url
    }
  },
  //客服
  contactHandle(e) {
    this.setData({
      contactMsgPath: '/pages/Commodity_details/Commodity_details?id=' + this.data.detailsData.g_id,
    });
  },
  // 跳转商品详情页
  goProductDetails(e) {
    var that = this;
    var id = e.currentTarget.dataset.item.g_id;
    wx.navigateTo({
      url: '/pages/Commodity_details/Commodity_details?id=' + id,
    })
  },
})