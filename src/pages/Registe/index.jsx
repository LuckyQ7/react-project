import React, { Component } from "react";
import { Link } from "react-router-dom";

import { WhiteSpace, WingBlank, Flex, Button, InputItem } from "antd-mobile";

import NavHeader from "../../components/NavHeader";

import withRouter from "../../utils/hoc";

import styles from "./index.module.css";

class Login extends Component {
  render() {
    return (
      <div>
        <NavHeader navBar={styles.navBar}>注册</NavHeader>
        <WhiteSpace size="xl" />
        <WingBlank>
          <form>
            <InputItem clear placeholder="请输入用户名">
              用户名
            </InputItem>
            <WhiteSpace size="xl" />
            <InputItem clear placeholder="请输入密码">
              密码
            </InputItem>
            <WhiteSpace size="xl" />
            <InputItem clear placeholder="请重新输入密码">
              重复密码
            </InputItem>
          </form>
          <Flex>
            <Flex.Item>
              <WhiteSpace />
              <Button type="primary">注册 </Button>
              <WhiteSpace />
            </Flex.Item>
          </Flex>
          <Flex justify="between">
            <Link className={styles.link} to="/home">
              点我回首页
            </Link>

            <Link className={styles.link} to="/login">
              已有账号，去登陆
            </Link>
          </Flex>
        </WingBlank>
      </div>
    );
  }
}

export default withRouter(Login);
