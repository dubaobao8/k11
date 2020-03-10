import request from "../index.js"

// 按状态搜索 “我申请的”
export const searchMyList = (data) => {
    return request.post("/api/report/SearchMyList",data)
};

// 按状态搜索 “待我审批”
export const searchMyOpinion = (data) => {
    return request.post("/api/report/SearchMyOpinion",data)
};
// 按状态搜索 “已审批”
export const searchMyAlopinion = (data) => {
    return request.post("/api/report/SearchMyAlopinion",data)
};
// 按状态搜索 “抄送我的”
export const searchMyLook = (data) => {
    return request.post("/api/report/SearchMyLook",data)
};

// 获取筛选列表
export const GetSearchFilter = () =>{
  return request.post('/api/project/ReportFilter')
};


export default {
    searchMyList,
    searchMyOpinion,
    searchMyAlopinion,
    searchMyLook
}
