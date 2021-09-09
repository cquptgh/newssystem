/* 
  该文件用于创建处理侧边栏折叠状态的reducer对象
*/

import { CHANGE_COLLAPSED } from "../constant";
const initState = false;
export default function collapsedReducer(preState = initState, action) {
  const { type } = action;
  switch (type) {
    case CHANGE_COLLAPSED: {
      const newState = preState;
      return !newState;
    }
    default:
      return preState;
  }
}
