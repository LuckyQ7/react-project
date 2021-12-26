import React, { Component } from "react";
import withRouter from "../../utils/hoc";
import { Button, Flex, Grid, WingBlank, Modal, Toast } from "antd-mobile";

// api
import { baseURL } from "../../utils/base";
import { isAuth, removeToken } from "../../utils/isAuth";
import { getUserInfo, userLogOut } from "../../api/Profile";
// css
import styles from "./index.module.css";

//image
import avatar from "../../assets/images/portrait.jpg";
import { replace } from "formik";

// 菜单数据
const menus = [
  { id: 1, name: "我的收藏", iconfont: "icon-coll", to: "/favorate" },
  { id: 2, name: "我的出租", iconfont: "icon-ind", to: "/renter" },
  { id: 3, name: "看房记录", iconfont: "icon-record" },
  {
    id: 4,
    name: "成为房主",
    iconfont: "icon-identity",
  },
  { id: 5, name: "个人资料", iconfont: "icon-myinfo" },
  { id: 6, name: "联系我们", iconfont: "icon-cust" },
];
const alert = Modal.alert;
class Profile extends Component {
  state = {
    isLogin: isAuth(),
    userInfo: {},
  };

  componentDidMount() {
    this.initUserInfo();
  }

  initUserInfo = async () => {
    try {
      if (!this.state.isLogin) {
        return;
      }
      const { data: res } = await getUserInfo();
      if (res.status === 200) {
        this.setState({
          userInfo: res.body,
        });
      } else {
        this.setState({
          isLogin: false,
          userInfo: null,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  logOut = () => {
    alert("提示", "确定退出?", [
      { text: "取消" },
      {
        text: "确定",
        onPress: async () => {
          try {
            await userLogOut();
            this.setState({
              isLogin: false,
            });
            removeToken();
            Toast.info("退出成功");
          } catch (error) {
            console.log(error);
          }
        },
      },
    ]);
  };

  renderGrid = (item) => {
    const { navigate } = this.props;
    return (
      <div
        className={styles.menuItem}
        onClick={() => {
          item.to ? navigate(item.to) : navigate(replace);
        }}
      >
        <i className={["iconfont", item.iconfont].join(" ")}></i>
        <span>{item.name}</span>
      </div>
    );
  };

  render() {
    const { isLogin } = this.state;
    const { navigate } = this.props;
    return (
      <div className={styles.profile}>
        <div className={styles.bg}>
          <img src={baseURL + "/img/profile/bg.png"} alt="" />

          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              <img src={avatar} alt="" />
            </div>

            {isLogin ? (
              <Flex
                direction="column"
                className={styles.userName}
                justify="around"
              >
                <span>龙凤</span>
                <Button
                  type="primary"
                  size="small"
                  className={styles.colorPink}
                  activeClassName={styles.activePink}
                  onClick={this.logOut}
                >
                  退出登陆
                </Button>

                <span className={styles.editUserInfo}>编辑个人资料</span>
              </Flex>
            ) : (
              <Flex
                direction="column"
                className={styles.userName}
                justify="around"
              >
                <span>美女</span>
                <Button
                  type="primary"
                  size="small"
                  className={styles.colorPink}
                  activeClassName={styles.activePink}
                  onClick={() => {
                    navigate("/login");
                  }}
                >
                  去登陆
                </Button>
              </Flex>
            )}
          </div>
        </div>
        <WingBlank>
          {/* 九宫格菜单 */}
          <Grid
            className={styles.profileGrid}
            data={menus}
            columnNum={3}
            hasLine={false}
            renderItem={(item) => this.renderGrid(item)}
          />
        </WingBlank>

        <div className={styles.footer}>
          <img src={baseURL + "/img/profile/join.png"} alt="" />
        </div>
      </div>
    );
  }
}

export default withRouter(Profile);
