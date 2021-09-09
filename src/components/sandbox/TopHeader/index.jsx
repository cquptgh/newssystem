/* 
  TopHeader组件,属于NewsSandBox组件下的一般组件
*/
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Layout, Dropdown, Menu, Avatar } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined
} from "@ant-design/icons";

import { changeCollapsed } from "../../../redux/actions/collapsedAction";
//引入样式
import "./index.less";
//引入接口请求函数
import { reqRightList } from "../../../api";

const { Header } = Layout;

function TopHeader(props) {
  const [menuList, setMenuList] = useState([]);
  const [currentTitle, setCurrentTitle] = useState();
  //从localStorage中取出当前用户的相关信息
  const {
    role: { roleName },
    username
  } = JSON.parse(localStorage.getItem("token"));

  useEffect(() => {
    const getMenuList = async () => {
      const menuList = await reqRightList("children");
      setMenuList(menuList);
    };
    getMenuList();
  }, []);

  useEffect(() => {
    //定义获取当前标题的方法
    const getCurrentTitle = menuList => {
      //获取当前所在路径
      const { pathname } = props.location;
      let title;
      menuList.forEach(menu => {
        if (menu.key === pathname) {
          title = menu.title;
        } else if (menu.children?.length > 0) {
          const result = menu.children.find(cItem => cItem.key === pathname);
          if (result) {
            title = result.title;
          }
        }
      });
      return title;
    };
    let currentTitle = getCurrentTitle(menuList);
    setCurrentTitle(currentTitle);
  }, [props, menuList]);

  //定义退出登录的方法
  const logOut = () => {
    localStorage.removeItem("token");
    props.history.replace("/login");
  };

  //下拉菜单的 overlay 配置项
  const menu = (
    <Menu>
      <Menu.Item key="rolename">{roleName}</Menu.Item>
      <Menu.Item danger key="logout" onClick={logOut}>
        退出登录
      </Menu.Item>
    </Menu>
  );

  return (
    <Header className="site-layout-background" style={{ padding: 0 }}>
      <div className="header-left">
        {React.createElement(
          props.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
          {
            className: "trigger",
            onClick: () => props.changeCollapsed()
          }
        )}
        <span>{currentTitle}</span>
      </div>
      <div className="weclome-user">
        <span>
          欢迎<span className="username">{username}</span>回来
        </span>
        <Dropdown overlay={menu} className="user-avatar">
          <Avatar size={48} icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  );
}

export default connect(state => ({ collapsed: state.collapsed }), {
  changeCollapsed
})(withRouter(TopHeader));
