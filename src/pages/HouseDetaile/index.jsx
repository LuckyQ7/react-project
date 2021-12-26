import React, { Component } from "react";
// 组件
import withRouter from "../../utils/hoc";
import NavHeader from "../../components/NavHeader/index";
import HouseList from "../../components/HouseList/index";
import Supporting from "../../components/HouseSupportings";
// 第三方组件库
import { Map } from "react-bmapgl";
import { Carousel, Toast } from "antd-mobile";
// API
import { baseURL } from "../../utils/base";
import {
  getHouseDetaile,
  getHouseIsStar,
  incrementFavorite,
  cancelFavorite,
} from "../../api/Search";
// CSS
import styles from "./index.module.css";
// IMAGE
import portrait from "../../assets/images/portrait.jpg";
// NavHeader右侧图标
const rightContent = <i className="iconfont icon-share" />;
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
// 获取百度地图实例
const BMapGL = window.BMapGL;
// 百度地图覆盖物样式
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
    isFavorite: false,
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    this.initHouseDetaile();
    this.initHouseStar();
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

  // 检测房屋是否被收藏
  initHouseStar = async () => {
    try {
      const { id } = this.props.params;
      const { data: res } = await getHouseIsStar(id);
      if (res.status === 400) {
        this.props.navigate("/login");
      } else {
        const { isFavorite } = res.body;
        this.setState({
          isFavorite,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // 收藏、取消收藏
  handleStar = async () => {
    try {
      const { id } = this.props.params;
      const { isFavorite } = this.state;
      if (isFavorite) {
        // 取消收藏
        const { data: res } = await cancelFavorite(id);
        if (res.status === 200) {
          Toast.info("取消收藏");
          this.initHouseStar();
        }
      } else {
        const { data: res } = await incrementFavorite(id);
        if (res.status === 200) {
          Toast.info("收藏成功");
          this.initHouseStar();
        }
      }
    } catch (error) {
      console.log(error);
    }
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
    console.log(supporting);
    return (
      <Supporting supporting={supporting} type={"houseDetaile"}></Supporting>
    );
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
    const { houseDetaile, coord, isFavorite } = this.state;
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
          {this.renderHouseSupports()}
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
          <div
            className={isFavorite ? styles.star : ""}
            onClick={this.handleStar}
          >
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
