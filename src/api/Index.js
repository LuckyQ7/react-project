import request from "../utils/request";

// 获取轮播图数据
export const getSwiper = () => {
  return request({
    method: "Get",
    url: "/home/swiper",
  });
};

// 获取租房小组数据
export const getGroups = (area) => {
  return request({
    method: "get",
    url: `/home/groups/?area=${area}`,
  });
};

// 获取最新资讯
export const getNews = (area) => {
  return request({
    method: "get",
    url: `/home/news/?area=${area}`,
  });
};

// 根据城市名称查询该城市信息
export const getCityInfo = (name) => {
  return request({
    method: "get",
    url: `/area/info?name=${name}`,
  });
};
