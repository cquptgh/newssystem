/* 
  能发送异步ajax请求的模块,封装axios库
  函数的返回值是 promise 对象
  axios.get()/post()返回的就是 promise 对象
  返回自己创建的 promise 对象:
    统一处理请求异常
    异步返回结果数据, 而不是包含结果数据的 response
*/

import axios from "axios";
import { message } from "antd";
import { store } from "../redux/store";

axios.defaults.baseURL = "http://localhost:5000";
axios.interceptors.request.use(
  function (config) {
    // 显示loading
    store.dispatch({
      type: "change_loading",
      payload: true
    });
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function (response) {
    //隐藏loading
    store.dispatch({
      type: "change_loading",
      payload: false
    });
    return response;
  },
  function (error) {
    store.dispatch({
      type: "change_loading",
      payload: false
    });
    return Promise.reject(error);
  }
);

export default function ajax(url, data = {}, type = "GET") {
  return new Promise(resolve => {
    let promise;
    switch (type) {
      case "GET": {
        promise = axios.get(url, { params: data });
        break;
      }
      case "POST": {
        promise = axios.post(url, data);
        break;
      }
      case "DELETE": {
        promise = axios.delete(url + `/${data.id}`);
        break;
      }
      case "PATCH": {
        promise = axios.patch(url, data);
        break;
      }
      default:
        break;
    }

    promise
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        message.error(error.message);
      });
  });
}
