import React, { Component } from "react";

import withRouter from "../../utils/hoc";
import NavHeader from "../../components/NavHeader/index";
import HouseList from "../../components/HouseList/index";

import { Map } from "react-bmapgl";
import { Carousel } from "antd-mobile";

import { baseURL } from "../../utils/base";
import { getHouseDetaile } from "../../api/Search";

import styles from "./index.module.css";

import portrait from "../../assets/images/portrait.jpg";

const rightContent = <i className="iconfont icon-share" />;

// 所有房屋配置项
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

// 猜你喜欢
const recommendHouses = [
  {
    id: 1,
    src: "/img/message/1.png",
    desc: "72.32㎡/南 北/低楼层",
    title: "安贞西里 3室1厅",
    price: 4500,
    tags: ["随时看房"],
  },
  {
    id: 2,
    src: "/img/message/2.png",
    desc: "83㎡/南/高楼层",
    title: "天居园 2室1厅",
    price: 7200,
    tags: ["近地铁"],
  },
  {
    id: 3,
    src: "/img/message/3.png",
    desc: "52㎡/西南/低楼层",
    title: "角门甲4号院 1室1厅",
    price: 4300,
    tags: ["集中供暖"],
  },
];

const BMapGL = window.BMapGL;

const labelStyle = {
  cursor: "pointer",
  border: "0px solid rgb(255,0,0)",
  padding: "0px",
  whiteSpace: "nowarp",
  fontSize: "12px",
  color: "rgb(255,255,255)",
  textAlign: "center",
  backgroundColor: "rgba(23, 169, 117, 0.8)",
};

class HouseDetaile extends Component {
  state = {
    swipersIsLoaded: false,
    swipers: [],
    houseDetaile: {},
    coord: {},
    supporting: [],
  };

  componentDidMount() {
    this.initHouseDetaile();
  }

  // 获取房屋详情
  initHouseDetaile = async () => {
    try {
      const { id } = this.props.params;
      const { data: res } = await getHouseDetaile(id);
      const { houseImg, coord, community, supporting } = res.body;
      this.setState(
        {
          swipers: [...houseImg],
          swipersIsLoaded: true,
          houseDetaile: res.body,
          coord,
          community,
          supporting,
        },
        () => {
          this.initMapLabel();
        }
      );
    } catch (error) {}
  };

  // 渲染轮播图
  renderSwipers = () => {
    return this.state.swipers.map((item, index) => {
      return (
        <img
          key={index}
          src={baseURL + item}
          style={{ width: "100%", verticalAlign: "top", height: "212px" }}
        />
      );
    });
  };

  // 渲染房屋配套
  renderHouseSupports = () => {
    const { supporting } = this.state;

    if (supporting.length > 0) {
      const supportingTemp = [];
      houseSupportings.forEach((item) => {
        if (supporting.includes(item.name)) {
          supportingTemp.push(item);
        }
      });
      console.log(supportingTemp);
      return supportingTemp.map((item) => {
        return (
          <div className={styles.houseSupportingItem} key={item.id}>
            <i className={["iconfont", item.icon].join(" ")}></i>
            <span>{item.name}</span>
          </div>
        );
      });
    } else {
      return "暂无";
    }
  };

  // 渲染猜你喜欢房屋列表
  renderHouseList = () => {
    return recommendHouses.map((item) => {
      return (
        <HouseList
          key={item.id}
          houseImg={item.src}
          title={item.title}
          tags={item.tags}
          price={item.price}
          desc={item.desc}
          houseCode={item.houseCode}
        />
      );
    });
  };

  // 渲染地图覆盖物
  initMapLabel = () => {
    const { coord, community } = this.state;
    const content = `<div class=${styles.label}>${community}</div>`;
    const label = new BMapGL.Label(content, {
      position: { lng: coord.longitude, lat: coord.latitude },
      offset: new BMapGL.Size(0, -30),
    });
    this.map.addOverlay(label);
    label.setStyle(labelStyle);
  };

