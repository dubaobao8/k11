import request from "@/api";

// 报告Task详情页
export const GetTaskDetail = (port_id) => request.post('/api/Task/TaskDetail', {port_id});

// 关联单据搜索
export const SearchReport = (work_num) => request.post('/api/task/SearchReport', {work_num});

// 同事跟进
export const SendUserFollow = (data) => request.post('/api/Task/UserFollow', data);

// 同事跟进完成
export const SendUserFollowFinish = (port_id) => request.post("/api/Task/UserFollowFinish", {port_id});

// 收件人接受任务
export const RecipientPostReceive = (port_id) => request.post('/api/Task/Receive', {port_id});

// 收件人拒绝任务
export const RecipientPostRefuse = (port_id,content) => request.post('/api/Task/UserRefuse', {port_id,content});

// 发起人审批跟进--同意
export const StartUserAgree = (port_id) => request.post('/api/Task/StartUserAgree', {port_id});

// 发起人审批跟进--拒绝
export const StartUserRefuse = (port_id,content) => request.post('/api/Task/StartUserRefuse', {port_id,content});

// 上级接受任务，由原收件人跟进
export const LeadUserAgree = (port_id) => request.post('/api/Task/LeadUserAgree', {port_id});

// 上级接受任务，重新指派
export const LeadUserAssign = (port_id, accept_user) => request.post('/api/Task/UserAssign', {port_id, accept_user});

// 上级拒绝
export const LeadUserRefuse = (port_id,content) => request.post('/api/Task/LeadUserRefuse',{port_id,content});

// 获取本部门的员工
export const GetMyDepartmentStaff = () => request.post('/api/Task/SearchDepartment');

// 发起人上级同意 -- 认为单据合理
export const StartLeadUserAgree = (port_id) => request.post('/api/Task/StartLeadUserAgree',{port_id});

// 发起人上级拒绝 -- 认为单据不合理
export const StartLeadUserRefuse = (port_id,content) => request.post('/api/Task/StartLeadUserRefuse',{port_id,content});

// 终审人同意  -- 认为单据合理
export const BossAgree = (port_id) => request.post('/api/Task/BossAgree',{port_id});

// 终审人上级拒绝 -- 认为单据不合理
export const BossRefuse = (port_id,content) => request.post('/api/Task/BossRefuse',{port_id,content});
