import React, { Component } from "react";
import withRouter from "../../../../utils/hoc";
import styles from "./index.module.css";

const titleList = [
    { title: "区域", type: "area" },
    { title: "方式", type: "mode" },
    { title: "租金", type: "price" },
    { title: "筛选", type: "more" },
];

class FilterTitle extends Component {
    render() {
        const { filterTitleStatus, onTitleClick } = this.props;
        return (
            <div className={styles.root}>
                {titleList.map((item) => {
                    const status = filterTitleStatus[item.type];
                    return (
                        <div
                            key={item.title}
                            className={[styles.item, status ? styles.itemActive : ""].join(
                                " "
                            )}
                            onClick={() => {
                                onTitleClick(item.type);
                            }}
                        >
                            {item.title}
                        </div>
                    );
                })}
            </div>
        );
    }
}

export default withRouter(FilterTitle);
