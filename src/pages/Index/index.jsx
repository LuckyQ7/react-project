import React, { Component } from "react";
import { useNavigate } from 'react-router-dom'
import { Carousel, Flex, Grid, WingBlank } from 'antd-mobile';
import { getSwiper, getGroups, getNews } from '../../api/Index'
import nv1 from '../../assets/images/nav-1.png'
import nv2 from '../../assets/images/nav-2.png'
import nv3 from '../../assets/images/nav-3.png'
import nv4 from '../../assets/images/nav-4.png'
import './index.scss'

import getCurrentCity from '../../utils/index.js'

const menus = [
    {
        id: 1,
        img: nv1,
        path: '/home/list',
        title: '整租'
    },
    {
        id: 2,
        img: nv2,
        path: '/home/list',
        title: '合租'
    },
    {
        id: 3,
        img: nv3,
        path: '/home/map',
        title: '去找房'
    },
    {
        id: 4,
        img: nv4,
        path: '/home/rent',
        title: '去出租'
    }
]

// const BMapGL = window.BMapGL

function withRouter(Component) {
    return (props) => (
        <Component
            {...props}
            navigate={useNavigate()}
        />
    );
}
class Index extends Component {
    state = {
        swipers: [],
        swipersIsLoaded: false, // 轮播图是否加载完毕
        groups: [],
        area: 'AREA|88cff55c-aaa4-e2e0',
        news: [],
        currentCity: '上海'
    }

    componentDidMount() {
        // simulate img loading
        this.initSwiper()
        this.initGroups()
        this.initNews()
        this.getMyCity()
    }
    async initSwiper() {
        try {
            const { data: res } = await getSwiper()
            this.setState(() => {
                return {
                    swipers: res.body,
                    swipersIsLoaded: true
                }
            })
        } catch (error) {
            console.log(error);
        }
    }
    async initGroups() {
        try {
            const area = this.state.area
            const { data: res } = await getGroups(area)
            this.setState({
                groups: res.body
            })
        } catch (error) {
            console.log(error);
        }
    }
    async initNews() {
        try {
            const area = this.state.area
            const { data: res } = await getNews(area)
            this.setState({
                news: res.body
            })
        } catch (error) {
            console.log(error);
        }
    }
    // 根据IP定位获取城市信息
    async getMyCity() {
        /*   const myCity = new BMapGL.LocalCity()
          myCity.get(async result => {
              try {
                  const { data: res } = await getCityInfo(result.name)
                  this.setState({
                      currentCity: res.body.label,
                      area: res.body.value
                  }, () => {
                      this.initGroups()
                  })
              } catch (error) {
  
              }
          }) */
        const res = await getCurrentCity()
        console.log(res);
        this.setState({
            currentCity: res.label,
            area: res.value
        }, () => {
            this.initGroups()
        })
    }
    renderSwipers() {
        return this.state.swipers.map(item => {
            return <img
                key={item.id}
                src={`http://localhost:8080${item.imgSrc}`}
                alt=""
                style={{ width: '100%', verticalAlign: 'top', height: '212px' }}
            />
        })
    }
    renderMenus() {
        return menus.map(item => {
            return <Flex.Item key={item.id} onClick={() => { this.props.navigate(item.path) }}>
                <img src={item.img} alt="" />
                <span>{item.title}</span>
            </Flex.Item>
        })
    }
    renderNews() {
        return this.state.news.map(item => {
            return <WingBlank key={item.id}>
                <div className='newsItem'>
                    <div className='newsImg'>
                        <img src={'http://localhost:8080' + item.imgSrc} alt="" />
                    </div>
                    <div className='newText'>
                        <div className='newTitle'>
                            {item.title}
                        </div>
                        <div className='newsFrom'>
                            <span>{item.from}</span>
                            <span>{item.date}</span>
                        </div>
                    </div>
                </div>
                <div className='line'></div>
            </WingBlank>
        })
    }
    render() {
        const { currentCity } = this.state
        return (
            <div>
                {/* 轮播图 */}
                <div className='swiper'>
                    {/* 搜索区域 */}
                    <div className='search'>
                        <div className='searchLeft'>
                            <span className='city' onClick={() => { this.props.navigate('/citylist') }}>{currentCity}</span>
                            <span className='inputText' onClick={() => { this.props.navigate('/search') }}><i className='iconfont icon-seach'></i>请输入小区或地址</span>
                        </div>
                        <div className='searchRight' onClick={() => { this.props.navigate('/map') }}>
                            <i className='iconfont icon-map'></i>
                        </div>
                    </div>
                    {this.state.swipersIsLoaded ? (<div className='swiper'>
                        <Carousel
                            autoplay
                            infinite
                        >
                            {this.renderSwipers()}
                        </Carousel>
                    </div>) : ('')}
                </div>


                {/* 导航菜单 */}
                <Flex>
                    {this.renderMenus()}
                </Flex>

                {/* 租房小组 */}
                <div className='groups'>
                    <h3 className='groupsTitle'>
                        <span>租房小组</span>
                        <span>更多</span>
                    </h3>

                    <Grid data={this.state.groups} hasLine={false} columnNum={2} square={false}
                        renderItem={dataItem => (
                            <div className='dataItem'>
                                <div className='text'>
                                    <span className='title'>{dataItem.title}</span>
                                    <span>{dataItem.desc}</span>
                                </div>
                                <div className='dataImg'>
                                    <img src={'http://localhost:8080' + dataItem.imgSrc} alt="" />
                                </div>
                            </div>
                        )}
                    />
                </div>

                {/* 最新资讯 */}
                <div className='news'>
                    <h3 className='newsTitle'>
                        最新资讯
                    </h3>
                    {this.renderNews()}
                </div>

            </div>
        );
    }
}

export default withRouter(Index)