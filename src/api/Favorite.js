import request from "../utils/request";

/**
 * 获取收藏的房屋列表
 * @returns 
 */
export const getFavoriteList = () => {
    return request({
        method: 'GET',
        url: '/user/favorites'
    })
}