import request from "@/api";

// 获取草稿箱内容
export const GetEngineerDraftContent = (port_id) => request.post('/api/project/DraftDetail', {port_id});

// 保存至草稿箱
export const SaveEngineerToDraft = (data) => request.post('/api/Project/ProDraft', data);

// 删除草稿箱
export const DeleteEngineerDraft = (port_id) => request.post('/api/project/DeleteDraft', {port_id});
