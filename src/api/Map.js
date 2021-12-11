import request from "../utils/request";

// 获取城市房源数据
export const getMapHouseSource = (data) => {
  return request({
    method: "Get",
    url: `/area/map?id=${data}`,
  });
};

// 获取小区房源数据
export const getHomeHouseSource = (cityId) => {
  return request({
    method: "Get",
    url: `/houses?id=${cityId}`,
  });
};
