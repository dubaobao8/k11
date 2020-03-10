import request from "../index.js"

/**
 * 获取 待我审批 未读数量
 * @param user_id
 */
export const getApprovalUnread = (user_id) => request.post('/api/report/RedRead', {user_id});

export default {
    getApprovalUnread
}