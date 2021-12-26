import request from "../utils/request";
import { getToken } from "../utils/isAuth";

/** 获取用户信息
 * @param {string} headers
 * @returns {Object}
 */
export const getUserInfo = () =>
  request({
    method: "get",
    url: "/user",
    headers: {
      authorization: getToken(),
    },
  });

export const userLogOut = () =>
  request({
    method: "POST",
    url: "/user/logout",
    headers: {
      authorization: getToken(),
    },
  });
