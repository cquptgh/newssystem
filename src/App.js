import React, { Fragment } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

//引入路由模块
import IndexRouter from "./router/IndexRouter";
//引入store对象
import { store, persistor } from "./redux/store";
//引入样式
import "./App.css";

export default function App() {
  return (
    <Fragment>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <IndexRouter />
        </PersistGate>
      </Provider>
    </Fragment>
  );
}
