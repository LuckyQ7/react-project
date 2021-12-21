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
