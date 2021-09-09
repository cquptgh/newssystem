/* 
  用户列表组件,属于用户管理模块下的二级路由组件
*/

import React, { useState, useEffect, useRef, Fragment } from "react";
import axios from "axios";
import { Modal, Button, Table, Switch } from "antd";
import {
  ExclamationCircleOutlined,
  DeleteOutlined,
  EditOutlined
} from "@ant-design/icons";

//引入接口请求函数
import { reqRoleList, reqRegionList, delUser } from "../../../api";
//引入封装好的表单组件
import UserForm from "../../../components/user-manage/UserForm";

const { confirm } = Modal;

export default function UserList() {
  //用户列表状态
  const [userList, setUserList] = useState([]);
  //角色列表状态
  const [roleList, setRoleList] = useState([]);
  //区域列表状态
  const [regionList, setRegionList] = useState([]);
  //添加用户的模态框显示状态
  const [isAddVisible, setIsAddVisible] = useState(false);
  //更新用户的模态框显示状态
  const [isUpdateVisible, setIsUpdateVisible] = useState(false);
  //更新用户时是否禁用区域选择框,超级管理员时需要禁用
  const [isUpdateDisabled, setIsUpdateDisabled] = useState(false);
  //当前更新的用户
  const [current, setCurrent] = useState();
  //创建添加用户表单的ref
  const addRef = useRef();
  //创建更新用户表单的ref
  const updateRef = useRef();
  const { roleId, region, id } = JSON.parse(localStorage.getItem("token"));

  //获取用户数据
  useEffect(() => {
    //定义一个角色的映射表
    const roleObj = {
      1: "superAdmin",
      2: "admin",
      3: "editor"
    };
    const getUserList = async () => {
      const response = await axios.get("/users?_expand=role");
      const userList =
        roleObj[roleId] === "superAdmin"
          ? response.data
          : response.data.filter(
              user => user.id === id || user.region === region
            );
      setUserList(userList);
    };
    getUserList();
  }, [roleId, region, id]);

  //获取角色数据,区域数据
  useEffect(() => {
    const getData = async () => {
      const roleList = await reqRoleList();
      const regionList = await reqRegionList();
      setRoleList(roleList);
      setRegionList(regionList);
    };
    getData();
  }, []);

  //添加用户的方法
  const addUser = () => {
    addRef.current.validateFields().then(value => {
      //隐藏添加用户的表单
      setIsAddVisible(false);
      //清空表单中的残留数据
      addRef.current.resetFields();
      //发送post请求,后台数据更新,生成用户id,方便后面前端数据的更新
      axios
        .post("/users", {
          ...value,
          roleState: true,
          default: false
        })
        .then(res => {
          //前端数据同步
          setUserList([
            ...userList,
            {
              ...res.data,
              role: roleList.filter(role => role.id === value.roleId)[0]
            }
          ]);
        });
    });
  };

  //定义点击删除用户按钮的回调
  const confirmDelete = item => {
    confirm({
      title: "Do you Want to delete this user?",
      icon: <ExclamationCircleOutlined />,
      content: `用户名称:${item.username}`,
      onOk() {
        deleteUser(item);
      }
    });
  };

  //定义删除用户的方法
  const deleteUser = item => {
    //前端数据同步+后台数据同步
    setUserList(userList.filter(user => user.id !== item.id));
    delUser(item.id);
  };

  //定义点击更新用户按钮的回调
  const handleUpdate = item => {
    setTimeout(() => {
      setIsUpdateVisible(true);
      //判断是否需要禁用区域选择框
      if (item.roleId === 1) {
        setIsUpdateDisabled(true);
      } else {
        setIsUpdateDisabled(false);
      }
      updateRef.current.setFieldsValue(item);
    }, 0);
    //将当前更新的用户维护到状态中
    setCurrent(item);
  };

  //更新用户的方法
  const updateUser = () => {
    updateRef.current.validateFields().then(value => {
      //隐藏更新用户的表单
      setIsUpdateVisible(false);
      //前端数据更新
      setUserList(
        userList.map(user => {
          if (user.id === current.id) {
            return {
              ...user,
              ...value,
              role: roleList.filter(role => role.id === value.roleId)[0]
            };
          }
          return user;
        })
      );
      setIsUpdateDisabled(!isUpdateDisabled);
      //后台数据更新
      axios.patch(`/users/${current.id}`, {
        ...value
      });
    });
  };

  //定义点击更改用户状态按钮的回调(修改roleState的值)
  const handleChange = item => {
    //前端更改用户状态
    item.roleState = !item.roleState;
    setUserList([...userList]);
    //后端更改用户状态
    axios.patch(`/users/${item.id}`, {
      roleState: item.roleState
    });
  };

  //定义Table表格的列
  const columns = [
    {
      title: "区域",
      dataIndex: "region",
      filters: [
        ...regionList.map(region => ({
          text: region.title,
          value: region.value
        })),
        {
          text: "全球",
          value: "全球"
        }
      ],
      onFilter: (value, item) => {
        if (value === "全球") {
          return item.region === "";
        }
        return value === item.region;
      },
      render: region => {
        return <b>{region === "" ? "全球" : region}</b>;
      }
    },
    {
      title: "角色名称",
      dataIndex: "role",
      render: role => {
        return role.roleName;
      }
    },
    {
      title: "用户名",
      dataIndex: "username"
    },
    {
      title: "用户状态",
      dataIndex: "roleState",
      render: (roleState, item) => {
        return (
          <Switch
            checked={roleState}
            disabled={item.default}
            onChange={() => handleChange(item)}
          />
        );
      }
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
              disabled={item.default}
              onClick={() => confirmDelete(item)}
            />
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              disabled={item.default}
              onClick={() => handleUpdate(item)}
            />
          </div>
        );
      }
    }
  ];

  return (
    <Fragment>
      <Button type="primary" onClick={() => setIsAddVisible(true)}>
        添加用户
      </Button>
      <Table
        dataSource={userList}
        columns={columns}
        pagination={{ pageSize: 5 }}
        rowKey={user => user.id}
        style={{ width: "100%" }}
      />
      {/* 添加用户的表单 */}
      <Modal
        visible={isAddVisible}
        title="添加用户信息"
        okText="确定"
        cancelText="取消"
        onCancel={() => {
          setIsAddVisible(false);
          addRef.current.resetFields();
        }}
        onOk={addUser}
      >
        <UserForm ref={addRef} roleList={roleList} regionList={regionList} />
      </Modal>
      {/* 更新用户表单 */}
      <Modal
        visible={isUpdateVisible}
        title="更新用户信息"
        okText="更新"
        cancelText="取消"
        onCancel={() => {
          setIsUpdateVisible(false);
          setIsUpdateDisabled(!isUpdateDisabled);
        }}
        onOk={updateUser}
      >
        <UserForm
          ref={updateRef}
          roleList={roleList}
          regionList={regionList}
          isUpdateDisabled={isUpdateDisabled}
          isUpdate={true}
        />
      </Modal>
    </Fragment>
  );
}
