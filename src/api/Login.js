import request from "../utils/request";

// 用户登陆
export const userLogin = (data) => {
  return request({
    method: "post",
    url: "/user/login",
    data,
  });
};
