import request from "../utils/request";

// 获取城市列表
export const getCitys = (level) => {
  return request({
    method: "get",
    url: `/area/city/?level=${level}`,
  });
};

// 获取热门城市
export const getHotCitys = () => {
  return request({
    method: "get",
    url: `/area/hot`,
  });
};
