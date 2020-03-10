import request from "@/api";

// 获取工程单详情页
export const GetEngineerDetail = port_id => request.post('/api/project/ProDetail', {
  user_id: localStorage.getItem("user_id"),
  port_id: port_id
});

// 提交维修记录
export const SendEngineerMaintainRecord = data => request.post('/api/Project/UserFollow', data);

// 维修完成
export const CompletedMaintain = (port_id) => request.post('/api/project/UserFinish', {port_id});

// 工程小组接受任务[1,2,3,4]
export const EngineerGroupAccept = (port_id, group_type) => request.post('/api/project/UserOperate', {
  port_id,
  group_type
});

// 拒绝任务 [管理员操作]
export const RejectEngineer = (port_id, content) => request.post('/api/project/Refuse', {port_id, content});

// 获取班组列表
export const GetEngineerGroup = () => request.get('/api/project/Group');

// 维修员选择列表
export const GetRepairmenList = () => request.post('/api/project/WorkerList');

// 指派维修员
export const AssignRepairmen = (worker_id, port_id, type) => request.post("/api/project/UserChoose", {worker_id, port_id, type});

// 领班同意维修通过
export const ApprovalAgreeMaintain = (port_id,follow_id) => request.post('/api/project/Adopt', {port_id,follow_id});

// 领班拒绝维修通过
export const ApprovalRejectMantain = (port_id, content, follow_id) => request.post('/api/project/Fail', {
  port_id,
  content,
  follow_id
});

// 维修中添加备注
export const EngineerAddNote = (port_id,notes) => request.post('/api/project/WorkForm',{port_id,notes});

// 获取指派类型
export const GetProTypeList = () => request.post('/api/Project/ProTypeList');

// 领班驳回工程单，回到待审批
export const ApprovalLeadRefuse = (port_id,content) => request.post('/api/project/LeadRefuse',{port_id,content});
