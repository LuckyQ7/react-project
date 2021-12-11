/**
 *  存取当前城市
 */
import { getCityInfo } from "../api/Index";
export default function getCurrentCity() {
  // 判断本地有没有当前城市
  const currentCity = JSON.parse(localStorage.getItem("HKZF_CITY"));
  if (!currentCity) {
    return new Promise((reslove, reject) => {
      const BMapGL = window.BMapGL;
      const myCity = new BMapGL.LocalCity();
      myCity.get(async (result) => {
        try {
          const { data: res } = await getCityInfo(result.name);
          localStorage.setItem("HKZF_CITY", JSON.stringify(res.body));
          reslove(res.body);
        } catch (error) {
          reject(error);
        }
      });
    });
  }
  return Promise.resolve(currentCity);
}
