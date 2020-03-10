// 业务相关js

import {CopierInfo} from "@/api/initiate/purchase";
import request from "@/api";

// 获取用户列表，并处理格式
export const getUserList = async () => {
  var res = await CopierInfo();
  var data = res.data.data;
  var resdata;
  resdata = data.map(item => {
    return {
      text: item.department,
      value: item.id,
      children: item.user.map(emp => {
          return {
            text: emp.username,
            value: {
              avatar: emp.user_logo,
              user_id: emp.id,
              username: emp.username,
              department: emp.department
            }
          }
        }
      )
    }
  });
  return resdata
};

// 获取抄送群组
export const getUserGroup = async () => {
  const res = await request.post('/api/approval/TransGroup');
  const data = res.data.data;
  return data.map(item => {
    return {
      text: item.name,
      value: item
    }
  })
};
