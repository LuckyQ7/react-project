import request from "../utils/request";

// 获取筛选条件
export const getFilterData = (value) => {
  return request({
    method: "Get",
    url: `/houses/condition?id=${value}`,
  });
};

// 获取房屋列表
export const getHouseList = (params) => {
  return request({
    method: "Get",
    url: `/houses`,
    params,
  });
};

/**
 * 获取房屋具体信息
 */
export const getHouseDetaile = (id) => {
  return request({
    method: "Get",
    url: `/houses/${id}`,
  });
};
/**
 * 获取房屋是否被收藏
 */
export const getHouseIsStar = (id) => {
  return request({
    method: "Get",
    url: `/user/favorites/${id}`,
  });
};
/**
 * 取消收藏房屋
 */
export const cancelFavorite = (id) => {
  return request({
    method: "DELETE",
    url: `/user/favorites/${id}`,
  });
};

/**
 * 收藏房屋
 */
export const incrementFavorite = (id) => {
  return request({
    method: "POST",
    url: `/user/favorites/${id}`,
  });
};
