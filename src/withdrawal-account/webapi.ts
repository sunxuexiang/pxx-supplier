import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 获取列表
 */
export const getWiteDrawalList = (params = {}) => {
  return Fetch<TResult>('/account/listWithDrawal');
};

/**
 * 保存银行信息
 * @param param
 * @returns {Promise<IAsyncResult<T>>}
 */
export function saveBankInfo(params = {}) {
  return Fetch<TResult>('/account/updateDelAccount', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}
