/* 
  该文件用于创建加载状态的reducer对象
*/
const initState = false;
export default function loadingReducer(preState = initState, action) {
  const { type, payload } = action;
  switch (type) {
    case "change_loading": {
      const newState = payload;
      return newState;
    }
    default:
      return preState;
  }
}
