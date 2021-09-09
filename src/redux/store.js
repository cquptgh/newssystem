/* 
  该文件主要用于创建store对象
*/

//引入createStore方法
import { createStore } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import allReducers from "./reducers";

const persistConfig = {
  key: "root",
  storage,
  blacklist: ["loading"],
  whitelist: ["collapsed"]
};

const persistedReducer = persistReducer(persistConfig, allReducers);
const store = createStore(persistedReducer);
const persistor = persistStore(store);

export { store, persistor };
