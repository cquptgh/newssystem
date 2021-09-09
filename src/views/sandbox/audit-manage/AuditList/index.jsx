/* 
  审核列表组件,属于审核管理模块下的二级路由组件,审核状态auditState不为0的新闻会出现在此组件中
*/

import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { Table, Tag, Button, notification } from "antd";

export default function AuditList(props) {
  const [auditList, setAuditList] = useState([]);
  const { username } = JSON.parse(localStorage.getItem("token"));
  useEffect(() => {
    axios
      .get(
        `/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`
      )
      .then(res => {
        setAuditList(res.data);
      });
  }, [username]);
  //撤销
  const handleRevert = item => {
    //auditState改为0
    setAuditList(auditList.filter(auditNews => auditNews.id !== item.id));
    axios
      .patch(`/news/${item.id}`, {
        auditState: 0
      })
      .then(res => {
        notification.info({
          message: "通知",
          description: "您可以到草稿箱中查看您的新闻",
          placement: "bottomRight"
        });
      });
  };
  //发布
  const handlePublish = item => {
    setAuditList(auditList.filter(auditNews => auditNews.id !== item.id));
    axios
      .patch(`/news/${item.id}`, {
        publishState: 2,
        publishTime: Date.now()
      })
      .then(res => {
        // props.history.push("/publish-manage/published");
        notification.info({
          message: "通知",
          description: "您可以到【发布管理/已发布】中查看您的新闻",
          placement: "bottomRight"
        });
      });
  };
  //更新
  const handleUpdate = item => {
    props.history.push(`/news-manage/update/${item.id}`);
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
      title: "审核状态",
      dataIndex: "auditState",
      render: auditState => {
        const colorList = ["", "orange", "green", "red"];
        const auditList = ["草稿箱", "审核中", "已通过", "未通过"];
        return <Tag color={colorList[auditState]}>{auditList[auditState]}</Tag>;
      }
    },
    {
      title: "操作",
      key: "action",
      render: item => {
        return (
          <div>
            {item.auditState === 1 && (
              <Button type="primary" onClick={() => handleRevert(item)}>
                撤销
              </Button>
            )}
            {item.auditState === 2 && (
              <Button type="danger" onClick={() => handlePublish(item)}>
                发布
              </Button>
            )}
            {item.auditState === 3 && (
              <Button type="primary" onClick={() => handleUpdate(item)}>
                更新
              </Button>
            )}
          </div>
        );
      }
    }
  ];
  return (
    <Table
      dataSource={auditList}
      columns={columns}
      pagination={{ pageSize: 5 }}
      rowKey={item => item.id}
    />
  );
}
