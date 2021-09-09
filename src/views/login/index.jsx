/* 
  路由组件:登录组件
*/
import React from "react";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import axios from "axios";
//引入样式
import "./index.less";

export default function Login(props) {
  //提交表单的回调
  const onFinish = values => {
    const { username, password } = values;
    //发送ajax请求校验登录信息
    axios
      .get(
        `/users?username=${username}&password=${password}&roleState=true&_expand=role`
      )
      .then(res => {
        if (res.data.length === 0) {
          message.error("用户名、密码不匹配或用户已被禁用");
        } else {
          //将用户的相关信息存储到localStorage中
          localStorage.setItem("token", JSON.stringify(res.data[0]));
          //跳转到后台页面
          props.history.push("/");
        }
      });
  };

  return (
    <div className="login-page">
      <div className="form-container">
        <div className="login-title">全球新闻发布管理系统</div>
        <Form name="normal_login" onFinish={onFinish}>
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your Username!"
              }
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your Password!"
              }
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
