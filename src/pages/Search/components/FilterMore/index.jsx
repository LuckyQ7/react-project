import React, { Component } from "react";
import withRouter from "../../../../utils/hoc";
import PickerFooter from "../../../../components/PickerFooter";
import styles from "./index.module.css";

class FilterMore extends Component {
  state = {
    selectValues: this.props.defaultValue,
  };

  handleDdClick = (value) => {
    const { selectValues } = this.state;
    const newSelectValues = selectValues;
    if (!newSelectValues.includes(value)) {
      newSelectValues.push(value);
    } else {
      const index = newSelectValues.indexOf(value);
      newSelectValues.splice(index, 1);
    }
    this.setState({
      selectValues: newSelectValues,
    });
  };

  renderFiltreDD = (data) => {
    return data.map((item) => {
      const flag = this.state.selectValues.includes(item.value);
      return (
        <dd
          key={item.value}
          className={flag ? styles.ddActive : ""}
          onClick={() => {
            this.handleDdClick(item.value);
          }}
        >
          {item.label}
        </dd>
      );
    });
  };

  onCancel = () => {
    this.setState({
      selectValues: [],
    });
  };
  render() {
    const {
      show,
      onCancel,
      roomType,
      oriented,
      characteristic,
      floor,
      onSave,
      type,
    } = this.props;
    const { selectValues } = this.state;
    return (
      <div className={styles.root}>
        <div
          className={styles.mask}
          onClick={() => {
            onCancel(type);
          }}
        ></div>
        <div
          className={[
            styles.container,
            show === true ? styles.containerShow : "",
          ].join(" ")}
        >
          <dl>
            <dt>户型</dt>
            {this.renderFiltreDD(roomType)}
            <hr />
            <dt>朝向</dt>
            {this.renderFiltreDD(oriented)}
            <hr />
            <dt>楼层</dt>
            {this.renderFiltreDD(floor)}
            <hr />
            <dt>房屋亮点</dt>
            {this.renderFiltreDD(characteristic)}
          </dl>
          <PickerFooter
            filterMore={true}
            onCancel={this.onCancel}
            onSave={onSave}
            value={{ value: selectValues, type }}
          >
            清除
          </PickerFooter>
        </div>
      </div>
    );
  }
}

export default withRouter(FilterMore);
