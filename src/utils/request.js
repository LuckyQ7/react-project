import { Toast } from "antd-mobile";
import axios from "axios";
import { baseURL } from "./base";
import { getToken, removeToken } from "./isAuth";

const request = axios.create({
  baseURL,
});

request.interceptors.request.use((config) => {
  const { url } = config;
  if (
    url.startsWith("/user") &&
    url !== "/user/login" &&
    url !== "/user/registered"
  ) {
    config.headers.authorization = getToken();
  }
  return config;
});

request.interceptors.response.use((res) => {
  const { data } = res;
  if (data.status === 400) {
    Toast.info("登录过期，请重新登录");
    removeToken();
  }
  return res;
});

export default request;
