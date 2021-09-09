/* 
  路由组件:后台管理组件
*/

import React, { useEffect } from "react";
import { Layout } from "antd";
import NProgress from "nprogress";
//引入一般组件
import SideMenu from "../../components/sandbox/SideMenu";
import TopHeader from "../../components/sandbox/TopHeader";
//引入动态创建路由的组件
import NewsRouter from "../../components/sandbox/NewsRouter";
//引入样式
import "nprogress/nprogress.css";
import "./NewsSandBox.less";

const { Content } = Layout;

export default function NewsSandbox() {
  NProgress.start();
  useEffect(() => {
    NProgress.done();
  });
  return (
    <Layout>
      {/* 侧边栏组件 */}
      <SideMenu />
      <Layout className="site-layout">
        {/* 头部组件 */}
        <TopHeader />
        {/* 内容展示区 */}
        <Content
          className="site-layout-content"
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            overflow: "auto"
          }}
        >
          <NewsRouter />
        </Content>
      </Layout>
    </Layout>
  );
}