  render() {
    const { houseDetaile, coord } = this.state;
    console.log(houseDetaile);
    return (
      <div className={styles.content}>
        <NavHeader navBar={styles.navBar} rightContent={rightContent}>
          {houseDetaile.community ? houseDetaile.community : ""}
        </NavHeader>
        {/* 轮播图 */}
        <div className="swiper">
          {/* 要解决数据加载完成不自动播放问题 */}
          {this.state.swipersIsLoaded ? (
            <Carousel autoplay infinite>
              {this.renderSwipers()}
            </Carousel>
          ) : (
            ""
          )}
        </div>
        {/* 标题和Tags */}
        <div className={styles.titlePanle}>
          <div className={styles.title}>{houseDetaile.title}</div>
          <div className={styles.tags}>
            <span className={styles.tag1}>近地铁</span>
          </div>
          <div className="line"></div>
          <div className={styles.housePanle}>
            <div className={styles.housePanleItem}>
              <div className={styles.houseTitle}>{houseDetaile.price}/月</div>
              <div className={styles.houseText}>租金</div>
            </div>
            <div className={styles.housePanleItem}>
              <div className={styles.houseTitle}>{houseDetaile.roomType}</div>
              <div className={styles.houseText}>房型</div>
            </div>
            <div className={styles.housePanleItem}>
              <div className={styles.houseTitle}>{houseDetaile.size}平米</div>
              <div className={styles.houseText}>面积</div>
            </div>
          </div>
          <div className="line"></div>

          <div className={styles.roomType}>
            <div className={styles.roomTypeRow}>
              <div>
                <span>装修：</span>
                <span>精装</span>
              </div>
              <div>
                <span>朝向：</span>
                <span>
                  {houseDetaile.oriented
                    ? houseDetaile.oriented.join("、")
                    : ""}
                </span>
              </div>
            </div>
            <div className={styles.roomTypeRow}>
              <div>
                <span>楼层：</span>
                <span>{houseDetaile.floor}</span>
              </div>
              <div>
                <span>类型：</span>
                <span>普通住宅</span>
              </div>
            </div>
          </div>
        </div>
        {/* 地图位置 */}
        <div className={styles.houseMap}>
          <h1>小区：{houseDetaile.community}</h1>
          <div className={styles.map} id="map">
            <Map
              ref={(ref) => (ref ? (this.map = ref.map) : "")}
              style={{ height: "100%" }}
              center={{
                lng: coord.longitude,
                lat: coord.latitude,
              }}
              zoom={14}
              enableScrollWheelZoom
              enableDoubleClickZoom={false}
            ></Map>
          </div>
        </div>
        {/* 房屋配套 */}
        <div className={styles.houseSupporting}>
          <h1>房屋配套</h1>
          <div className="line"></div>
          <div>{this.renderHouseSupports()}</div>
        </div>
        {/* 房源概况 */}
        <div className={styles.houseGeneral}>
          <h1>房源概况</h1>
          <div className="line"></div>
          <div>
            <div className={styles.portrait}>
              <img src={portrait} alt="" />
            </div>
            <div>
              <span>龙凤</span>
              <span>
                <i className="iconfont icon-auth"></i> 已认证美女
              </span>
            </div>
            <div>
              <span>发消息</span>
            </div>
          </div>
          <p>{houseDetaile.description}</p>
        </div>

        {/* 猜你喜欢 */}
        <div className={styles.youLike}>
          <h1>猜你喜欢</h1>
          <div className="line"></div>
          {/*  */}
          {this.renderHouseList()}
          <div className="line"></div>
        </div>

        {/* 底部按钮 */}
        <div className={styles.footerButton}>
          <div>
            <i className="iconfont icon-coll"></i>
            收藏
          </div>
          <div>在线咨询</div>
          <div>电话预约</div>
        </div>
      </div>
    );
  }
}

export default withRouter(HouseDetaile);
