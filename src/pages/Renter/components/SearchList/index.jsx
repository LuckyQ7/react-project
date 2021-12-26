import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// 第三方组件库
import { SearchBar, WingBlank } from "antd-mobile";
// API
import { getSearchList } from "../../../../api/Rent";
import getCurrentCity from "../../../../utils";
// CSS
import styles from "./index.module.css";
export default function SearchList() {
  const [list, setList] = useState([]);
  const history = useNavigate();
  let timer = null;
  async function handleChange(val) {
    if (!val) return setList([]);
    const res = await getCurrentCity();
    clearTimeout(timer);
    timer = setTimeout(async () => {
      try {
        const params = {
          name: val,
          id: res.value,
        };
        const { data } = await getSearchList(params);
        setList(data.body);
      } catch (error) {
        console.log(error);
      }
    }, 500);
  }

  function renderList() {
    return list.map((item) => {
      return (
        <WingBlank key={item.community}>
          <li
            onClick={() => {
              history("/renter/add", {
                state: { value: item.community, name: item.communityName },
              });
            }}
          >
            {item.communityName}
          </li>
        </WingBlank>
      );
    });
  }

  return (
    <div>
      <SearchBar
        placeholder="请输入小区或者地址"
        showCancelButton
        onChange={handleChange}
        onCancel={() => {
          history("/renter/add");
        }}
      />

      {/* 根据搜素展示结果 */}
      <ul className={styles.list}>{renderList()}</ul>
    </div>
  );
}
