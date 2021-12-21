import React, { Component } from "react";
import withRouter from "../../utils/hoc";
import styles from "./index.module.css";
class PickerFooter extends Component {
  render() {
    const { onCancel, onSave, value, filterMore, children } = this.props;
    return (
      <div
        className={[styles.root, filterMore ? styles.filterMore : ""].join(" ")}
      >
        <div
          className={styles.back}
          onClick={() => {
            onCancel(value.type);
          }}
        >
          {children}
        </div>
        <div
          className={styles.sure}
          onClick={() => {
            onSave(value);
          }}
        >
          确定
        </div>
      </div>
    );
  }
}

export default withRouter(PickerFooter);
