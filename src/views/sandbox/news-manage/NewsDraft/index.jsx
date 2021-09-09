/* 
  新闻管理模块下的草稿箱组件,审核状态auditState=0的新闻会出现在此组件中
*/

import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { Table, Button, Modal, notification } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  UploadOutlined,
  ExclamationCircleOutlined
} from "@ant-design/icons";

const { confirm } = Modal;

export default function NewsDraft(props) {
  //草稿箱中新闻列表状态
  const [newsList, setNewsList] = useState([]);
  const { username } = JSON.parse(localStorage.getItem("token"));

  //获取草稿箱中的新闻列表
  useEffect(() => {
    const getNewsList = async () => {
      const response = await axios.get(
        `/news?author=${username}&auditState=0&_expand=category`
      );
      const newsList = response.data;
      setNewsList(newsList);
    };
    getNewsList();
  }, [username]);

  //定义点击删除新闻按钮的回调
  const confirmDelete = item => {
    confirm({
      title: "Do you Want to delete this news?",
      icon: <ExclamationCircleOutlined />,
      content: `新闻标题:${item.title}`,
      onOk() {
        deleteNews(item);
      }
    });
  };
  //定义删除新闻的方法
  const deleteNews = item => {
    //前端数据同步+后台数据同步
    setNewsList(newsList.filter(news => news.id !== item.id));
    axios.delete(`/news/${item.id}`);
  };
  //提交至审核列表
  const handleCheck = id => {
    setNewsList(newsList.filter(news => news.id !== id));
    axios
      .patch(`/news/${id}`, {
        auditState: 1
      })
      .then(res => {
        notification.info({
          message: "提示",
          description: "新闻已提交至审核列表",
          placement: "bottomRight"
        });
        // props.history.push("/audit-manage/list");
      });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: id => {
        return <b>{id}</b>;
      }
    },
    {
      title: "新闻标题",
      dataIndex: "title",
      render: (title, item) => {
        return (
          <NavLink to={`/news-manage/preview/${item.id}`}>{title}</NavLink>
        );
      }
    },
    {
      title: "作者",
      dataIndex: "author"
    },
    {
      title: "新闻分类",
      dataIndex: "category",
      render: category => {
        return category.title;
      }
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
              icon={<EditOutlined />}
              style={{ marginRight: 10 }}
              onClick={() => {
                props.history.push(`/news-manage/update/${item.id}`);
              }}
            />
            <Button
              type="primary"
              shape="circle"
              icon={<UploadOutlined />}
              onClick={() => handleCheck(item.id)}
            />
          </div>
        );
      }
    }
  ];
  return (
    <Table
      dataSource={newsList}
      columns={columns}
      pagination={{ pageSize: 5 }}
      rowKey={item => item.id}
    />
  );
}
