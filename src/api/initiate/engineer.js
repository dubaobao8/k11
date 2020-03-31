import request from "@/api";

// 获取工程单的位置
export const GetEngineerPlace = () => request.get('/api/project/ProPlace');
// 获取工作类型
export const GetEngineerWorkType = () => request.get('/api/project/ProType');
// 搜索已完成的工程单
export const SearchEngineerReport = (content) => request.post('/api/project/SearchAl', content);
// 发布工程单
export const SendEngineerReport = data => request.post('/api/Project/SendProject',data);
// 选择详细位置
export const ChooseExtraPlace = (place) =>request.post('/api/project/ChooseNum',{place});
// 根据编号获取地址
export const GetEngineerPlaceByCode = (number) => request.post('/api/project/NumSearch',{number});
// 获取楼层位置
export const GetFloorSite = (place) => request.post('/api/project/Site',{place});
// 获取位置
export const GetChooseArea = () => request.get("/api/project/ChooseArea");
