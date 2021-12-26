import request from "../utils/request";

// 获取搜索列表
export const getSearchList = params => {
    return request({
        method: 'GET',
        url: "/area/community",
        params
    })
}
// 获取发布房源的条件
export const getParams = () => {
    return request({
        url: '/houses/params',
        method: 'GET',
    })
}
// 房屋图片上传
export const uploadImage = data => {
    return request({
        url: '/houses/image',
        method: 'POST',
        data
    })
}
// 发布房源
export const renterAdd = data => {
    return request({
        url: '/user/houses',
        method: 'POST',
        data
    })
}
// 获取已经发布的房源列表
export const getRentList = () => {
    return request({
        method: 'get',
        url: "/user/houses"
    })
} 
