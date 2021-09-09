/* 
  包含应用中所有接口请求函数的模块,每个函数都返回 promise 
*/

import ajax from "./ajax";

//请求权限列表数据的接口请求函数
export const reqRightList = _embed => ajax("/rights", { _embed }, "GET");

//请求角色列表数据的接口请求函数
export const reqRoleList = () => ajax("/roles");

//请求区域列表数据的接口请求函数
export const reqRegionList = () => ajax("/regions");

//请求用户列表数据的接口请求函数
export const reqUserList = _expand => ajax("/users", { _expand }, "GET");

//删除某项一级权限的接口请求函数
export const deleteFirstRights = id => ajax("/rights", { id }, "DELETE");

//删除某项二级权限的接口请求函数
export const deleteSecondRights = id => ajax("/children", { id }, "DELETE");

//修改某项一级权限的访问权限的接口请求函数
export const changeFirstRights = (id, pagepermisson) =>
  ajax(`/rights/${id}`, { pagepermisson }, "PATCH");

//修改某项二级权限的访问权限的接口请求函数
export const changeSecondRights = (id, pagepermisson) =>
  ajax(`/children/${id}`, { pagepermisson }, "PATCH");

//删除某个角色的接口请求函数
export const delRole = id => ajax("/roles", { id }, "DELETE");

//删除指定用户的接口请求函数
export const delUser = id => ajax("/users", { id }, "DELETE");
