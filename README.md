# 全球新闻发布管理系统

### 项目模块
* 登录模块
* 数据分析
* 权限管理
* 角色管理
* 用户管理
* 新闻管理
* 分类管理
* 审核管理
* 发布管理

### 项目结构
    |-- craco.config.js     #antd的配置文件
    |-- db.json             #json-server的模拟数据
    |-- package.json
    |-- public              #不参与编译的资源文件
    |   |-- favicon.ico
    |   |-- index.html
    |   |-- manifest.json
    |   |-- robots.txt
    |   |-- css
    |       |-- reset.css   #重置样式
    |-- src
        |-- App.css
        |-- App.js          #App组件
        |-- index.js        #入口文件
        |-- api             #封装的部分axios
        |   |-- ajax.js
        |   |-- index.js
        |-- components      #一般组件
        |   |-- news-manage     #与新闻管理相关的组件
        |   |   |-- NewsEditor.jsx      #封装的富文本编辑器组件
        |   |-- publish-manage      #与发布管理相关的组件
        |   |   |-- NewsPublish.jsx
        |   |-- sandbox             #后台管理相关的组件
        |   |   |-- NewsRouter      #封装的动态创建路由的组件
        |   |   |   |-- index.jsx
        |   |   |-- SideMenu        #侧边导航栏组件
        |   |   |   |-- index.css
        |   |   |   |-- index.jsx
        |   |   |-- TopHeader       #顶部展示组件
        |   |       |-- index.jsx
        |   |       |-- index.less
        |   |-- user-manage         #与用户管理相关的组件
        |       |-- UserForm.jsx
        |-- hooks                   #封装的一个hooks函数,主要是与发布管理相关的逻辑处理
        |   |-- usePublish.js
        |-- redux                   #redux配置
        |   |-- constant.js
        |   |-- store.js
        |   |-- actions
        |   |   |-- collapsedAction.js
        |   |-- reducers
        |       |-- collapsedReducer.js
        |       |-- index.js
        |       |-- loadingReducer.js
        |-- router                  #一级路由目录
        |   |-- IndexRouter.jsx
        |-- views                   #路由组件
            |-- login               #登陆页面
            |   |-- index.jsx
            |   |-- index.less
            |-- news                #游客系统
            |   |-- Detail.jsx
            |   |-- News.jsx
            |-- sandbox
                |-- NewsSandBox.jsx     #后台管理的主页面
                |-- NewsSandBox.less
                |-- audit-manage        #审核管理模块
                |   |-- Audit
                |   |   |-- index.jsx
                |   |-- AuditList
                |       |-- index.jsx
                |-- home                #主页
                |   |-- Home.jsx
                |-- news-manage         #新闻管理模块
                |   |-- NewsAdd         #撰写新闻
                |   |   |-- index.jsx
                |   |   |-- index.module.css
                |   |-- NewsCategory    #新闻分类
                |   |   |-- index.jsx
                |   |-- NewsDraft       #草稿箱
                |   |   |-- index.jsx
                |   |-- NewsPreview     #新闻预览(属于路由级权限,不会展示在侧边导航栏中)
                |   |   |-- index.css
                |   |   |-- index.jsx
                |   |-- NewsUpdate      #新闻更新(属于路由级权限,不会展示在侧边导航栏中)
                |       |-- index.jsx
                |       |-- index.module.css
                |-- nopermission        #访问未授权页面展示的页面
                |   |-- NoPermission.jsx
                |-- publish-manage      #发布管理模块
                |   |-- Published.jsx     #已发布
                |   |-- Sunset.jsx        #已下线  
                |   |-- Unpubished.jsx    #待发布
                |-- right-manage        #权限管理模块
                |   |-- RightList.jsx     #权限列表
                |   |-- RoleList.jsx      #角色列表
                |-- user-manage         #用户管理模块
                    |-- UserList.jsx      #用户列表

### 使用方法

`git clone https://github.com/cquptgh/newssystem.git`

`cd newssystem`

//全局安装`json-server`

`yarn add -g json-server`

//安装依赖

`yarn`

//启动模拟的服务器

`json-server --watch db.json --port 5000`

//启动

`yarn start`

//打包

`yarn build`

### 截图
![Image text](https://github.com/cquptgh/newssystem/blob/master/src/assets/login.png)

![Image text](https://github.com/cquptgh/newssystem/blob/master/src/assets/admin.png)

![Image text](https://github.com/cquptgh/newssystem/blob/master/src/assets/newsadd.png)

![Image text](https://github.com/cquptgh/newssystem/blob/master/src/assets/userlist.png)
