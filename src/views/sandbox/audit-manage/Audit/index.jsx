/* 
  审核新闻组件,属于审核管理模块下的二级路由组件
*/

import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { Table, Button, notification } from "antd";

export default function Audit() {
  const [auditNews, setAuditNews] = useState([]);
  const { roleId, region } = JSON.parse(localStorage.getItem("token"));
  //获取可以审核的新闻列表
  useEffect(() => {
    //定义一个角色的映射表
    const roleObj = {
      1: "superAdmin",
      2: "admin",
      3: "editor"
    };
    const getAuditNews = async () => {
      const response = await axios.get("/news?auditState=1&_expand=category");
      const auditNews =
        roleObj[roleId] === "superAdmin"
          ? response.data
          : response.data.filter(
              news =>
                news.region === region && roleObj[news.roleId] === "editor"
            );
      setAuditNews(auditNews);
    };
    getAuditNews();
  }, [roleId, region]);
  const handleAduit = (item, auditState, publishState) => {
    setAuditNews(auditNews.filter(news => news.id !== item.id));
    axios
      .patch(`/news/${item.id}`, {
        auditState,
        publishState
      })
      .then(res => {
        notification.info({
          message: "通知",
          description: "您可以到[审核管理/审核列表]中查看新闻的审核状态",
          placement: "bottomRight"
        });
      });
  };
  const columns = [
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
      key: "action",
      render: item => {
        return (
          <>
            <Button type="primary" onClick={() => handleAduit(item, 2, 1)}>
              通过
            </Button>
            <Button
              danger
              style={{ marginLeft: 10 }}
              onClick={() => handleAduit(item, 3, 0)}
            >
              驳回
            </Button>
          </>
        );
      }
    }
  ];
  return (
    <Table
      dataSource={auditNews}
      columns={columns}
      pagination={{ pageSize: 5 }}
      rowKey={item => item.id}
    />
  );
}
