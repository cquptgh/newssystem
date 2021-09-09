/* 
  封装发布管理模块中三个模块的通用逻辑操作
*/

import { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";
function usePublish(type) {
  const [newsList, setNewsList] = useState([]);
  useEffect(() => {
    const { username } = JSON.parse(localStorage.getItem("token"));
    axios
      .get(`/news?author=${username}&publishState=${type}&_expand=category`)
      .then(res => {
        setNewsList(res.data);
      });
  }, [type]);

  //发布
  const handlePublish = item => {
    setNewsList(newsList.filter(news => news.id !== item.id));
    axios
      .patch(`/news/${item.id}`, {
        publishState: 2,
        publishTime: Date.now()
      })
      .then(res => {
        message.success("新闻已发布");
      });
  };

  //下线
  const handleSunset = item => {
    setNewsList(newsList.filter(news => news.id !== item.id));
    axios
      .patch(`/news/${item.id}`, {
        publishState: 3,
        publishTime: ""
      })
      .then(res => {
        message.success("新闻已下线");
      });
  };

  //删除
  const handleDelete = item => {
    setNewsList(newsList.filter(news => news.id !== item.id));
    axios.delete(`/news/${item.id}`).then(res => {
      message.success("新闻已删除");
    });
  };

  return {
    newsList,
    handlePublish,
    handleSunset,
    handleDelete
  };
}

export default usePublish;
