import request from "@/api";

export const getDepartemnt = () => request.get("api/listForm/department");
export const BudGet = data => request.post("api/form/budget", data);
export const ApplicationDepartment = data => request.post("/api/form/applicationDepartment", data);
export const ModifyForm = data => request.post("/api/form/modifyForm", data);
export const PortInfo = data => request.post("api/listForm/portInfo", data);
export const UploadFile = file => request.post("/api/form/upload", file);
export const DeleteFile = data => request.post("api/form/deleteEnclosure", data);
export const CopierInfo = () => request.post("api/report/LookUser");
export const GroupInfo = () => request.get("api/listForm/groupInfo");
export const Purchase = data => request.post("api/form/purchase", data);

//终止报告
export const stopForm = data => request.post("api/process/stopForm", data);
//付款单终止报告
export const stopPayment = data => request.post("api/process/stopPayment", data);
//获取审批人列表
export const Approval = (data) => request.post("api/listForm/approval", data);

//保存草稿箱
export const Drafts = data => request.post("api/form/drafts", data);


//===详情==
export const ListDetail = data => request.post("api/listForm/listDetail", data);

//流程
//============采购==========
//同意
export const DepartmentAgree = data => request.post("api/process/departmentAgree", data);
//部门主管转审
export const DepartmentTransfer = data => request.post("api/process/departmentTransfer", data);

//转审人回转
export const TransferDepartment = data => request.post("api/process/transferDepartment", data);


//驳回
export const RejectForm = data => request.post("api/process/rejectForm", data);


//===============付款单=========
export const Payment = data => request.post("api/form/payment", data);
//同意
export const PaymentAgree = data => request.post("api/process/paymentAgree", data);
//驳回
export const PaymentReject = data => request.post("api/process/paymentReject", data);

// 删除采购/报销单草稿
export const DeletePurchaseDraft = (purchase_id) => request.post('/api/form/deleteDrafts', {purchase_id});


// 发起人撤销采购单
export const UndoPurchase = (port_id) => request.post('/api/process/Cancel',{port_id});

// 部门主管同意撤销
export const UndoPurchaseAgree = (port_id) => request.post('/api/process/CancelAgree',{port_id});

// 部门主管拒绝撤销
export const UndoPurchaseReject = (port_id,content) => request.post('/api/process/CancelDisAgree',{port_id,content});

// 获取跨财年采购选项
export const GetPriceYear = () => request.get("/api/Form/PriceYear");
