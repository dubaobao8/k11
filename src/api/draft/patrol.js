import request from "../index.js";

// 判断草稿箱是否已满(事件报告)
export const contDraf = (event_id) => {
    return request.post("/api/Draft/FullPort", {
        user_id: localStorage.getItem('user_id'),
        event_id
    });
};

// （事件报告）保存草稿
export const DraftDraft = (data) => {
    return request.post("/api/Draft/PortSave", data)
};


// （事件报告） 替换草稿
export const replaceIncidentDraft = (data) => {
    return request.post("/api/Draft/UpdatePort", data)
};


// 获取(巡查报告)草稿列表
export const draftList = (user_id) => {
    return request.post("/api/PaDraft/UserList", {user_id: user_id});
};

// 获取草稿详情（巡查报告）
export const draftDetail = (event_id) => {
    return request.post("/api/PaDraft/PortDetail", {event_id: event_id})
};

// （巡查报告）保存草稿
export const savePatrolDraft = (data) => {
    return request.post("/api/PaDraft/PortSave", data)
};
// 上传文件
export const uploadDraft = (data) => {
    return request.post("/api/PaDraft/FileUpload", data)
};

// （巡查报告）删除草稿
export const delDraft = (id) => {
    return request.post("/api/PaDraft/Delete", {id: id})
};

// （巡查报告）替换草稿
export const replaceDraft = (data) => {
    return request.post("/api/PaDraft/UpdatePort", data)
};

// 验证（巡查报告）草稿箱是否已满
export const draftIsFull = (event_id) => {
    return request.post("/api/Padraft/FullPort", {
        user_id: localStorage.getItem('user_id'),
        event_id
    });
};


export default {
    draftList,
    draftDetail,
    DraftDraft,
    savePatrolDraft,
    uploadDraft,
    delDraft,
    contDraf,
    replaceDraft,
    draftIsFull
}