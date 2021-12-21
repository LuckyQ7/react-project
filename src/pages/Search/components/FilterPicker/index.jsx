import React, { Component } from "react";
import { PickerView } from 'antd-mobile'
import withRouter from "../../../../utils/hoc";
import PickerFooter from "../../../../components/PickerFooter";
import styles from './index.module.css'

class FilterPicker extends Component {
    state = {
        value: this.props.defaultValue
    }
    handlePickerView = val => {
        this.setState({
            value: val
        })
    }
    render() {
        const { onCancel, onSave, data, col, type } = this.props
        const { value } = this.state
        return <div className={styles.root}>
            {/* key 值解决filterPicker不重新创建的问题 */}
            <PickerView
                key={type}
                data={data}
                cols={col}
                value={value}
                onChange={(val) => { this.handlePickerView(val) }}
            />
            <PickerFooter onCancel={onCancel} onSave={onSave} value={{ value, type }} >取消</PickerFooter>
        </div>
    }
}

export default withRouter(FilterPicker)