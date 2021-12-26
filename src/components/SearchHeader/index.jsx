import React, { Component } from "react";
import withRouter from "../../utils/hoc";
import PropType from "prop-types";
import "./index.scss";

class SearchHeader extends Component {
  render() {
    return (
      <div className={["search", this.props.className || ""].join(" ")}>
        <div className="searchLeft">
          <span
            className="city"
            onClick={() => {
              this.props.navigate("/citylist");
            }}
          >
            {this.props.currentCity}
          </span>
          <span
            className="inputText"
            onClick={() => {
              this.props.navigate("/home/search");
            }}
          >
            <i className="iconfont icon-seach"></i>请输入小区或地址
          </span>
        </div>
        <div
          className="searchRight"
          onClick={() => {
            this.props.navigate("/map");
          }}
        >
          <i className="iconfont icon-map"></i>
        </div>
      </div>
    );
  }
}

SearchHeader.propTypes = {
  currentCity: PropType.string.isRequired,
};

export default withRouter(SearchHeader);
