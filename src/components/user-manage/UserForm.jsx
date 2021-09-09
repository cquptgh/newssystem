/* 
  该组件封装的是用户列表组件用到的表单(添加用户和更新用户)
*/
import React, { forwardRef, useState, useEffect } from "react";
import { Form, Input, Select } from "antd";

const { Option } = Select;

const UserForm = forwardRef((props, ref) => {
  const [isDisabled, setIsDisabled] = useState(false);
  const { roleId, region } = JSON.parse(localStorage.getItem("token"));

  //当接收的属性发生改变时,区域选择框的禁用状态发生响应的改变
  useEffect(() => {
    setIsDisabled(props.isUpdateDisabled);
  }, [props.isUpdateDisabled]);

  //定义角色下拉框发生变化时的回调
  const changeSelect = roleId => {
    if (roleId === 1) {
      //当选择的是超级管理员时,禁用区域选择框
      setIsDisabled(true);
      //将选择框中的值设置为空字符串
      ref.current.setFieldsValue({
        region: ""
      });
    } else {
      setIsDisabled(false);
    }
  };
  //定义一个角色的映射表
  const roleObj = {
    1: "superAdmin",
    2: "admin",
    3: "editor"
  };

  //处理当前角色可以创建或更新哪个区域的用户
  const checkRegionDisabled = item => {
    if (props.isUpdate) {
      //更新用户时
      if (roleObj[roleId] === "superAdmin") {
        //如果是超级管理员,则拥有所有的权限
        return false;
      } else {
        //如果是区域管理员或者区域编辑则不能也不需要修改区域
        return true;
      }
    } else {
      //创建用户时
      if (roleObj[roleId] === "superAdmin") {
        //如果是超级管理员,则可以创建任何区域的用户
        return false;
      } else {
        //如果是区域管理员则只能创建自己区域的用户
        return item.value !== region;
      }
    }
  };

  //处理当前角色可以创建或更新用户的角色
  const checkRoleDisabled = item => {
    if (props.isUpdate) {
      //更新用户时
      if (roleObj[roleId] === "superAdmin") {
        //如果是超级管理员,则可以创建任意角色
        return false;
      } else {
        //如果是区域管理员或者区域编辑则不能也不需要更改角色
        return true;
      }
    } else {
      //创建用户时
      if (roleObj[roleId] === "superAdmin") {
        //如果是超级管理员,则可以创建任何等级的角色
        return false;
      } else {
        //如果是区域管理员则只能创建自己区域的区域编辑
        return roleObj[item.id] !== "editor";
      }
    }
  };

  return (
    <Form layout="vertical" ref={ref}>
      <Form.Item
        name="username"
        label="用户名"
        rules={[
          {
            required: true,
            message: "Please input the title of collection!"
          }
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="password"
        label="密码"
        rules={[
          {
            required: true,
            message: "Please input the title of collection!"
          }
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        name="region"
        label="区域"
        rules={
          isDisabled
            ? []
            : [
                {
                  required: true,
                  message: "Please input the title of collection!"
                }
              ]
        }
      >
        <Select disabled={isDisabled}>
          {props.regionList.map(item => (
            <Option
              value={item.value}
              key={item.id}
              disabled={checkRegionDisabled(item)}
            >
              {item.title}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="roleId"
        label="角色"
        rules={[
          {
            required: true,
            message: "Please input the title of collection!"
          }
        ]}
      >
        <Select onChange={roleId => changeSelect(roleId)}>
          {props.roleList.map(item => (
            <Option
              value={item.id}
              key={item.id}
              disabled={checkRoleDisabled(item)}
            >
              {item.roleName}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  );
});

export default UserForm;
