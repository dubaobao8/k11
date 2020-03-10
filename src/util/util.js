//  localStorage 封装
export const setItem = (key, value) => {
  localStorage.setItem(key, value);
};
export const getItem = key => {
  return localStorage.getItem(key);
};
// 深拷贝
export const deepCopy = obj => {
  var objClone = Array.isArray(obj) ? [] : {};
  //进行深拷贝的不能为空，并且是对象或者是
  if (obj && typeof obj === "object") {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (obj[key] && typeof obj[key] === "object") {
          objClone[key] = deepCopy(obj[key]);
        } else {
          objClone[key] = obj[key];
        }
      }
    }
  }
  return objClone;
};

// 时间戳转成字符串
export const stampToString = function (date, s, time) {
  if (!date) {
    return null;
  }

  var dateNum = Number(date);

  if (isNaN(dateNum)) {
    return date
  }
  time = time || false;
  s = s || "/";
  dateNum = dateNum.toString().length === 10 ? dateNum * 1000 : dateNum;
  var d = new Date(dateNum);
  var month = d.getMonth() + 1;
  var day = d.getDate();

  month = month < 10 ? "0" + month : month;

  day = day < 10 ? "0" + day : day;

  if (time === false) {
    return d.getFullYear() + s + month + s + day;
  } else if (time === true) {
    var hour = d.getHours();
    if (hour < 10) {
      hour = "0" + hour;
    }
    var minutes = d.getMinutes();
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    var seconds = d.getSeconds();
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    var result =
      d.getFullYear() + s + month + s + day + "  " + hour + ":" + minutes;
    return result;
  }
};

// 随机字符串
export const noncestr = function () {
  return Math.random()
    .toString(36)
    .substr(2, 15);
};

// 时间戳转10位
export const transStamp = function (n) {
  if (n.toString().length > 10) {
    return Math.floor(n / 1000);
  } else {
    return n;
  }
};

// 获取URL查询
export const getUrlParam = name => {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = encodeURI(window.location.search)
    .substr(1)
    .match(reg);
  if (r != null) {
    return unescape(r[2]);
  }
  return null;
};
// 是否为PC
export const isPc = () => {
  var userAgentInfo = navigator.userAgent;
  var Agents = [
    "Android",
    "iPhone",
    "SymbianOS",
    "Windows Phone",
    "iPad",
    "iPod"
  ];
  var flag = true;
  for (var v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = false;
      break;
    }
  }
  return flag;
};

/**
 * @desc 动态访问嵌套属性
 * @param {Object} obj - 要访问的对象
 * @param {String} propString - 对象的属性，用"."分隔
 */
export const getProp = (obj, propString) => {
  if (!propString) {
    return obj;
  }
  var prop = obj;
  var props = propString.split('.');
  props.forEach(item => {
    prop = prop[item];
  });

  return prop
};

// 把对象转为查询字符串形式
export const transObjectToQueryString = (obj) => {
  if (typeof obj !== 'object') {
    return null
  }
  var string = "";
  for (var key in obj) {
    string = string + key + "=" + obj[key] + "&";
  }
  string = string.slice(0, -1);

  return string
};

// 获取元素在页面中的位置
export const getViewPositionInPage = (dom) => {
  if (!dom || ! (dom instanceof HTMLElement)) {
    return false
  }
  var left = 0;
  var top = 0;
  var curDom = dom;
  while (curDom.offsetParent) {
    left += curDom.offsetLeft;
    top += curDom.offsetTop;
    curDom = curDom.offsetParent
  }
  return {
    left,
    top
  }
};

// 数组扁平化
export const arrayFlatten = (arr) => {
  return arr.reduce((result, item) => {
    return result.concat(Array.isArray(item) ? arrayFlatten(item) : item)
  }, []);
};

export default {
  stampToString,
  noncestr,
  transStamp,
  getUrlParam,
  deepCopy,
  isPc
};
