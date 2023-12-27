import { Fetch } from 'qmkit';

/**
 * 查询结算银行账户
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function fetchAccountList() {
  return Fetch<TResult>('/account/list');
}

/**
 * 查询提现账户
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function fetchWithDrawalList() {
  return Fetch<TResult>('/account/listWithDrawal');
}

/**
 * 提现提交
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function withdrawalSubmit(filterParams) {
  return Fetch<TResult>('/pay/withdrawal', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

/**
 * 查询鲸币账户余额
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function queryCustomerWallet(filterParams) {
  return Fetch<TResult>('/pay/queryCustomerWallet', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

/**
 * 结果
 * @param checkState
 * @param customerIds
 * @returns {Promise<IAsyncResult<T>>}
 */
type TResult = {
  code: string;
  message: string;
  context: any;
};
