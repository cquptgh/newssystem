/* 
  新闻预览路由组件,当在草稿箱组件中点击新闻标题会跳转到此页面
  该组件属于路由级权限(routepermisson)
*/

import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { PageHeader, Descriptions } from "antd";

import "./index.css";

export default function NewsPreview(props) {
  const [newsInfo, setNewsInfo] = useState(null);
  useEffect(() => {
    const newsId = props.match.params.id;
    axios.get(`/news/${newsId}?_expand=category&_expand=role`).then(res => {
      setNewsInfo(res.data);
    });
  }, [props.match.params.id]);
  const {
    title,
    author,
    createTime,
    publishTime,
    region,
    auditState,
    publishState,
    view,
    star,
    category,
    content
  } = newsInfo || {};
  const auditList = ["未审核", "审核中", "已通过", "未通过"];
  const publishList = ["未发布", "待发布", "已上线", "已下线"];
  const colorList = ["black", "orange", "green", "red"];

  return (
    <div className="site-page-header-ghost-wrapper">
      {newsInfo && (
        <>
          <PageHeader
            ghost={false}
            onBack={() => window.history.back()}
            title={title}
            subTitle={category.title}
          >
            <Descriptions size="small" column={3}>
              <Descriptions.Item label="创建者">{author}</Descriptions.Item>
              <Descriptions.Item label="创建时间">
                {moment(createTime).format("YYYY/MM/DD HH:mm:ss")}
              </Descriptions.Item>
              <Descriptions.Item label="发布时间">
                {publishTime
                  ? moment(publishTime).format("YYYY/MM/DD HH:mm:ss")
                  : "-"}
              </Descriptions.Item>
              <Descriptions.Item label="区域">{region}</Descriptions.Item>
              <Descriptions.Item label="审核状态">
                <span style={{ color: colorList[auditState] }}>
                  {auditList[auditState]}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="发布状态">
                <span style={{ color: colorList[publishState] }}>
                  {publishList[publishState]}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="访问数量">{view}</Descriptions.Item>
              <Descriptions.Item label="点赞数量">{star}</Descriptions.Item>
              <Descriptions.Item label="评论数量">0</Descriptions.Item>
            </Descriptions>
          </PageHeader>
          <div
            dangerouslySetInnerHTML={{
              __html: content
            }}
            className="preview-box"
          />
        </>
      )}
    </div>
  );
}
