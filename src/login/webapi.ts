import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 登录系统
 * @param ids
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function login(account: string, password: string) {
  return Fetch<TResult>('/employee/login', {
    method: 'POST',
    body: JSON.stringify({ account: account, password: password })
  });
}
/**
 * 仓库列表
 */
export const wareList = (data) => {
  return Fetch<TResult>('/ware/house/page', {
    method: 'POST',
    body: JSON.stringify(data)
  });
};
/**
 * 查询用户的菜单信息
 * @returns {Promise<IAsyncResult<T>>}
 */
export const fetchMenus = () => {
  return Fetch('/roleMenuFunc/menus');
};

/**
 * 查询用户的功能信息
 * @returns {Promise<IAsyncResult<T>>}
 */
export const fetchFunctions = () => {
  return Fetch('/roleMenuFunc/functions');
};

/**
 * 获取平台站点信息
 * @type {Promise<AsyncResult<T>>}
 */
export const getSiteInfo = () => {
  return Fetch('/baseConfig');
};

/**
 * 获取商家端的小程序码
 */
export const fetchMiniProgramQrcode = (storeId) => {
  return Fetch(`/store/getS2bSupplierQrcode/${storeId}`, { method: 'POST' });
};

/**
 * 获取所有配送方式
 */
export const fetchAllDeliveryWay = () => {
  return Fetch<TResult>('/freighttemplatedeliveryarea/queryOrderDeliveryWay');
};
