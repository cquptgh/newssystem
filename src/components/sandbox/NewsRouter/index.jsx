/* 
  该组件是用于动态创建用户路由的
*/

import React, { useState, useEffect, lazy, Suspense } from "react";
import { connect } from "react-redux";
import { Switch, Route, Redirect } from "react-router-dom";
import axios from "axios";
import { Spin } from "antd";

//路由懒加载
const Home = lazy(() => import("../../../views/sandbox/home/Home"));
const UserList = lazy(() =>
  import("../../../views/sandbox/user-manage/UserList")
);
const RightList = lazy(() =>
  import("../../../views/sandbox/right-manage/RightList")
);
const RoleList = lazy(() =>
  import("../../../views/sandbox/right-manage/RoleList")
);
const NewsAdd = lazy(() =>
  import("../../../views/sandbox/news-manage/NewsAdd")
);
const NewsDraft = lazy(() =>
  import("../../../views/sandbox/news-manage/NewsDraft")
);
const NewsCategory = lazy(() =>
  import("../../../views/sandbox/news-manage/NewsCategory")
);
const NewsPreview = lazy(() =>
  import("../../../views/sandbox/news-manage/NewsPreview")
);
const NewsUpdate = lazy(() =>
  import("../../../views/sandbox/news-manage/NewsUpdate")
);
const Audit = lazy(() => import("../../../views/sandbox/audit-manage/Audit"));
const AuditList = lazy(() =>
  import("../../../views/sandbox/audit-manage/AuditList")
);
const Unpublished = lazy(() =>
  import("../../../views/sandbox/publish-manage/Unpubished")
);
const Published = lazy(() =>
  import("../../../views/sandbox/publish-manage/Published")
);
const Sunset = lazy(() =>
  import("../../../views/sandbox/publish-manage/Sunset")
);
const NoPermission = lazy(() =>
  import("../../../views/sandbox/nopermission/NoPermission")
);

//创建本地路由映射表
const LocalRouterMap = {
  "/home": Home,
  "/user-manage/list": UserList,
  "/right-manage/role/list": RoleList,
  "/right-manage/right/list": RightList,
  "/news-manage/add": NewsAdd,
  "/news-manage/draft": NewsDraft,
  "/news-manage/category": NewsCategory,
  "/news-manage/preview/:id": NewsPreview,
  "/news-manage/update/:id": NewsUpdate,
  "/audit-manage/audit": Audit,
  "/audit-manage/list": AuditList,
  "/publish-manage/unpublished": Unpublished,
  "/publish-manage/published": Published,
  "/publish-manage/sunset": Sunset
};

function NewsRouter(props) {
  //保存后端返回的路由列表
  const [backRouteList, setBackRouteList] = useState([]);
  //获取当前登录用户的权限列表
  const {
    role: { rights }
  } = JSON.parse(localStorage.getItem("token"));

  useEffect(() => {
    Promise.all([axios.get("/rights"), axios.get("/children")]).then(res => {
      setBackRouteList([...res[0].data, ...res[1].data]);
    });
  }, []);

  //检测路由是否有本地映射且当前路由是否可以展示(pagepermisson)
  const checkRoute = item => {
    return (
      LocalRouterMap[item.key] && (item.pagepermisson || item.routepermisson)
    );
  };

  //检测路由是否存在于当前登录用户的权限列表中
  const checkUserPermisson = item => {
    return rights.includes(item.key);
  };

  return (
    <Suspense fallback={null}>
      <Spin size="large" spinning={props.isLoading}>
        <Switch>
          {/* 根据用户的权限列表动态渲染路由 */}
          {backRouteList.map(route => {
            if (checkRoute(route) && checkUserPermisson(route)) {
              return (
                <Route
                  path={route.key}
                  component={LocalRouterMap[route.key]}
                  key={route.key}
                  exact
                />
              );
            }
            return null;
          })}
          <Redirect from="/" to="/home" exact />
          {/* 当访问未授权或未知路由时,展示如下组件 */}
          {backRouteList.length > 0 && (
            <Route path="*" component={NoPermission} />
          )}
        </Switch>
      </Spin>
    </Suspense>
  );
}

export default connect(state => ({
  isLoading: state.loading
}))(NewsRouter);
