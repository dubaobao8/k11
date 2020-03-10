import request from "../index"

/**
 * @desc 获取单个列表项值
 * @param port_id
 * @returns axios实例
 */
export const getSinglePortItem = (port_id) => {
    return request.post('/api/report/OneReport', {port_id});
};
