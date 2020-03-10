import request from "@/api";

// 【事件报告】 提交跟进
export const incidentSendFollow = (formData) => {
    return request.post('/api/Approval/FollowAdd', formData);
};

export const patrolSendFollow = (formData) => {
    return request.post('/api/patrol/FollowAdd', formData);
};

// 提交已读
export const MarkRead = (port_id) => {
  return request.post('/api/Report/ReadReport',{port_id})
};
