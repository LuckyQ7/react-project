import React, { Component } from "react";
import {
    Route, Routes,
    useLocation,
    useNavigate,
    useParams,
    Outlet,
} from 'react-router-dom'
import { TabBar } from 'antd-mobile'
import News from "../News";
import HouseList from "../HouseList";
import Profile from "../Profile";
import Index from "../Index";

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
        title: '首页',
        icon: 'icon-ind',
        path: '/home'
    },
    {
        title: '找房',
        icon: 'icon-findHouse',
        path: '/search'
    },
    {
        title: '新闻',
        icon: 'icon-mess',
        path: '/home/news'
    },
    {
        title: '我的',
        icon: 'icon-my',
        path: '/home/profile'
    }
]
class Home extends Component {
    state = {
        selectedTab: this.props.location.pathname,
    };
    // 更新的生命周期钩子
    componentDidUpdate(prevProps) {
        if (prevProps.location.pathname !== this.props.location.pathname) {
            this.setState({
                selectedTab: this.props.location.pathname
            })
        }
    }
    renderTabBarItems() {
        return tabBarItems.map(item => {
            return <TabBar.Item
                title={item.title}
                key={item.title}
                icon={<i className={`iconfont ${item.icon}`}></i>}
                selectedIcon={<i className={`iconfont ${item.icon}`}></i>}
                selected={this.state.selectedTab === item.path}
                onPress={() => {
                    this.setState({
                        selectedTab: item.path,
                    });
                    this.props.navigate(item.path)
                }}
            >
            </TabBar.Item>
        })
    }
    render() {

        return <div>
            <Routes>
                {/* 子组件可以不写父路径 */}
                <Route index path='/' element={<Index />}></Route>
                <Route path='/news' element={<News />}></Route>
                <Route path='/list' element={<HouseList />}></Route>
                <Route path='/profile' element={<Profile />}></Route>
            </Routes>

            {/* 匹配到的子组件的出口 */}
            <Outlet />

            <TabBar
                unselectedTintColor="#ccc"
                tintColor="#33A3F4"
                barTintColor="white"
            >
                {this.renderTabBarItems()}
            </TabBar>
        </div>
    }
}

export default withRouter(Home)