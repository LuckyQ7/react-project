import React, { Component, lazy, Suspense } from "react";
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
  Outlet,
} from "react-router-dom";
import { TabBar, Modal, Toast } from "antd-mobile";

// const News = lazy(() => import("../News"));
const Profile = lazy(() => import("../Profile"));
const Index = lazy(() => import("../Index"));
const Search = lazy(() => import("../Search"));

function withRouter(Component) {
  return (props) => (
    <Component
      {...props}
      params={useParams()}
      location={useLocation()}
      navigate={useNavigate()}
    />
  );
}
const tabBarItems = [
  {
    title: "首页",
    icon: "icon-ind",
    path: "/home",
  },
  {
    title: "找房",
    icon: "icon-findHouse",
    path: "/home/search",
  },
  // {
  //   title: "新闻",
  //   icon: "icon-mess",
  //   path: "/home/news",
  // },
  {
    title: "我的",
    icon: "icon-my",
    path: "/home/profile",
  },
];

const alert = Modal.alert;

class Home extends Component {
  state = {
    selectedTab: this.props.location.pathname,
  };
  componentDidMount() {
    if (
      navigator.userAgent.match(/Android/i) ||
      navigator.userAgent.match(/webOS/i) ||
      navigator.userAgent.match(/iPhone/i) ||
      navigator.userAgent.match(/iPad/i) ||
      navigator.userAgent.match(/iPod/i) ||
      navigator.userAgent.match(/BlackBerry/i) ||
      navigator.userAgent.match(/Windows Phone/i)
    ) {
      alert("baby", "龙凤最好最漂亮最温柔最体贴最美丽最善解人意对不对？", [
        { text: "对", onPress: () => Toast.info("我也觉得") },
        { text: "对", onPress: () => Toast.info("我也觉得") },
      ]);
    } else {
      Toast.info("请用移动设备打开此页面", 1, () => {
        window.close();
      });
    }
  }
  // 更新的生命周期钩子
  componentDidUpdate(prevProps) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.setState({
        selectedTab: this.props.location.pathname,
      });
    }
  }
  renderTabBarItems() {
    return tabBarItems.map((item) => {
      return (
        <TabBar.Item
          title={item.title}
          key={item.title}
          icon={<i className={`iconfont ${item.icon}`}></i>}
          selectedIcon={<i className={`iconfont ${item.icon}`}></i>}
          selected={this.state.selectedTab === item.path}
          onPress={() => {
            this.setState({
              selectedTab: item.path,
            });
            this.props.navigate(item.path);
          }}
        ></TabBar.Item>
      );
    });
  }
  render() {
    return (
      <div>
        <Suspense fallback={<div className="router-loading" />}>
          <Routes>
            {/* 子组件可以不写父路径 */}
            <Route index path="/" element={<Index />}></Route>
            {/* <Route path="/news" element={<News />}></Route> */}
            <Route path="/profile" element={<Profile />}></Route>
            <Route path="/search" element={<Search />}></Route>
          </Routes>

          {/* 匹配到的子组件的出口 */}
          <Outlet />
        </Suspense>

        <TabBar
          unselectedTintColor="#999"
          tintColor="#33A3F4"
          barTintColor="white"
        >
          {this.renderTabBarItems()}
        </TabBar>
      </div>
    );
  }
}

export default withRouter(Home);
