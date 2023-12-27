/**
 * Created by feitingting on 2017/12/7.
 */
import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 商家收款账户列表
 * @returns {Promise<IAsyncResult<T>>}
 */
export const getAccountList = () => {
  return Fetch<TResult>('/account/list');
};

/**
 * 设为主账号
 * @param params
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const setPrimary = (params: {}) => {
  return Fetch<TResult>(`/account/set/primary`, {
    method: 'PUT',
    body: JSON.stringify(params)
  });
};

/**
 * 查询店铺基本信息
 * @param storeId
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function fetchStoreInfo() {
  return Fetch<TResult>(`/store/storeInfo`);
}

/**
 * 保存银行账户编辑
 * @param params
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function saveAccountEdit(params: {}) {
  return Fetch<TResult>(`/account/renewal`, {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 确认收到打款
 * @param params
 * @returns {Promise<IAsyncResult<T>>}
 */
export function confirmReceive(params: {}) {
  return Fetch<TResult>(`/account/affirm/remit`, {
    method: 'PUT',
    body: JSON.stringify(params)
  });
}

/**
 * 删除银行账户
 * @param params
 */
export function deleteAccount(params: {}) {
  return Fetch<TResult>(`/account/renewal`, {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 查询商家工商信息
 * @param id
 */
export function findOne() {
  return Fetch<TResult>(`/companyInfo`);
}
