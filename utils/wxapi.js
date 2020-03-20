// 判断用户是否登录
function isLogin() {
  // 判断用户是否授权登录的两个条件：
  //  1.storage中是否存储了userInfo;
  //  2.getSetting中scope.userInfo是否为真

  // 业务需求：如果用户来源为扫描二维码，强制获取用户授权、手机号，scene==1011
  var scene = wx.getStorageSync("scene") || 1001;
  if (scene != 1011) { // 非扫描二维码进入
    //第一步：判断用户是否授权userInfo
    wx.getSetting({
      success(res) {
        console.log(res)
        var authSetting = res.authSetting;
        if (authSetting && authSetting["scope.userInfo"]) {
          // 用户已授权登录小程序，判断storage中的存储信息userInfo是否丢失
          console.log("用户已授权登录")
          var userInfo = wx.getStorageSync("userInfo");
          if (userInfo) {
            // 信息保存完整，用户可进行常规操作
            console.log("用户授权一切正常，可进行常规操作")
          } else {
            // 信息未保存，需要重新获取授权
            console.log("用户已授权，但是信息存储错误");
            linkTo();
          }
        } else {
          // 用户未授权登录小程序，不可以进行接下来的操作
          console.log("用户未授权登录");
          linkTo();
        }
      }
    })
  } else { // 扫描二维码进入,强制授权
    //第一步：判断用户是否授权userInfo
    wx.getSetting({
      success(res) {
        console.log(res)
        var authSetting = res.authSetting;
        if (authSetting && authSetting["scope.userInfo"]) {
          // 用户已授权登录小程序，判断storage中的存储信息userInfo是否丢失
          console.log("用户已授权登录")
          var userInfo = wx.getStorageSync("userInfo") || undefined;
          if (userInfo) {
            // 信息保存完整，用户可进行常规操作
            console.log("用户授权一切正常，可进行常规操作")
          } else {
            // 信息未保存，需要重新获取授权
            console.log("用户已授权，但是信息存储错误");
            linkTo({
              "type": "reLaunch"
            });
          }
        } else {
          // 用户未授权登录小程序，不可以进行接下来的操作
          console.log("用户未授权登录");
          linkTo({
            "type": "reLaunch"
          });
        }
      }
    })
  }
}

function login() {
  wx.login({
    success(res) {
      var code = res.code;
      if (code) {

      } else {
        console.log("获取code失败")
      }
    }
  })
}

function linkTo(obj = {}) { // 在分包加载函数中使用此参数，需要修改url
  console.log(obj)
  // 参数说明
  // obj = {   
  //   "type":"navigateTo",   // 跳转类型，默认为 navigateTo
  //   "target":"home",      // 跳转目标，即跳转页面, 默认为 home
  //   "arg":{                // 附带参数，对象，默认为{}
  //   }
  // }
  //参数处理
  var objTarget = {};

  if (obj.target) { // 跳转页面处理
    objTarget.target = obj.target
  } else {
    objTarget.target = "home"
  }

  if (obj.arg) { // 附带参数处理
    objTarget.arg = obj.arg;
    var argStr = "?";
    for (var key in obj.arg) {
      argStr += key + "=" + obj.arg[key] + "&&"
    }
    argStr = argStr.slice(0, argStr.length - 2)
    objTarget.arg = argStr;
  } else {
    objTarget.arg = "";
  }

  if (obj.type) { // 跳转类型处理
    objTarget.type = obj.type
  } else {
    objTarget.type = "navigateTo"
  }
  console.log("objTarget:", objTarget)
  // 开始进行跳转
  var url = "/pages/" + objTarget.target + "/" + objTarget.target + objTarget.arg;
  console.log(url)
  switch (objTarget.type) {
    case "navigateTo": // 保留当前页面，跳转至非tabbar页面
      wx.navigateTo({
        url: url,
      })
      break;
    case "redirectTo": // 关闭当前页面，跳转至非tabbar页面
      wx.redirectTo({
        url: url,
      })
      break;
    case "reLaunch": // 关闭所有页面，跳转至指定页面（tabbar不能携带参数）
      wx.reLaunch({
        url: url,
      })
      break;
    case "switchTab": // 关闭非tabbar页面，跳转至tabbar页面(不可携带参数)
      wx.switchTab({
        url: url,
      })
      break;
    default:
      console.log("错误，在wxapi.js中检查linkTo函数调用是否正确")
      break;
  }
}


module.exports = {
  isLogin: isLogin,
  login: login,
  linkTo: linkTo,
}