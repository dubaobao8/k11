import axios from "axios";
import store from "../store";
import {Notify} from "vant";

var request = axios.create({
  baseURL: store.state.domain,
  timeout: 60000,
  headers: {}
});
// 请求拦截器
request.interceptors.request.use(config => {
  if (!config.headers.token) {
    config.headers.token = localStorage.getItem("token")
  }
  return config
});
// 响应拦截器
request.interceptors.response.use(response => response, error => {
  if (error.response.status === 403) {
    Notify({
      message: '登录信息已过期，请退出重新登录！',
      duration: 5000
    });
  } else {
    Notify('网络连接失败！');
  }

  return Promise.reject(error)
});
export default request;
