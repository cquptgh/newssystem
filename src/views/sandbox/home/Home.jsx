/* 
  主页的路由组件
*/

import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { Card, Row, Col, Avatar, List, Drawer } from "antd";
import {
  EditOutlined,
  EllipsisOutlined,
  PieChartOutlined
} from "@ant-design/icons";
import * as echarts from "echarts";
import _ from "lodash";

const { Meta } = Card;

export default function Home() {
  const [viewList, setviewList] = useState([]);
  const [starList, setstarList] = useState([]);
  const [allList, setAllList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [pieChart, setPieChart] = useState(null);
  const barRef = useRef();
  const pieRef = useRef();
  const {
    username,
    region,
    role: { roleName }
  } = JSON.parse(localStorage.getItem("token"));

  //获取浏览数量最多的前6条数据
  useEffect(() => {
    axios
      .get(
        "/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6"
      )
      .then(res => {
        setviewList(res.data);
      });
  }, []);

  //获取点赞数量最多的前6条数据
  useEffect(() => {
    axios
      .get(
        "/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6"
      )
      .then(res => {
        setstarList(res.data);
      });
  }, []);

  //获取图形化数据
  useEffect(() => {
    axios.get("/news?publishState=2&_expand=category").then(res => {
      renderBarView(_.groupBy(res.data, item => item.category.title));
      setAllList(res.data);
    });
    return () => {
      window.onresize = null;
    };
  }, []);

  //渲染柱状图
  const renderBarView = dataObj => {
    var myChart = echarts.init(barRef.current);

    // 指定图表的配置项和数据
    var option = {
      title: {
        text: "当前用户新闻分类图示"
      },
      tooltip: {},
      legend: {
        data: ["数量"]
      },
      xAxis: {
        data: Object.keys(dataObj),
        axisLabel: {
          rotate: "45"
        }
      },
      yAxis: {
        minInterval: 1
      },
      series: [
        {
          name: "数量",
          type: "bar",
          data: Object.values(dataObj).map(item => item.length)
        }
      ]
    };
    option && myChart.setOption(option);
    window.onresize = () => {
      myChart.resize();
    };
  };

  //渲染饼图
  const renderPieView = () => {
    var myChart;
    var groupList = _.groupBy(allList, item => item.category.title);
    var list = [];
    for (const key in groupList) {
      list.push({
        value: groupList[key].length,
        name: key
      });
    }
    if (!pieChart) {
      myChart = echarts.init(pieRef.current);
      setPieChart(myChart);
    } else {
      myChart = pieChart;
    }

    var option = {
      title: {
        text: "当前用户新闻分类图示",
        left: "center"
      },
      tooltip: {
        trigger: "item"
      },
      legend: {
        orient: "vertical",
        left: "left"
      },
      series: [
        {
          name: "发布数量",
          type: "pie",
          radius: "50%",
          data: list,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)"
            }
          }
        }
      ]
    };

    option && myChart.setOption(option);
  };

  return (
    <div className="site-card-wrapper">
      <Row gutter={16}>
        <Col span={8}>
          <Card title="用户最常浏览" bordered={true}>
            <List
              size="small"
              dataSource={viewList}
              renderItem={item => (
                <List.Item>
                  <NavLink to={`/news-manage/preview/${item.id}`}>
                    {item.title}
                  </NavLink>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="用户点赞最多" bordered={true}>
            <List
              size="small"
              dataSource={starList}
              renderItem={item => (
                <List.Item>
                  <NavLink to={`/news-manage/preview/${item.id}`}>
                    {item.title}
                  </NavLink>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[
              <PieChartOutlined
                key="pie"
                onClick={() => {
                  setTimeout(() => {
                    setVisible(true);
                    renderPieView();
                  }, 0);
                }}
              />,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />
            ]}
          >
            <Meta
              avatar={
                <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
              }
              title={username}
              description={
                <>
                  <b style={{ fontSize: 16, marginRight: 20 }}>
                    {region ? region : "全球"}
                  </b>
                  <span>{roleName}</span>
                </>
              }
            />
          </Card>
        </Col>
      </Row>
      <div ref={barRef} style={{ width: "100%", height: 400, marginTop: 50 }} />
      <Drawer
        width="500px"
        title="用户新闻分类"
        placement="right"
        closable={true}
        onClose={() => setVisible(false)}
        visible={visible}
      >
        <div ref={pieRef} style={{ width: "100%", height: 400 }} />
      </Drawer>
    </div>
  );
}
