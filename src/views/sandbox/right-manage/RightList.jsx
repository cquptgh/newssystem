/* 
  权限列表组件,属于权限管理模块下的二级路由组件
*/

import React, { useEffect, useState } from "react";
import { Table, Tag, Button, Popover, Switch, Modal } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined
} from "@ant-design/icons";
//引入接口请求函数
import {
  reqRightList,
  deleteFirstRights,
  deleteSecondRights,
  changeFirstRights,
  changeSecondRights
} from "../../../api";

const { confirm } = Modal;

export default function RightList() {
  //保存Table表格的数据(权限列表数据)
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const rightList = await reqRightList("children");
      rightList.map(right =>
        right.children?.length ? right : (right.children = null)
      );
      setDataSource(rightList);
    };
    getData();
  }, []);

  //定义点击删除权限按钮的回调
  const confirmDeleta = item => {
    confirm({
      title: "Do you Want to delete this rights?",
      icon: <ExclamationCircleOutlined />,
      content: `权限路径:${item.key}`,
      onOk() {
        deleteRights(item);
      }
    });
  };

  //定义删除权限的方法
  const deleteRights = item => {
    //处理一级导航项
    if (item.grade === 1) {
      //删除前端数据,更新页面
      setDataSource(dataSource.filter(rights => rights.id !== item.id));
      //删除后台数据,同步数据
      deleteFirstRights(item.id);
    } else {
      //处理子导航项
      /* 
        删除前端数据
        1.查找子导航项的父级导航
        2.通过父级导航过滤掉要删除的子导航
      */
      const parentRight = dataSource.filter(
        rights => rights.id === item.rightId
      );
      parentRight[0].children = parentRight[0].children.filter(
        rights => rights.id !== item.id
      );
      setDataSource([...dataSource]);
      //删除后台数据
      deleteSecondRights(item.id);
    }
  };

  //定义切换权限的方法
  const switchMethod = item => {
    //前端数据同步
    item.pagepermisson = item.pagepermisson === 1 ? 0 : 1;
    setDataSource([...dataSource]);
    //修改后台数据
    if (item.grade === 1) {
      changeFirstRights(item.id, item.pagepermisson);
    } else {
      changeSecondRights(item.id, item.pagepermisson);
    }
  };

  //定义Table表格的列
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: id => <b>{id}</b>
    },
    {
      title: "权限名称",
      dataIndex: "title",
      key: "title"
    },
    {
      title: "权限路径",
      dataIndex: "key",
      key: "key",
      render: key => <Tag color="orange">{key}</Tag>
    },
    {
      title: "操作",
      key: "action",
      render: item => {
        return (
          <div>
            <Button
              type="danger"
              shape="circle"
              icon={<DeleteOutlined />}
              style={{ marginRight: 10 }}
              onClick={() => confirmDeleta(item)}
            />
            <Popover
              content={
                <Switch
                  checked={item.pagepermisson}
                  onChange={() => switchMethod(item)}
                />
              }
              title="页面配置项"
              trigger={item.pagepermisson === undefined ? "" : "click"}
            >
              <Button
                type="primary"
                shape="circle"
                icon={<EditOutlined />}
                disabled={item.pagepermisson === undefined ? true : false}
              />
            </Popover>
          </div>
        );
      }
    }
  ];
  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      pagination={{ pageSize: 5 }}
      rowKey={right => right.id}
      style={{ width: "100%" }}
    />
  );
}
