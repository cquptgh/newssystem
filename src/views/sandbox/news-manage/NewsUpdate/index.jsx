/* 
  新闻更新路由组件,当在草稿箱组件中点击更新按钮会跳转到此页面
  该组件属于路由级权限(routepermisson)
*/

import React, { useState, useEffect, useRef } from "react";
import {
  PageHeader,
  Steps,
  Button,
  message,
  Form,
  Input,
  Select,
  notification
} from "antd";
import axios from "axios";

import NewsEditor from "../../../../components/news-manage/NewsEditor";
import style from "./index.module.css";

const { Step } = Steps;
const { Option } = Select;

export default function NewsUpdate(props) {
  const [current, setCurrent] = useState(0);
  const [categoryList, setCategoryList] = useState([]);
  const [formInfo, setFormInfo] = useState({});
  const [newsContent, setNewsContent] = useState("");
  const NewsRef = useRef();
  //获取新闻分类列表
  useEffect(() => {
    const getCategoryList = async () => {
      const response = await axios.get("/categories");
      const categoryList = response.data;
      setCategoryList(categoryList);
    };
    getCategoryList();
  }, []);
  useEffect(() => {
    const newsId = props.match.params.id;
    axios.get(`/news/${newsId}?_expand=category&_expand=role`).then(res => {
      const { title, categoryId, content } = res.data;
      NewsRef.current.setFieldsValue({
        title,
        categoryId
      });
      setNewsContent(content);
    });
  }, [props.match.params.id]);
  //获取富文本编辑器中的新闻内容
  const getContent = newsContent => {
    setNewsContent(newsContent);
  };
  //点击保存到草稿箱和提交审核按钮的回调
  const handleSubmit = auditState => {
    axios
      .patch(`/news/${props.match.params.id}`, {
        ...formInfo,
        content: newsContent,
        auditState: auditState
      })
      .then(res => {
        notification.info({
          message: "提示",
          description:
            auditState === 0 ? "新闻提保存至草稿箱" : "新闻已提交至审核列表",
          placement: "bottomRight"
        });
        props.history.push(
          auditState === 0 ? "/news-manage/draft" : "/audit-manage/list"
        );
      });
  };
  //下一步按钮的回调
  const next = () => {
    if (current === 0) {
      NewsRef.current
        .validateFields()
        .then(res => {
          setFormInfo(res);
          setCurrent(current + 1);
        })
        .catch(error => {
          message.error("新闻标题或新闻类别不能为空!");
        });
    } else {
      if (!newsContent || newsContent.trim() === "<p></p>") {
        message.error("新闻内容不能为空!");
      } else {
        setCurrent(current + 1);
      }
    }
  };
  //上一步按钮的回调
  const prev = () => setCurrent(current - 1);
  return (
    <>
      <PageHeader
        className="site-page-header"
        title="更新新闻"
        onBack={() => props.history.goBack()}
      />
      <Steps current={current}>
        <Step title="基本信息" description="新闻标题,新闻分类" />
        <Step title="新闻内容" description="新闻主题内容" />
        <Step title="新闻提交" description="保存草稿箱或提交审核" />
      </Steps>
      <div className="steps-content" style={{ margin: "50px 0" }}>
        <div className={current === 0 ? "" : style.active}>
          <Form name="basic" ref={NewsRef}>
            <Form.Item
              label="新闻标题"
              name="title"
              rules={[{ required: true, message: "请输入新闻标题!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="新闻分类"
              name="categoryId"
              rules={[{ required: true, message: "请选择新闻的类别!" }]}
            >
              <Select>
                {categoryList.map(category => (
                  <Option value={category.id} key={category.id}>
                    {category.title}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </div>
        <div className={current === 1 ? "" : style.active}>
          <NewsEditor getContent={getContent} content={newsContent} />
        </div>
        <div className={current === 2 ? "" : style.active}></div>
      </div>
      <div className="steps-action">
        {current < 2 && (
          <Button type="primary" onClick={next} style={{ margin: "0 8px 0 0" }}>
            下一步
          </Button>
        )}
        {current === 2 && (
          <>
            <Button type="primary" onClick={() => handleSubmit(0)}>
              保存草稿箱
            </Button>
            <Button
              type="primary"
              onClick={() => handleSubmit(1)}
              style={{ margin: "0 8px" }}
            >
              提交审核
            </Button>
          </>
        )}
        {current > 0 && <Button onClick={prev}>上一步</Button>}
      </div>
    </>
  );
}
