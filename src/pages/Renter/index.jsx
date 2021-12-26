import React, { useState, useEffect } from "react";
import { Routes, Route, Outlet, useLocation } from "react-router-dom";
// 组件
import SearchList from "./components/SearchList";
import RentAdd from "./components/RentAdd";
import HouseList from "../../components/HouseList";
import NavHeader from "../../components/NavHeader";
// API
import { getRentList } from "../../api/Rent";
// CSS
import styles from "./index.module.css";
// NavHeader右侧图标
const rightContent = <i className="iconfont icon-add"></i>;
export default function Renter() {
  const [dataList, setDataList] = useState([]);
  const loaction = useLocation();
  // console.log(loaction.pathname);
  useEffect(() => {
    initRentList();
  }, []);
  // 获取已经发布的房源列表
  async function initRentList() {
    try {
      const { data: res } = await getRentList();
      if (res.status === 200) {
        setDataList(res.body);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // 渲染房屋列表
  function renderHouseList() {
    return (
      <div>
        {dataList
          ? dataList.map((item, index) => {
              return (
                <HouseList
                  key={index}
                  price={item.price}
                  tags={item.tags}
                  desc={item.desc}
                  houseImg={item.houseImg}
                  houseCode={item.houseCode}
                  title={item.title}
                ></HouseList>
              );
            })
          : ""}
      </div>
    );
  }

  return (
    <div>
      {loaction.pathname === "/renter" ? (
        <>
          {" "}
          <NavHeader
            navBar={styles.navBar}
            rightContent={rightContent}
            type={"rentAdd"}
          >
            我的房源
          </NavHeader>
          <div>{renderHouseList()}</div>
        </>
      ) : (
        ""
      )}
      <Routes>
        <Route path="/searchList" element={<SearchList />}></Route>
        <Route path="/add" element={<RentAdd />}></Route>
      </Routes>
      {/* 匹配到的子组件的出口 */}
      <Outlet />
    </div>
  );
}

// return useRoutes([
//   { path: "/", element: <Home /> },
// ]);
