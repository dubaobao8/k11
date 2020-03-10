// 添加到Vue原型的一些方法

import Vue from "vue"
import {Dialog, CascadePicker, Toast} from "cube-ui";

import {getUserList} from "@/util/business";

Vue.use(Dialog);
Vue.use(CascadePicker);
Vue.use(Toast);

export default {
  // 确认框
  async confirm(title, content, cancel = false) {
    return await new Promise((resolve, reject) => {
      Dialog.$create({
        type: 'confirm',
        icon: 'cubeic-warn',
        title: title,
        content: content,
        showClose: true,
        onConfirm(event) {
          resolve(event);
        },
        onCancel(event) {
          if (cancel) {
            reject(event);
          }
        }
      }).show()
    })
  },

  // 提示框
  async alert(title, content, type = true) {
    var icon = type ? 'cubeic-ok' : 'cubeic-close';
    return await new Promise((resolve, reject) => {
      Dialog.$create({
        type: 'alert',
        icon: icon,
        title: title,
        content: content,
        showClose: false,
        onConfirm(event) {
          resolve(event);
        }
      }).show()
    })
  },

  // 确认->输入框
  async prompt(title, content, placeholder = "请输入", cancel = false, config = {}) {
    return await new Promise((resolve, reject) => {
      Dialog.$create({
        type: 'prompt',
        icon: 'cubeic-info',
        title: title,
        content: content,
        showClose: true,
        prompt: {
          placeholder,
          ...config
        },
        onConfirm(event, res) {
          resolve(res);
        },
        onCancel(event) {
          if (cancel) {
            reject(event);
          }
        }
      }).show()
    })
  },

  // 选择用户
  async selectUser(title = "请选择用户") {
    let loading = Toast.$create({
      type: "loading",
      txt: "请稍等..."
    }).show();

    let userlist = await getUserList();
    loading.hide();
    return await new Promise((resolve, reject) => {
      CascadePicker.$create({
        title: title,
        data: userlist,
        onSelect(value, index, text) {
          resolve({value, index, text})
        }
      }).show();
    });
  },

  // 生成UID
  generateUid() {
    return Math.random().toString(26).slice(2) + Date.now()
  },

  // 获取今日日期
  getCurDate(separator = "-") {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    return [year, month, day].map(this.fillZero).join(separator);
  },

  // 补0
  fillZero(value) {
    if (value < 10) {
      return "0" + value;
    } else {
      return String(value)
    }
  }
}
