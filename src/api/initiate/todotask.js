import request from "@/api";

// 获取识别部门手机号
export const GetUserPhoneAndDep = (user_id) => request.post('/api/Task/SearchInfo',{user_id});

// 发布To do Task报告
export const SendToDoTask = (data) => request.post('/api/Task/SendTask',data);
