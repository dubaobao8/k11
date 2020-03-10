import wx from './jweixin-1.2.0'


import {GetWXSdkConfig} from "@/api/wx/wxsdk";

export default async function () {
  let data = (await GetWXSdkConfig()).data.data;

  wx.config({
    beta: true,
    debug: false,
    appId: data.appid,
    timestamp: data.time, // 必填，生成签名的时间戳
    nonceStr: data.noncestr, // 必填，生成签名的随机串
    signature: data.signature,// 必填，签名，见 附录-JS-SDK使用权限签名算法
    jsApiList: ['scanQRCode', 'previewFile'] // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
  });

  wx.ready(function () {
    console.log('微信接口准备完毕');
  });
  wx.error(function (err) {
    console.log('微信接口调用失败');
    console.log(err)
  });

  return wx;
}

