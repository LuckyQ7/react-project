import React, { Component } from "react";

import { Spring, animated } from "react-spring";

import withRouter from "../../../../utils/hoc";
import FilterMore from "../FilterMore";
import FilterPicker from "../FilterPicker";
import FilterTitle from "../FilterTitle";

import { getFilterData } from "../../../../api/Search";
import getCurrentCity from "../../../../utils/index";

import styles from "./index.module.css";

const filterTitleStatus = {
  area: false,
  mode: false,
  price: false,
  more: false,
};
const selectedValues = {
  area: ["area", "null"],
  mode: [],
  price: [],
  more: [],
};
class Filter extends Component {
  state = {
    filterTitleStatus,
    openType: "",
    filterData: {},
    data: [], // 当前筛选的数据
    col: 3,
    selectedValues,
  };

  componentDidMount() {
    // 获取到body
    this.htmlBody = document.body;

    this.initFilterData();
  }

  initFilterData = async () => {
    try {
      const value = await getCurrentCity();
      const { data: res } = await getFilterData(value.value);
      this.setState({
        filterData: res.body,
      });
    } catch (error) {
      console.log(error);
    }
  };

  onTitleClick = (type) => {
    // 解决有弹出层body滚动问题
    this.htmlBody.classList.add(styles.bodyFixed);

    const { selectedValues, filterTitleStatus } = this.state;
    // 创建新的标题状态选中对象
    const newFilterTitleStatus = { ...filterTitleStatus };
    Object.keys(filterTitleStatus).forEach((key) => {
      if (key === type) {
        newFilterTitleStatus[type] = true;
        return;
      }
      const selectValue = selectedValues[key];
      if (
        key === "area" &&
        (selectValue[0] !== "area" || selectValue.length !== 2)
      ) {
        newFilterTitleStatus[key] = true;
      } else if (
        key === "mode" &&
        selectValue[0] &&
        selectValue[0] !== "null"
      ) {
        newFilterTitleStatus[key] = true;
      } else if (
        key === "price" &&
        selectValue[0] &&
        selectValue[0] !== "null"
      ) {
        newFilterTitleStatus[key] = true;
      } else if (key === "more" && selectValue.length > 0) {
        newFilterTitleStatus[key] = true;
      } else {
        newFilterTitleStatus[key] = false;
      }
    });

    this.setState(
      {
        openType: type,
        filterTitleStatus: newFilterTitleStatus,
      },
      () => {
        this.renderFilterPickerData(this.state.filterData, this.state.openType);
      }
    );
  };

  onCancel = (type) => {
    // 取消限制
    this.htmlBody.classList.remove(styles.bodyFixed);
    const { selectedValues, filterTitleStatus } = this.state;
    const newFilterTitleStatus = { ...filterTitleStatus };
    const selectValue = selectedValues[type];
    if (
      type === "area" &&
      (selectValue[0] !== "area" || selectValue.length !== 2)
    ) {
      newFilterTitleStatus[type] = true;
    } else if (type === "mode" && selectValue[0] && selectValue[0] !== "null") {
      newFilterTitleStatus[type] = true;
    } else if (
      type === "price" &&
      selectValue[0] &&
      selectValue[0] !== "null"
    ) {
      newFilterTitleStatus[type] = true;
    } else if (type === "more" && selectValue.length > 0) {
      newFilterTitleStatus[type] = true;
    } else {
      newFilterTitleStatus[type] = false;
    }

    this.setState(() => {
      return {
        openType: "",
        filterTitleStatus: newFilterTitleStatus,
      };
    });
  };
  onSave = ({ value, type }) => {
    // 页面滚回顶部
    window.scrollTo(0, 0);
    const { onFilter } = this.props;
    this.setState(
      {
        selectedValues: {
          ...this.state.selectedValues,
          [type]: value,
        },
      },
      () => {
        this.onCancel(type);
        onFilter(this.state.selectedValues);
      }
    );
  };

  renderFilterPickerData = (filterData, openType) => {
    let data = [];
    let col = 3;
    if (openType === "area") {
      data = [filterData.area, filterData.subway];
    } else if (openType === "mode") {
      data = [...filterData.rentType];
      col = 1;
    } else if (openType === "price") {
      data = [...filterData.price];
      col = 1;
    }
    this.setState({
      data,
      col,
    });
  };

  renderFilterMore = () => {
    const { openType, filterData, selectedValues } = this.state;
    const { floor, characteristic, oriented, roomType } = filterData;
    if (openType === "more") {
      return (
        <FilterMore
          show={true}
          onCancel={this.onCancel}
          floor={floor}
          characteristic={characteristic}
          oriented={oriented}
          roomType={roomType}
          onSave={this.onSave}
          type={openType}
          defaultValue={selectedValues[openType]}
        />
      );
    }
  };

  // 渲染遮罩层
  renderMask = () => {
    const { openType } = this.state;
    const isShow = ["area", "price", "mode"].includes(openType);
    return (
      <Spring from={{ opacity: 0 }} to={{ opacity: isShow ? 0.6 : 0 }}>
        {(props) => {
          if (!isShow) {
            return null;
          }
          return (
            <animated.div
              onClick={() => {
                this.onCancel(openType);
              }}
              className={styles.mask}
              style={props}
            />
          );
        }}
      </Spring>
    );
  };
  render() {
    const { filterTitleStatus, openType, data, col, selectedValues } =
      this.state;
    return (
      <div className={styles.root}>
        {this.renderMask()}
        {/* 遮罩层 */}
        {/*  {["area", "price", "mode"].includes(openType) ? (
          <Spring from={{ opacity: 0 }} to={{ opacity: 0.6 }}>
            {(props) => (
              <animated.div
                onClick={() => {
                  this.onCancel(openType);
                }}
                className={styles.mask}
                style={props}
              />
            )}
          </Spring>
        ) : null} */}

        <div className={styles.container}>
          <FilterTitle
            filterTitleStatus={filterTitleStatus}
            onTitleClick={this.onTitleClick}
          />

          {["area", "price", "mode"].includes(openType) ? (
            <FilterPicker
              onCancel={() => {
                this.onCancel(openType);
              }}
              onSave={this.onSave}
              data={data}
              col={col}
              type={openType}
              defaultValue={selectedValues[openType]}
            />
          ) : null}

          {this.renderFilterMore()}
        </div>
      </div>
    );
  }
}

export default withRouter(Filter);
