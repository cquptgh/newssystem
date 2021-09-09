/* 
  待发布新闻组件,属于发布管理模块下的二级路由组件
  publishState=1的新闻会出现在此组件中
*/

import React from "react";

import NewsPublish from "../../../components/publish-manage/NewsPublish";
import usePublish from "../../../hooks/usePublish";

export default function Unpublished() {
  const { newsList, handlePublish } = usePublish(1);
  return <NewsPublish dataSource={newsList} handlePublish={handlePublish} />;
}
