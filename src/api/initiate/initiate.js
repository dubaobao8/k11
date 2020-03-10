import request from "../index";

/**
 * First 上传明细里的附件
 * @param formData 文件FormData
 * @returns {AxiosPromise<any>}
 */
export const uploadDetailFile = (formData) => {
    return request.post('/api/approval/DetailFile', formData)
};

/**
 * 发起事件报告
 * @param form 要上传的数据
 * @returns {AxiosPromise<any>}
 */
export const initiateIncidentReport = (form) => {
    return request.post('/api/Report/SendReport',form)
};

