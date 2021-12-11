import React, { Component } from "react";
import { Map, ZoomControl, ScaleControl, } from 'react-bmapgl';
import { Toast } from 'antd-mobile'
import NavHeader from "../../components/NavHeader";
import getCurrentCity from '../../utils/index'
import './index.scss'
import styles from './index.module.css'
import { getMapHouseSource, getHomeHouseSource } from '../../api/Map'
const BMapGL = window.BMapGL;
const labelStyle = {
    cursor: 'pointer',
    border: '0px solid rgb(255,0,0)',
    padding: '0px',
    whiteSpace: 'nowarp',
    fontSize: '12px',
    color: "rgb(255,255,255)",
    textAlign: 'center',
    borderRadius: '50%',
    backgroundColor: 'rgba(23, 169, 117, 0.8)'

}

const labelStyleRect = {
    cursor: 'pointer',
    border: '0px solid rgb(255,0,0)',
    padding: '0px',
    whiteSpace: 'nowarp',
    fontSize: '12px',
    color: "rgb(255,255,255)",
    textAlign: 'center',
    backgroundColor: 'rgba(23, 169, 117, 0.8)'

}
export default class Maps extends Component {
    state = {
        point: '',
        zoom: 11,
        houseList: [],
        show: false
    }
    componentDidMount() {
        this.initGeocoder()
        Toast.loading('Loading...', 0);
    }
    async initGeocoder() {
        const res = await getCurrentCity()
        //创建地址解析器实例
        const myGeo = new BMapGL.Geocoder();
        myGeo.getPoint(res.label, (point) => {
            if (point) {
                this.setState({
                    point
                }, async () => {
                    const curretCity = await getCurrentCity()
                    this.renderOverlays(curretCity.value)
                })
            }
        }, res.label)
    }
    // 渲染地图覆盖物
    async renderOverlays(curretCity) {
        Toast.loading('Loading...', 0);
        const { data: res } = await getMapHouseSource(curretCity)
        const { type, nextZoom } = this.getTypeAndZoom()
        res.body.forEach(item => {
            this.creatOverLays(item, nextZoom, type)
        })
        this.map.addEventListener('movestart', () => {
            if (this.state.show === true) {
                this.setState({
                    show: false
                })
            }
        })
    }
    // 获取房子列表
    async getHouseList(cityId) {
        try {
            const { data: res } = await getHomeHouseSource(cityId)
            this.setState({
                houseList: res.body.list
            }, () => {
                this.setState({
                    show: true
                }, () => {
                    Toast.hide()
                })
            })
        } catch (error) {
            console.log(error);
        }
    }
    // 渲染区镇
    creatCircle(item, nextZoom) {

        const content = `<div class=${styles.labelContainer}><div>${item.label}</div><div >${item.count}</div></div>`;
        const point = new BMapGL.Point(item.coord.longitude, item.coord.latitude);
        const label = new BMapGL.Label(content, {
            position: point,
            offset: new BMapGL.Size(-35, -35)
        })
        this.map.addOverlay(label);
        label.setStyle(labelStyle)
        label.id = item.value
        label.addEventListener('click', () => {
            this.map.centerAndZoom(point, nextZoom);
            this.map.clearOverlays()
            this.renderOverlays(label.id)
        })
        Toast.hide()

    }

    // 渲染小区
    creatRect(item, nextZoom) {
        const content = `<div class=${styles.labelCirCleContainer}><span>${item.label}</span><span >${item.count}套</span></div>`;
        const point = new BMapGL.Point(item.coord.longitude, item.coord.latitude);
        const label = new BMapGL.Label(content, {
            position: point,
            offset: new BMapGL.Size(-20, -30)
        })
        this.map.addOverlay(label);
        label.setStyle(labelStyleRect)
        label.id = item.value
        label.addEventListener('click', (e) => {
            Toast.loading('Loading...', 0);
            this.map.centerAndZoom(point, nextZoom);
            // 移动地图位置
            const target = e.domEvent.changedTouches[0]
            const x = window.innerWidth / 2 - target.clientX
            const y = (window.innerWidth - 450) / 2 - target.clientY
            this.map.panBy(x, y)
            this.getHouseList(label.id)
        })
        Toast.hide()
    }
    // 创建覆盖物中转
    creatOverLays(item, nextZoom, type) {
        if (type === 'circle') {
            // 渲染小区
            this.creatCircle(item, nextZoom)
        } else if (type === 'rect') {
            // 渲染镇
            this.creatRect(item, nextZoom)
        }
    }
    // 获取缩放级别和类型
    getTypeAndZoom() {
        const zoom = this.map.getZoom()
        let nextZoom, type
        if (zoom === 11) {
            nextZoom = 14
            type = 'circle'
        } else if (zoom === 14) {
            nextZoom = 16
            type = 'circle'
        } else if (zoom === 16) {
            type = "rect"
        }
        return { nextZoom, type }
    }
    renderHouseList() {
        return this.state.houseList.map(item => {
            return (
                <li className={styles.houstItem} key={item.houseCode}>
                    <div className={styles.houseImg}>
                        <img className={styles.img} src={`http://localhost:8080${item.houseImg}`} alt="" />
                    </div>
                    <div className={styles.desc}>
                        <h4 className={styles.descTitle}>{item.title}</h4>
                        <p className={styles.descText}>{item.desc}</p>
                        <div>
                            {item.tags.map((tag, index) => {
                                const tagClass = 'tag' + (index + 1)
                                return <span key={tag} className={styles[tagClass]}>{tag}</span>
                            })}
                        </div>
                        <div>
                            <span className={styles.price}>{item.price}</span>元/月
                        </div>
                    </div>
                </li >
            )
        })
    }
    render() {
        const { point, zoom } = this.state
        return (<div className='container'>
            <NavHeader>地图找房</NavHeader>
            <div id='map'>
                <Map
                    ref={ref => ref ? this.map = ref.map : ''}
                    style={{ height: '100%' }}
                    center={{ lng: point.lng, lat: point.lat }}
                    zoom={zoom}
                    enableScrollWheelZoom
                    enableDoubleClickZoom={false}
                >
                    <ZoomControl />
                    <ScaleControl />
                </Map>
            </div>
            <div className={!this.state.show ? [styles.houseList] : [styles.houseList, styles.show].join(' ')}>
                <h3 className={styles.title}>
                    <span>房屋列表</span>
                    <span className={styles.moreHouseSource}>更多房源</span>
                </h3>

                <ul className={styles.mapUl}>
                    {this.renderHouseList()}
                </ul>
            </div>
        </div>)


    }
}
