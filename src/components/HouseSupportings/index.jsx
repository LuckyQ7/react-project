import React, { useState } from "react";
// CSS
import styles from "./index.module.css";

const houseSupportings = [
  {
    id: 1,
    name: "衣柜",
    icon: "icon-wardrobe",
  },
  {
    id: 2,
    name: "洗衣机",
    icon: "icon-wash",
  },
  {
    id: 3,
    name: "空调",
    icon: "icon-air",
  },
  {
    id: 4,
    name: "天然气",
    icon: "icon-gas",
  },
  {
    id: 5,
    name: "冰箱",
    icon: "icon-ref",
  },
  {
    id: 6,
    name: "暖气",
    icon: "icon-Heat",
  },
  {
    id: 7,
    name: "电视",
    icon: "icon-vid",
  },
  {
    id: 8,
    name: "热水器",
    icon: "icon-heater",
  },
  {
    id: 9,
    name: "宽带",
    icon: "icon-broadband",
  },
  {
    id: 10,
    name: "沙发",
    icon: "icon-sofa",
  },
];

export default function Supporting({ supporting, type, upDateSupports }) {
  let renderData = [];
  if (type === "houseDetaile") {
    if (supporting.length > 0) {
      const supportingTemp = [];
      houseSupportings.forEach((item) => {
        if (supporting.includes(item.name)) {
          supportingTemp.push(item);
        }
      });
      renderData = supportingTemp;
    }
  } else {
    renderData = houseSupportings;
  }
  const [data, setData] = useState([]);
  function handleItem(name) {
    const temp = [...data];
    if (type !== "houseDetaile") {
      if (!temp.includes(name)) {
        temp.push(name);
      } else {
        const index = temp.indexOf(name);
        temp.splice(index, 1);
      }
      setData(temp);
      upDateSupports(temp);
    }
  }
  return (
    <div className={styles.supporting}>
      {renderData.length > 0
        ? renderData.map((item) => {
            return (
              <div
                className={[
                  styles.houseSupportingItem,
                  data.includes(item.name) ? styles.activeSupport : "",
                ].join(" ")}
                key={item.id}
                onClick={() => {
                  handleItem(item.name);
                }}
              >
                <i className={["iconfont", item.icon].join(" ")}></i>
                <span>{item.name}</span>
              </div>
            );
          })
        : "暂无"}
    </div>
  );
}
