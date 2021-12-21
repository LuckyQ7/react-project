import React, { Component } from "react";

import withRouter from "../../utils/hoc";
import { baseURL } from "../../utils/base";

import PropTypes from "prop-types";

import styles from "./index.module.css";
class HouseList extends Component {
  render() {
    const { tags, price, desc, title, houseImg, houseCode, navigate } =
      this.props;
    return (
      <li
        className={styles.houstItem}
        onClick={() => {
          navigate("/detaile/" + houseCode);
        }}
      >
        <div className={styles.houseImg}>
          <img className={styles.img} src={baseURL + `${houseImg}`} alt="" />
        </div>
        <div className={styles.desc}>
          <h4 className={styles.descTitle}>{title}</h4>
          <p className={styles.descText}>{desc}</p>
          <div>
            {tags.map((tag, index) => {
              const tagClass = "tag" + (index + 1);
              return (
                <span key={tag} className={styles[tagClass]}>
                  {tag}
                </span>
              );
            })}
          </div>
          <div>
            <span className={styles.price}>{price}</span>元/月
          </div>
        </div>
      </li>
    );
  }
}

HouseList.prototypes = {
  tags: PropTypes.array,
  price: PropTypes.string,
};

export default withRouter(HouseList);
