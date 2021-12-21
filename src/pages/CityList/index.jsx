import React, { Component } from "react";
import { useNavigate } from "react-router-dom";
import { Toast } from "antd-mobile";
import { getCitys, getHotCitys } from "../../api/City";
import { List, AutoSizer } from "react-virtualized";
import getCurrentCity from "../../utils/index";
import NavHeader from "../../components/NavHeader";
import "./index.scss";

const TITLE_HEIGHT = 40;
const CITY_HEIGHT = 40;
const CITY_VALID = ["北京", "上海", "广州", "深圳"];
function withRouter(Component) {
  return (props) => <Component {...props} navigate={useNavigate()} />;
}
function formatLetterIndex(letter) {
  switch (letter) {
    case "#":
      return "定位城市";
    case "hot":
      return "热门城市";
    default:
      return letter.toUpperCase();
  }
}

class CityList extends Component {
  state = {
    cityData: {},
    cityIndex: [],
    activeIndex: 0,
    ref: "",
  };

  async componentDidMount() {
    await this.initCitys();
    if (this.state.ref) {
      this.state.ref.measureAllRows(); // 预先测量List所有的行
    }
  }
  formatCityData(list) {
    const cityData = {};
    list.forEach((item) => {
      const firstStr = item.short.substr(0, 1);
      if (cityData[firstStr]) {
        cityData[firstStr].push(item);
      } else {
        cityData[firstStr] = [];
        cityData[firstStr].push(item);
      }
    });
    const cityIndex = Object.keys(cityData).sort();
    Toast.hide();
    return {
      cityData,
      cityIndex,
    };
  }
  handleRowClick = (item) => {
    if (CITY_VALID.includes(item.label)) {
      localStorage.setItem("HKZF_CITY", JSON.stringify(item));
      this.props.navigate("/home");
    } else {
      Toast.info("此城市暂无数据", 1);
    }
  };
  rowRenderer = ({
    index, // Index of row
    isScrolling, // The List is currently being scrolled
    isVisible, // This row is visible within the List (eg it is not an overscanned row)
    key, // Unique key within array of rendered rows
    parent, // Reference to the parent List (instance)
    style, // Style object to be applied to row (to position it);
    // This must be passed through to the rendered row element.
  }) => {
    const { cityIndex, cityData } = this.state;
    const letter = cityIndex[index];
    const citys = cityData[letter];

    return (
      <div key={key} style={style}>
        <div className="title">
          <span>{formatLetterIndex(letter)}</span>
        </div>
        {citys.map((item) => (
          <div
            onClick={() => {
              this.handleRowClick(item);
            }}
            key={item.value}
            className="city"
          >
            {item.label}
          </div>
        ))}
      </div>
    );
  };
  async initCitys() {
    Toast.loading("Loading...", 0);
    try {
      const { data: res } = await getCitys(1);
      const { cityData, cityIndex } = this.formatCityData(res.body);
      // 获取热门城市列表
      const { data: resHot } = await getHotCitys();
      cityData["hot"] = resHot.body;
      cityIndex.unshift("hot");
      const currentCity = await getCurrentCity();
      cityIndex.unshift("#");
      cityData["#"] = [currentCity];

      this.setState({
        cityData: cityData,
        cityIndex: cityIndex,
      });
    } catch (error) {
      console.log(error);
    }
  }
  getRowHeight = ({ index }) => {
    const { cityData, cityIndex } = this.state;
    return TITLE_HEIGHT + cityData[cityIndex[index]].length * CITY_HEIGHT;
  };
  renderRightList() {
    const { cityIndex, activeIndex } = this.state;
    return cityIndex.map((item, index) => {
      return (
        <li
          onClick={() => {
            this.state.ref.scrollToRow(index);
          }}
          className={activeIndex === index ? "active" : ""}
          key={item}
        >
          {item === "hot" ? "热" : item.toUpperCase()}
        </li>
      );
    });
  }
  onRowsRendered = ({ startIndex }) => {
    if (startIndex !== this.state.activeIndex) {
      this.setState({
        activeIndex: startIndex,
      });
    }
  };
  render() {
    return (
      <div className="cityList">
        <NavHeader>城市选择</NavHeader>
        <AutoSizer>
          {({ width, height }) => {
            return (
              <List
                ref={(ref) => {
                  this.state.ref = ref;
                }}
                width={width}
                height={height}
                rowCount={this.state.cityIndex.length} // 总数
                rowHeight={this.getRowHeight} // 动态计算每行的高度
                rowRenderer={this.rowRenderer} // 行渲染
                onRowsRendered={this.onRowsRendered} // 设置高亮效果
                scrollToAlignment="start" // 点击右侧索引list滚动位置
              />
            );
          }}
        </AutoSizer>

        {/* 右侧列表 */}
        <ul className="rightList">{this.renderRightList()}</ul>
      </div>
    );
  }
}
export default withRouter(CityList);
