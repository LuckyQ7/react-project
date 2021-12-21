import React, { Component } from "react";

import SearchHeader from "../../components/SearchHeader/index";
import {
  List,
  WindowScroller,
  AutoSizer,
  InfiniteLoader,
} from "react-virtualized";

import { Toast } from "antd-mobile";

import HouseList from "../../components/HouseList";
import Filter from "./components/Filter";
import Sticky from "../../components/Sticky";

import styles from "./index.module.css";

import { getHouseList } from "../../api/Search";
import getCurrentCity from "../../utils";
import withRouter from "../../utils/hoc";

class Search extends Component {
  state = {
    list: [],
    currentCity: {
      label: "上海",
    },
    count: 0,
    value: null,
  };

  componentDidMount() {
    this.initCurrentCity();
    this.onFilter();
  }
  onFilter = async (value, start = 1, end = 20) => {
    try {
      Toast.loading("加载中", 0, null, true);
      const params = {};
      const res = await getCurrentCity();
      params.cityId = res.value;
      params.start = start;
      params.end = end;
      if (value) {
        const { area, mode, price, more } = value;
        params.area = area[1] ? (area[2] !== "null" ? area[2] : area[1]) : "";
        params.mode = mode[0];
        params.price = price[0];
        params.more = more;
        this.setState({
          value: {
            area,
            mode,
            price,
            more,
          },
        });
      }
      console.log(params);
      const {
        data: { body },
      } = await getHouseList(params);
      Toast.hide();
      if (body.count > 0) {
        Toast.info(`共找到${body.count}套房`, 3);
      }
      this.setState({
        list: body.list,
        count: body.count,
      });
    } catch (error) {
      console.log(error);
    }
  };
  initCurrentCity = async () => {
    try {
      const res = await getCurrentCity();
      this.setState({
        currentCity: res,
      });
    } catch (error) {
      console.log(error);
    }
  };

  isRowLoaded = ({ index }) => {
    return !!this.state.list[index];
  };

  loadMoreRows = ({ startIndex, stopIndex }) => {
    console.log(startIndex, stopIndex);
    return new Promise(async (reslove) => {
      try {
        const params = {};
        params.cityId = this.state.currentCity.value;
        params.start = startIndex;
        params.end = stopIndex;
        if (this.state.value) {
          params.price = this.state.value.price;
          params.mode = this.state.value.mode;
          params.more = this.state.value.more;
          params.area = this.state.value.area;
        }
        const {
          data: { body },
        } = await getHouseList(params);
        this.setState({
          list: [...this.state.list, ...body.list],
        });
      } catch (error) {
        console.log(error);
      }
      reslove();
    });
  };

  rowRenderer = ({ index, key, style }) => {
    const houseList = this.state.list[index];
    if (houseList) {
      return (
        <HouseList
          key={key}
          style={style}
          houseImg={houseList.houseImg}
          title={houseList.title}
          desc={houseList.desc}
          price={houseList.price}
          tags={houseList.tags}
          houseCode={houseList.houseCode}
        />
      );
    } else {
      return (
        <div key={key} style={style}>
          加载中。。。
        </div>
      );
    }
  };
  render() {
    const { currentCity, count } = this.state;
    return (
      <div className={styles.root}>
        <div className={styles.search}>
          <i
            className="iconfont icon-back"
            onClick={() => {
              this.props.navigate("/home");
            }}
          ></i>
          {/* 顶部导航栏 */}
          <SearchHeader
            currentCity={currentCity.label}
            className={styles.searchHeader}
          />
          {/* 条件筛选栏 */}
        </div>

        <Sticky height={40}>
          <Filter onFilter={this.onFilter} />
        </Sticky>

        <div className={styles.houseList}>
          <InfiniteLoader
            isRowLoaded={this.isRowLoaded}
            loadMoreRows={this.loadMoreRows}
            rowCount={count}
          >
            {({ onRowsRendered, registerChild  }) => (
              <WindowScroller>
                {({ isScrolling, scrollTop, height }) => {
                  return (
                    <AutoSizer>
                      {({ width }) => (
                        <List
                          onRowsRendered={onRowsRendered} // 滚动加载器
                          ref={registerChild} // 刷新数据
                          autoHeight
                          isScrolling={isScrolling}
                          width={width}
                          height={height} // 不知道为啥高度获取不到
                          rowCount={count} // 总数
                          rowHeight={120} // 动态计算每行的高度
                          rowRenderer={this.rowRenderer} // 行渲染
                          scrollTop={scrollTop}
                        />
                      )}
                    </AutoSizer>
                  );
                }}
              </WindowScroller>
            )}
          </InfiniteLoader>
        </div>
      </div>
    );
  }
}
export default withRouter(Search);
