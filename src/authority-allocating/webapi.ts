import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
};

/**
 * 查询系统角色
 * @param ids
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function fetchRoles() {
  return Fetch('/customer/employee/roles');
}

/**
 * 新增系统角色
 */
export function addRole(roleName: string) {
  return Fetch<TResult>('/role', {
    method: 'POST',
    body: JSON.stringify({
      roleName: roleName
    })
  });
}

/**
 * 修改角色
 * @param param
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function updateRole(param) {
  return Fetch<TResult>('/role', {
    method: 'PUT',
    body: JSON.stringify(param)
  });
}

/**
 * 查询当前角色拥有的菜单权限标识
 * @returns {Promise<IAsyncResult<T>>}
 */
export function fetchRoleMenuAuths(roleInfoId) {
  return Fetch(`/roleMenuFunc/${roleInfoId}`);
}

/**
 * 查询所有的菜单权限
 * @returns {Promise<IAsyncResult<T>>}
 */
export function fetchBossMenus() {
  return Fetch('/menuAuth/func');
}

/**
 * 修改菜单
 * @param bossMenus bossMenus
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function updateBossMenus(bossMenus) {
  return Fetch<TResult>('/roleMenuFunc', {
    method: 'PUT',
    body: JSON.stringify(bossMenus)
  });
}
