/* 
  控制一级路由跳转,登录页面和后台管理页面
*/

import React from "react";
import { HashRouter, Switch, Route, Redirect } from "react-router-dom";

//引入一级路由组件
import Login from "../views/login";
import NewsSandBox from "../views/sandbox/NewsSandBox";
import News from "../views/news/News";
import Detail from "../views/news/Detail";

export default function IndexRouter() {
  return (
    <HashRouter>
      <Switch>
        <Route path="/news" component={News} />
        <Route path="/detail/:id" component={Detail} />
        <Route path="/login" component={Login} />
        {/* 如果未授权则重定向到登录页面 */}
        <Route
          path="/"
          render={() =>
            localStorage.getItem("token") ? (
              <NewsSandBox />
            ) : (
              <Redirect to="/login" />
            )
          }
        />
      </Switch>
    </HashRouter>
  );
}
