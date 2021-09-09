/* 
  SideMenu组件,属于NewsSandBox组件下的一般组件
*/
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Layout, Menu } from "antd";
import {
  HomeOutlined,
  TeamOutlined,
  UserOutlined,
  SecurityScanOutlined,
  MessageOutlined,
  EditOutlined,
  DeleteOutlined,
  AppstoreOutlined,
  AuditOutlined,
  UploadOutlined,
  FieldTimeOutlined,
  CloudDownloadOutlined
} from "@ant-design/icons";
//引入样式
import "./index.css";
//引入接口请求函数
import { reqRightList } from "../../../api";

const { Sider } = Layout;
const { SubMenu } = Menu;

//定义一个图标与路由的映射表
const iconList = {
  "/home": <HomeOutlined />,
  "/user-manage": <TeamOutlined />,
  "/user-manage/list": <UserOutlined />,
  "/right-manage": <SecurityScanOutlined />,
  "/right-manage/role/list": <UserOutlined />,
  "/right-manage/right/list": <UserOutlined />,
  "/news-manage": <MessageOutlined />,
  "/news-manage/add": <EditOutlined />,
  "/news-manage/draft": <DeleteOutlined />,
  "/news-manage/category": <AppstoreOutlined />,
  "/audit-manage": <AuditOutlined />,
  "/audit-manage/audit": <AuditOutlined />,
  "/audit-manage/list": <AuditOutlined />,
  "/publish-manage": <UploadOutlined />,
  "/publish-manage/unpublished": <FieldTimeOutlined />,
  "/publish-manage/published": <UploadOutlined />,
  "/publish-manage/sunset": <CloudDownloadOutlined />
};

function SideMenu(props) {
  //获取初始展开项,当刷新时自动展开所在的菜单项
  const initOpenKey = "/" + props.location.pathname.split("/")[1];
  //获取当前选中的菜单项 key
  const selectKey = [props.location.pathname];
  //获取一级菜单项
  const [rootSubmenuKeys, setRootSubmenuKeys] = useState([]);
  //侧边栏展开项
  const [openKeys, setOpenKeys] = useState([initOpenKey]);
  //侧边栏数据
  const [menuList, setMenuList] = useState([]);
  //从localStorage中取出当前登录用户的权限列表
  const {
    role: { rights }
  } = JSON.parse(localStorage.getItem("token"));

  //发送ajax请求获取侧边栏菜单数据
  useEffect(() => {
    const getMenuList = async () => {
      const menuList = await reqRightList("children");
      setMenuList(menuList);
      //遍历菜单数组,将一级导航项保存下来
      setRootSubmenuKeys(() =>
        menuList.map(menu => (menu.children?.length > 0 ? menu.key : null))
      );
    };
    getMenuList();
  }, []);

  //定义一个判断列表项是否展示在侧边导航栏的方法,根据返回数据中是否含有 pagepermisson 字段
  //且当前列表项必须在当前登录用户的权限列表中才能展示
  const checkPagepermisson = menu => {
    return menu.pagepermisson === 1 && rights.includes(menu.key);
  };

  //定义动态渲染侧边栏的方法
  const renderMenu = menuList => {
    return menuList.map(menu => {
      const { key, title } = menu;
      //如果children属性的长度不为0,说明含有二级菜单项,渲染为SubMenu
      if (menu.children?.length > 0 && checkPagepermisson(menu)) {
        return (
          <SubMenu key={key} title={title} icon={iconList[key]}>
            {renderMenu(menu.children)}
          </SubMenu>
        );
      }
      return checkPagepermisson(menu) ? (
        <Menu.Item
          key={key}
          icon={iconList[key]}
          onClick={() => props.history.push(key)}
        >
          {title}
        </Menu.Item>
      ) : undefined;
    });
  };

  //SubMenu 展开/关闭的回调,实现只展开当前父级菜单
  const onOpenChange = keys => {
    const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  return (
    <Sider trigger={null} collapsible collapsed={props.collapsed}>
      <div className="logo">全球新闻发布管理系统</div>
      <Menu
        theme="dark"
        mode="inline"
        openKeys={openKeys}
        selectedKeys={selectKey}
        onOpenChange={onOpenChange}
      >
        {renderMenu(menuList)}
      </Menu>
    </Sider>
  );
}

export default connect(state => ({
  collapsed: state.collapsed
}))(withRouter(SideMenu));
