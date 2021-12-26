import React, { Component } from "react";
import withRouter from "../../utils/hoc";
import styles from "./index.module.css";
class PickerFooter extends Component {
  render() {
    const {
      onCancel,
      onSave,
      value,
      filterMore,
      children,
      type,
      navigate,
      handleRentAdd,
      rentFooter,
    } = this.props;
    return (
      <div
        className={[
          styles.root,
          filterMore ? styles.filterMore : "",
          rentFooter ? styles.footer : "",
        ].join(" ")}
      >
        <div
          className={styles.back}
          onClick={() => {
            if (type) {
              return navigate("/renter");
            }
            onCancel(value.type);
          }}
        >
          {children}
        </div>
        <div
          className={styles.sure}
          onClick={() => {
            if (type) {
              return handleRentAdd();
            }
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
