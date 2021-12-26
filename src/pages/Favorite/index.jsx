import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// component
import NavHeader from "../../components/NavHeader";
import HouseList from "../../components/HouseList";
// css
import styles from "./index.module.css";
// API
import { getFavoriteList } from "../../api/Favorite";

export default function Favorite() {
  const [houseList, setHouseList] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    initFavoriteList();
  }, []);

  async function initFavoriteList() {
    try {
      const { data: res } = await getFavoriteList();
      setHouseList(res.body);
      if (res.status === 400) {
        return navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <NavHeader navBar={styles.navHeader}>我的收藏</NavHeader>
      {houseList
        ? houseList.map((item, index) => {
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
