// pages/car/car.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carlistStatus:0,
    imglist: [],
    carList: [],
    select_all: false,//全选默认值
    bool: false, //单选默认值
    headStatus: 1,//头部显示 1有地址 2没地址 3 编辑商品,
    str: '请选择尺寸、画框颜色',
    sizeType: [],
    colorType: [],
    num: 1,
    chicunIndex: -1,
    chicunIndexTow: -1,
    maskFlag: true,
    page: 1,
    carlistdetails: null,
    attr: null,
    defaultAddress: '',
    str2: '',
    str1: '',
    TypeIndex: null,
    TyoeArrayid: [],
    carList_total: 0.00,
    changesattrid: '',
    maskFlagChunlian:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.gettypeGoodsHot();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      carList: [],
      TyoeArrayid: [],
      select_all: false,
      carList_total: 0.00
    })
    this.getcartList(); // 获取购物车列表
    this.findAddressByDefault(); // 获取用户默认地址
    wx.setStorageSync('orderChooseStatus', 0);//存储所选订单的类型
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      carList: [],
      TyoeArrayid: [],
      select_all: false,
      carList_total: 0.00
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
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
  gettypeGoodsHot: function () { //首页商品为你优选
    let _this = this;
    wx.request({
      url: app.globalData.ipPath + '/index.php/api/goods/cartGoodsHot',
      data: {
        type: 2
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },// 设置请求的 header
      success: function (res) {
        console.log(res);
        if (res.statusCode == 200) {
          let data = res.data.data;
          let dataNew = [];
          for (let i = 0; i < data.length; i++) {
            dataNew.push(data[i])
          }
          _this.setData({
            imglist: dataNew
          })
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
  AgoDetails:function(e){
    let item = e.currentTarget.dataset.item;
    let id = item.goods_id;
    let types = item.goods_type;
    if(types == 1){
      wx.navigateTo({
        url: '../Commodity_details/Commodity_details?id=' + id
      })
    } else if (types == 2){
      wx.navigateTo({
        url: '../SpringDetalis/SpringDetalis?id=' + id
      })
    }
    console.log(item)
   
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
        if (res.statusCode == 200) {
          let data = res.data.data;
          if (data !== null) {
            let str = data.province + data.city + data.district + data.address;
            _this.setData({
              defaultAddress: str,
              headStatus: 1
            })
          } else {
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
  getcartList: function () { // 购物车列表
    wx.showLoading({
      title: '加载中',
    })
    let _this = this;
    let userData = wx.getStorageSync('userData');
    wx.request({
      url: app.globalData.ipPath + '/index.php/api/Cart/cartList',
      data: {
        user_id: userData.userId,
        page: _this.data.page
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },// 设置请求的 header
      success: function (res) {
        console.log(res)
        if (res.statusCode == 200) {
          let data = res.data.data;
          if(data.length>0&&_this.data.page==1){
            for (let i = 0; i < data.length; i++) {
              let obj = {};
              obj.size = -1;
              obj.color = -1;
              obj.str = '请选择尺寸、画框颜色'
              obj.price = null
              _this.data.TyoeArrayid.push(obj)
              _this.data.carList.push(data[i])
              _this.data.carList_total += Number(data[i].goods_total);
            }
            for (let j = 0; j < _this.data.carList.length; j++) {
              _this.data.carList[j].checked = _this.data.bool;//给请求到的数据设置选中初始值
              if (Number(_this.data.carList[j].attrs_size) > Number(_this.data.carList[j].goods_size)) {
                _this.data.carList[j].minusStatusAdd = 'normal'
              } else {
                _this.data.carList[j].minusStatusAdd = 'disabled'
              }
              if (_this.data.carList[j].goods_size == '1') {
                _this.data.carList[j].minusStatus = 'disabled'
              }
            }
            _this.setData({
              carList: _this.data.carList,
              TyoeArrayid: _this.data.TyoeArrayid,
              carlistStatus:0
            })
          }else{
            for (let i = 0; i < data.length; i++) {
              let obj = {};
              obj.size = -1;
              obj.color = -1;
              obj.str = '请选择尺寸、画框颜色'
              obj.price = null
              _this.data.TyoeArrayid.push(obj)
              _this.data.carList.push(data[i])
              _this.data.carList_total += Number(data[i].goods_total);
            }
            for (let j = 0; j < _this.data.carList.length; j++) {
              _this.data.carList[j].checked = _this.data.bool;//给请求到的数据设置选中初始值
              if (Number(_this.data.carList[j].attrs_size) > Number(_this.data.carList[j].goods_size)) {
                _this.data.carList[j].minusStatusAdd = 'normal'
              } else {
                _this.data.carList[j].minusStatusAdd = 'disabled'
              }
              if (_this.data.carList[j].goods_size == '1') {
                _this.data.carList[j].minusStatus = 'disabled'
              }
            }
            _this.setData({
              carList: _this.data.carList,
              TyoeArrayid: _this.data.TyoeArrayid,
              carlistStatus:1
            })
          }
        } else {
          console.log("index.js wx.request CheckCallUser statusCode" + res.statusCode);
        }
      },
      fail: function () {
        
      },
      complete: function () {
        // complete
        wx.hideLoading();
      }
    })
  },
  goaddaddress: function () {
    wx.navigateTo({
      url: '../addressList/addressList'
    })
  },
  bindMinus: function (e) { // 减号
    let _this = this;
    let Stock = e.currentTarget.dataset.index; // 商品库存
    let num = e.currentTarget.dataset.size; // 商品当前数量
    let index = e.currentTarget.dataset.indexs; // 这个商品的下标
    let minusStatus = Number(num) == 1 ? 'disabled' : 'normal'; // 小于等于1 禁用减号
    //数量小于库存 启用减号
    let minusStatusAdd = Number(num) < Number(Stock) ? 'normal' : 'disabled';
    // 算出这个商品的总价
    let price = Number(num) * _this.data.carList[index].goods_price;
    // 给购物车列表赋值
    _this.data.carList[index].minusStatus = minusStatus;
    _this.data.carList[index].minusStatusAdd = minusStatusAdd;
    _this.data.carList[index].goods_size = num;
    _this.data.carList[index].goods_total = price.toFixed(2);
    let userId = wx.getStorageSync('userData').userId;//用户id
    let goods_id = _this.data.carList[index].goods_id;//商品id
    let goods_attr_id = _this.data.carList[index].goods_attr_id;//属性id
    let goods_price = _this.data.carList[index].goods_price;//单价
    let goods_size = _this.data.carList[index].goods_size;//赋值后的数量
    let goods_total = _this.data.carList[index].goods_total;//赋值后的总价
    if (Number(num) > 1) {
      this.changeCarList(userId, goods_id, goods_attr_id, -1, goods_price, -goods_price);
      num--;
    }
    this.data.carList[index].goods_size = num;
    this.data.carList[index].goods_total = Number(_this.data.carList[index].goods_size) * _this.data.carList[index].goods_price;
    this.setData({
      carList: _this.data.carList
    });
    var nums = 0;
    for (let i = 0; i < _this.data.carList.length; i++) {
      if (this.data.carList[i].checked == true) {
        nums += Number(_this.data.carList[i].goods_total);
      }
    }
    this.data.carList_total = nums
    if (this.data.carList[index].checked == true) {
      this.setData({
        carList_total: this.data.carList_total
      })
    }
  },
  bindPlus: function (e) { // 加号
    let _this = this;
    let Stock = e.currentTarget.dataset.index;
    let num = e.currentTarget.dataset.size;
    let index = e.currentTarget.dataset.indexs;
    if (Number(num) < Number(Stock)) {
      num++;
    }
    let minusStatus = Number(num) < 1 ? 'disabled' : 'normal';
    let minusStatusAdd = Number(num) >= Number(Stock) ? 'disabled' : 'normal';
    let price = Number(num) * _this.data.carList[index].goods_price;
    _this.data.carList[index].minusStatus = minusStatus;
    _this.data.carList[index].minusStatusAdd = minusStatusAdd;
    _this.data.carList[index].goods_size = num;
    _this.data.carList[index].goods_total = price.toFixed(2);
    let userId = wx.getStorageSync('userData').userId;
    let goods_id = _this.data.carList[index].goods_id;
    let goods_attr_id = _this.data.carList[index].goods_attr_id;
    let goods_size = _this.data.carList[index].goods_size;
    let goods_price = _this.data.carList[index].goods_price;
    let goods_total = _this.data.carList[index].goods_total;
    this.changeCarList(userId, goods_id, goods_attr_id, 1, goods_price, goods_price);
    this.setData({
      carList: _this.data.carList,
    });
    var nums = 0;
    for (let i = 0; i < _this.data.carList.length; i++) {
      if (this.data.carList[i].checked == true) {
        nums += Number(_this.data.carList[i].goods_total);
      }
    }
    this.data.carList_total = nums
    if (this.data.carList[index].checked == true) {
      this.setData({
        carList_total: _this.data.carList_total
      })
    }
  },
  checkboxChange: function (e) { //单选
    //选中的购物车数据的下标
    let index = parseInt(e.currentTarget.dataset.index);
    //选中的购物车数据的单选默认值
    let checked = this.data.carList[index].checked;
    //所有购物车数据
    let list = this.data.carList;
    //全选默认值
    this.data.select_all = true;
    //设置相反值
    list[index].checked = !checked;
    // 循环数组数据，判断----选中/未选中[selected]
    for (let i = list.length - 1; i >= 0; i--) {
      if (!list[i].checked) {
        this.data.select_all = false;
        break;
      }
    }
    this.setData({
      carList: list,
      select_all: this.data.select_all,
      // carList_total: this.data.carList_total
    })
    let num = 0;
    for (let j = 0; j < this.data.carList.length; j++) {
      if (this.data.carList[j].checked == true) {
        num += Number(this.data.carList[j].goods_total);
      }
    }
    this.setData({
      carList_total: num
    })
    console.log(num)
  },
  allclick: function (e) { //全选
    let select_all = this.data.select_all;
    let _this = this;
    // true  -----   false
    select_all = !select_all;
    // 获取商品数据
    let list = this.data.carList;
    // 循环遍历判断列表中的数据是否选中
    for (let i = 0; i < list.length; i++) {
      list[i].checked = select_all;
    }
    // 页面重新渲染
    console.log(list)
    var num = 0;
    if (select_all) {
      for (let i = 0; i < list.length; i++) {
        num += Number(list[i].goods_total)
      }
    } else {
      num = 0;
    }
    this.setData({
      select_all: select_all,
      carList: list,
      carList_total: num
    });
  },
  // 修改购物车
  changeCarList(user_id, goods_id, goods_attr_id, goods_size, goods_price, goods_total) {
    let _this = this;
    wx.request({
      url: app.globalData.ipPath + '/index.php/api/Cart/addCart',
      data: {
        user_id: user_id,
        goods_id: goods_id,
        goods_attr_id: goods_attr_id,
        goods_size: goods_size,
        goods_price: goods_price,
        goods_total: goods_total
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },// 设置请求的 header
      success: function (res) {
        console.log(res)
        if (res.statusCode == 200) {

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
  gobuy: function () { //去结算
    var arr = [];
    // console.log(this.data.carList)
    for (let i = 0; i < this.data.carList.length; i++) {
      if (this.data.carList[i].checked == true) {
        var obj = {};
        obj.goods_id = this.data.carList[i].goods_id;
        obj.goods_attr_id = this.data.carList[i].goods_attr_id;
        obj.goods_size = this.data.carList[i].goods_size;
        obj.cart_id = this.data.carList[i].id;
        arr.push(obj)
      }
    }
    if (arr.length > 0) {
      wx.navigateTo({
        url: '../confirm_order/confirm_order?list=' + JSON.stringify(arr)
      })
    } else {
      app.maskToast(this, 'http://wjdh.yccjb.com/infoIcon.png', '请选择要结算的商品', 1500);
    }
  },
  CarIstration: function () {//商品管理
    this.setData({
      headStatus: 3,
      carList_total: 0
    })
  },
  CarDetale: function () {//完成
    this.setData({
      headStatus: 1
    })
  },
  carListdetale: function () {
    let str = ''
    let userid = wx.getStorageSync('userData').userId;
    for (let i = 0; i < this.data.carList.length; i++) {
      if (this.data.carList[i].checked == true) {
        str += ',' + this.data.carList[i].id
      }
    }
    str = str.substr(1);
    let _this = this;
    wx.request({
      url: app.globalData.ipPath + '/index.php/api/Cart/delCart',
      data: {
        user_id: userid,
        id: str
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },// 设置请求的 header
      success: function (res) {
        console.log(res)
        if (res.statusCode == 200) {
          _this.setData({
            carList: [],
            TyoeArrayid: [],
            select_all: false
          })
          _this.getcartList(); // 获取购物车列表
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
  TypeClick: function (e) {
    let id = e.currentTarget.dataset.index;
    let attrid = e.currentTarget.dataset.attrid;
    let index = e.currentTarget.dataset.indexs;
    let size = e.currentTarget.dataset.size;
    this.setData({
      TypeIndex: index
    })
    let _this = this;
    wx.request({
      url: app.globalData.ipPath + '/index.php/api/goods/goodsStock',
      data: {
        gid: id,
        attrid: attrid
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },// 设置请求的 header
      success: function (res) {
        console.log(res)
        if (res.statusCode == 200) {
          let data = res.data.data;
          if (data.g_type == '2'){
            data.size = size;
            _this.data.TyoeArrayid[index].str = '已选择' +' '+ data.attr_name;
            let arr = [];
            for (let i = 0; i < data.attr.length; i++) {
              if (data.attr[i].id == data.attr_id){
                _this.data.TyoeArrayid[index].size = i
              }
              arr.push(data.attr[i].name)
            }
            _this.setData({
              carlistdetails: data,
              maskFlagChunlian: false,
              sizeType: arr,
              // colorType: tmp2,
              // attr: data.attr,
              TyoeArrayid: _this.data.TyoeArrayid,
            })
          } else {
            data.size = size;
            let arr = [];
            for (let i = 0; i < data.attr.length; i++) {
              arr.push(data.attr[i].name)
            }
            let sizeType = [];
            let colorType = [];
            for (let j = 0; j < arr.length; j++) {
              sizeType.push(arr[j].split("--")[0] + '（带画框有画芯）')
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
            for (let k = 0; k < tmp.length; k++) {
              if (tmp[k].split('（')[0] == data.attr_name.split('--')[0]) {
                _this.data.TyoeArrayid[index].size = k
              }
            }
            for (let o = 0; o < tmp2.length; o++) {
              console.log(data.attr_name.split('--')[1])
              if (tmp2[o] == data.attr_name.split('--')[1]) {
                _this.data.TyoeArrayid[index].color = o
              }
            }
            let str1 = data.attr_name.split('--')[0];
            let str2 = data.attr_name.split('--')[1];
            let str = '已选择' + str1 + '  ' + str2 + '  ' + size + '副'
            _this.data.TyoeArrayid[index].str = str
            _this.data.TyoeArrayid[index].price = _this.data.carList[index].goods_total
            console.log(str)
            _this.setData({
              carlistdetails: data,
              maskFlag: false,
              sizeType: tmp,
              colorType: tmp2,
              attr: data.attr,
              TyoeArrayid: _this.data.TyoeArrayid,
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
  hideFlag: function () { //弹层隐藏
    this.setData({
      maskFlag: true,
    })
  },
  hideFlagChunlian:function(){
    this.setData({
      maskFlagChunlian: true,
    })
  },
  tabclicks:function(e){
    let index = e.currentTarget.dataset.index;
    let item = e.currentTarget.dataset.item;
    let data = this.data.TyoeArrayid[this.data.TypeIndex];
    let attrname = this.data.carlistdetails.attr_name;
    let list = this.data.carlistdetails.attr
    data.size = index
    this.setData({
      TyoeArrayid: this.data.TyoeArrayid
    });
    let attrid = null
    for (let i = 0; i < list.length;i++){
      if(list[i].name == item){
        attrid = list[i].id
      }
    }
    console.log(attrid)
    this.setData({
      carlistdetails: this.data.carlistdetails,
      changesattrid: attrid
    });
    this.getgoodsStock(attrid)
    // console.log(item, this.data.carlistdetails)
  },
  tabclick: function (e) { //选择尺寸分类
    let index = e.currentTarget.dataset.index;
    let item = e.currentTarget.dataset.item.split('（')[0];
    let data = this.data.TyoeArrayid[this.data.TypeIndex];
    let attrname = this.data.carlistdetails.attr_name.split("--");
    data.size = index
    this.setData({
      TyoeArrayid: this.data.TyoeArrayid
    });
    for (let i = 0; i < attrname.length; i++) {
      attrname[0] = item
    }
    let newattrname = attrname[0] + '--' + attrname[1];
    this.data.carlistdetails.attr_name = newattrname;
    let attrid = null
    for (let j = 0; j < this.data.attr.length; j++) {
      if (newattrname == this.data.attr[j].name) {
        attrid = this.data.attr[j].id
      }
    }
    this.setData({
      carlistdetails: this.data.carlistdetails,
      changesattrid: attrid
    });
    this.getgoodsStock(attrid)
  },
  tabclickTwo: function (e) { // 选择画框分类
    let index = e.currentTarget.dataset.index;
    let data = this.data.TyoeArrayid[this.data.TypeIndex];
    let item = e.currentTarget.dataset.item;
    let attrname = this.data.carlistdetails.attr_name.split("--")
    data.color = index
    this.setData({
      TyoeArrayid: this.data.TyoeArrayid
    });
    for (let i = 0; i < attrname.length; i++) {
      attrname[1] = item
    }
    let newattrname = attrname[0] + '--' + attrname[1];
    this.data.carlistdetails.attr_name = newattrname;
    let attrid = null
    for (let j = 0; j < this.data.attr.length; j++) {
      if (newattrname == this.data.attr[j].name) {
        attrid = this.data.attr[j].id
      }
    }
    this.setData({
      carlistdetails: this.data.carlistdetails,
      changesattrid: attrid
    });
    this.getgoodsStock(attrid)
  },
  getgoodsStock: function (attrid) {
    let gid = this.data.carList[this.data.TypeIndex].goods_id
    let _this = this;
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
        console.log(res, 'res')
        if (res.statusCode == 200) {
          if (res.data.data.g_type == '2'){
            _this.data.carlistdetails.icon = res.data.data.icon;
            _this.data.carlistdetails.attr_price = res.data.data.attr_price;
            _this.data.carlistdetails.s_current = res.data.data.s_current;
            
            let str = '已选择' + res.data.data.attr_name + '  ' + _this.data.carlistdetails.size + '副'
            _this.data.TyoeArrayid[_this.data.TypeIndex].str = str;
            _this.setData({
              carlistdetails: _this.data.carlistdetails,
              TyoeArrayid: _this.data.TyoeArrayid
            })
          }else{
            _this.data.carlistdetails.icon = res.data.data.icon;
            _this.data.carlistdetails.attr_price = res.data.data.attr_price;
            let arr = res.data.data.attr_name.split("--");
            let str = '已选择' + arr[0] + '  ' + arr[1] + '  ' + _this.data.carlistdetails.size + '副'
            _this.data.TyoeArrayid[_this.data.TypeIndex].str = str;
            _this.data.carlistdetails.s_current = res.data.data.s_current;
            _this.setData({
              carlistdetails: _this.data.carlistdetails,
              TyoeArrayid: _this.data.TyoeArrayid
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
  // editCarts:function(){
  //   // let user_id = wx.getStorageSync('userData').userId;
  //   // let cart_id = this.data.carList[this.data.TypeIndex].id;
  //   // let goods_id = this.data.carList[this.data.TypeIndex].goods_id;
  //   // let goods_attr_id = this.data.changesattrid;
  //   // let goods_size = this.data.carList[this.data.TypeIndex].goods_size;
  //   // let goods_price = this.data.carlistdetails.attr_price;
  //   // let goods_total = Number(this.data.carlistdetails.attr_price) * Number(goods_size);
  //   // console.log(cart_id, goods_id, goods_attr_id,)
  // },
  editCart: function () {
    console.log()
    if (this.data.carlistdetails.s_current<=0){
      app.maskToast(this, 'http://wjdh.yccjb.com/infoIcon.png', '数量超出范围~', 1500)
    }else{
      let user_id = wx.getStorageSync('userData').userId;
      let cart_id = this.data.carList[this.data.TypeIndex].id;
      let goods_id = this.data.carList[this.data.TypeIndex].goods_id;
      let goods_attr_id = this.data.changesattrid;
      let goods_size = this.data.carList[this.data.TypeIndex].goods_size;
      let goods_price = this.data.carlistdetails.attr_price;
      let goods_total = Number(this.data.carlistdetails.attr_price) * Number(goods_size);
      let id = ''
      if (goods_attr_id == '') {
        id = this.data.carList[this.data.TypeIndex].goods_attr_id
      } else {
        id = goods_attr_id
      }
      let _this = this;
      wx.request({
        url: app.globalData.ipPath + '/index.php/api/Cart/editCart',
        data: {
          user_id: user_id,
          cart_id: cart_id,
          goods_id: goods_id,
          goods_attr_id: id,
          goods_size: goods_size,
          goods_price: goods_price,
          goods_total: goods_total
        },
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },// 设置请求的 header
        success: function (res) {
          console.log(res)
          if (res.statusCode == 200) {
            _this.setData({
              carList: [],
              TyoeArrayid: [],
              select_all: false,
              changesattrid: '',
              maskFlag: true,
              maskFlagChunlian: true,
              carList_total: 0.00
            })
            _this.getcartList(); // 获取购物车列表
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
    }
  },
  godetails:function(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/Commodity_details/Commodity_details?id=' + id
    })
  }
})