/* 
  封装发布管理模块下的通用组件
*/

import React from "react";
import { NavLink } from "react-router-dom";
import { Table, Button } from "antd";

export default function NewsPublish(props) {
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
          <div>
            {item.publishState === 1 && (
              <Button type="primary" onClick={() => props.handlePublish(item)}>
                发布
              </Button>
            )}
            {item.publishState === 2 && (
              <Button type="primary" onClick={() => props.handleSunset(item)}>
                下线
              </Button>
            )}
            {item.publishState === 3 && (
              <Button danger onClick={() => props.handleDelete(item)}>
                删除
              </Button>
            )}
          </div>
        );
      }
    }
  ];
  return (
    <Table
      dataSource={props.dataSource}
      columns={columns}
      pagination={{ pageSize: 5 }}
      rowKey={item => item.id}
    />
  );
}
