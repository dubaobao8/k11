import request from "../index";

/**
 * 删除文件
 * @param id {number} 要删除的附件id
 * @returns axios实例
 */
export const delFile = (id) =>{
    return request.post('/api/approval/Delete',{id})
};

