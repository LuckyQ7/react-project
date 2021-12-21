import React, { Component } from "react";

import withRouter from "../../utils/hoc";

import styles from "./index.module.css";

import PropTypes from "prop-types";

class Sticky extends Component {
  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }
  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }
  handleScroll = () => {
    // 获取高度
    const { top } = this.placeholder.getBoundingClientRect();

    if (top < 0) {
      this.content.classList.add(styles.fixed);
      this.placeholder.style.height = this.props.height + "px";
    } else {
      this.content.classList.remove(styles.fixed);
      this.placeholder.style.height = "0px";
    }
  };
  render() {
    return (
      <div>
        {/* 占位元素 */}
        <div
          ref={(ref) => {
            this.placeholder = ref;
          }}
        ></div>
        {/* 内容元素 */}
        <div ref={(ref) => (this.content = ref)}>{this.props.children}</div>
      </div>
    );
  }
}

Sticky.prototypes = {
  height: PropTypes.number.isRequired,
};

export default withRouter(Sticky);
