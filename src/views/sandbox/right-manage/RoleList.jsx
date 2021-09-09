/* 
  角色列表组件,属于权限管理模块下的二级路由组件
  该系统总共分为三种角色:超级管理员、区域管理员、区域编辑
*/

import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { Table, Button, Modal, Tree } from "antd";
import {
  DeleteOutlined,
  BarsOutlined,
  ExclamationCircleOutlined
} from "@ant-design/icons";
//引入接口请求函数
import { reqRightList, reqRoleList, delRole } from "../../../api";

const { confirm } = Modal;

export default function RoleList() {
  //Table表格数据(角色列表)
  const [roleList, setRoleList] = useState([]);
  //Tree树形控件的数据(权限列表)
  const [rightList, setRightList] = useState([]);
  //模态框是否显示状态
  const [isModalVisible, setIsModalVisible] = useState(false);
  //当前角色的权限列表
  const [currentRights, setCurrentRights] = useState([]);
  //点击的当前角色的ID
  const [currentId, setCurrentId] = useState();

  //获取角色列表和权限列表
  useEffect(() => {
    const getData = async () => {
      const roleList = await reqRoleList();
      const rightList = await reqRightList("children");
      setRoleList(roleList);
      setRightList(rightList);
    };
    getData();
  }, []);

  //定义点击删除角色按钮的回调
  const confirmDelete = item => {
    confirm({
      title: "Do you Want to delete this role?",
      icon: <ExclamationCircleOutlined />,
      content: `角色名称:${item.roleName}`,
      onOk() {
        deleteRole(item);
      }
    });
  };

  //定义删除角色的方法
  const deleteRole = item => {
    //前端数据同步+后台数据同步
    setRoleList(roleList.filter(role => role.id !== item.id));
    delRole(item.id);
  };

  //点击模态框Modal中确认按钮的回调,隐藏模态框,且同步当前角色的权限列表数据(前后端)
  const handleOk = () => {
    setIsModalVisible(false);
    //前端数据同步
    setRoleList(
      roleList.map(role => {
        if (role.id === currentId) {
          return {
            ...role,
            rights: currentRights
          };
        }
        return role;
      })
    );
    //后端数据同步
    axios.patch(`/roles/${currentId}`, {
      rights: currentRights
    });
  };

  //点击模态框Modal中取消按钮的回调,隐藏模态框
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  //当点击树形控件中复选框的回调,将当前角色最新的权限列表保存到状态中,便于后面的数据同步
  const onCheck = checkedKeys => {
    setCurrentRights(checkedKeys);
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
      title: "角色名称",
      dataIndex: "roleName",
      key: "roleName"
    },
    {
      title: "操作",
      render: item => {
        return (
          <div>
            <Button
              type="danger"
              shape="circle"
              icon={<DeleteOutlined />}
              style={{ marginRight: 10 }}
              onClick={() => confirmDelete(item)}
            />
            <Button
              type="primary"
              shape="circle"
              icon={<BarsOutlined />}
              onClick={() => {
                setIsModalVisible(true);
                setCurrentRights(item.rights);
                setCurrentId(item.id);
              }}
            />
          </div>
        );
      }
    }
  ];

  return (
    <Fragment>
      <Table
        columns={columns}
        dataSource={roleList}
        pagination={{ pageSize: 5 }}
        rowKey={role => role.id}
        style={{ width: "100%" }}
      />
      <Modal
        title="权限分配"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Tree
          checkable
          checkedKeys={currentRights}
          onCheck={onCheck}
          treeData={rightList}
        />
      </Modal>
    </Fragment>
  );
}
