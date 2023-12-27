/**
 * Created by feitingting on 2017/12/9.
 */
import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 获取基础银行数据
 */
export const fetchBaseBank = () => {
  return Fetch<TResult>(`/account/base/bank`);
};

/**
 * 商家收款账户列表
 * @returns {Promise<IAsyncResult<T>>}
 */
export const getAccountList = () => {
  return Fetch<TResult>('/account/list');
};

/**
 * 保存银行账户编辑
 * @param params
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function saveAccountAdd(params: {}) {
  return Fetch<TResult>(`/account/renewal`, {
    method: 'POST',
    body: JSON.stringify(params)
  });
}
