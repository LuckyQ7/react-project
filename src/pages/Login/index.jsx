import React, { Component } from "react";
import { Link } from "react-router-dom";
import { WhiteSpace, WingBlank, Flex, Toast } from "antd-mobile";
import { withFormik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import NavHeader from "../../components/NavHeader";

import withRouter from "../../utils/hoc";

import styles from "./index.module.css";

import { userLogin } from "../../api/Login";

class Login extends Component {
  render() {
    return (
      <div>
        <NavHeader navBar={styles.navBar}>账号登陆</NavHeader>
        <WhiteSpace size="xl" />
        <WingBlank>
          <Form>
            <div className={styles.formItem}>
              <Field
                type="text"
                placeholder="请输入账号"
                autoComplete="off"
                name="username"
              />
            </div>
            <ErrorMessage
              className={styles.error}
              component="div"
              name="username"
            />
            <WhiteSpace size="xl" />
            <div className={styles.formItem}>
              <Field
                type="password"
                placeholder="请输入密码"
                autoComplete="new-password"
                name="password"
              />
            </div>
            <ErrorMessage
              component="div"
              className={styles.error}
              name="password"
            />
            <WhiteSpace />
            <Flex>
              <Flex.Item>
                <WhiteSpace />
                <button type="submit" className={styles.submit}>
                  登陆
                </button>
                <WhiteSpace />
              </Flex.Item>
            </Flex>
          </Form>

          <Flex>
            <Flex.Item>
              <Link className={styles.link} to="/registered">
                还没有账号，去注册~
              </Link>
            </Flex.Item>
          </Flex>
        </WingBlank>
      </div>
    );
  }
}

Login = withFormik({
  mapPropsToValues: () => ({ username: "", password: "" }),
  handleSubmit: async (values, { props }) => {
    try {
      Toast.loading("登录中");
      const { username, password } = values;
      const obj = {
        username,
        password,
      };
      const {
        data: { description, body, status },
      } = await userLogin(obj);

      if (status === 200) {
        Toast.info("登陆成功");
        localStorage.setItem("HKZFTOKEN", body.token);
        props.navigate(-1, { replace: true });
      } else {
        Toast.info(description);
      }
    } catch (error) {
      console.log(error);
    }
  },
  validationSchema: yup.object({
    username: yup
      .string()
      .required("用户名不能为空")
      .matches(/^[a-zA-Z_\d]{5,8}$/, "用户名为5到8位"),
    password: yup
      .string()
      .required("密码不能为空")
      .matches(/^[a-zA-Z_\d]{5,12}$/, "密码为6到12位"),
  }),
})(Login);

export default withRouter(Login);
