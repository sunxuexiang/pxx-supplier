import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: Array<any>;
};

/**
 * 查询收款单
 * @param params
 * @returns {Promise<IAsyncResult<T>>}
 */
export function fetchPayOrderList(params = {}) {
  return Fetch('/account/payOrders', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
}

/**
 * 验证用户是否有该接口权限
 */
export const checkFunctionAuth = (urlPath: string, requestType: string) => {
  return Fetch<TResult>('/check-function-auth', {
    method: 'POST',
    body: JSON.stringify({
      urlPath,
      requestType
    })
  });
};

/**
 * 查询商家账户
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function offlineAccounts() {
  return Fetch<TResult>(`/account/offlineAccounts`);
}

/**
 * 批量确认
 * @param payOrderIds
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function confirm(payOrderIds: string[]) {
  return Fetch<TResult>(`/account/confirm`, {
    method: 'POST',
    body: JSON.stringify({
      payOrderIds: payOrderIds
    })
  });
}

/**
 * 批量确认
 * @param payOrderIds
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function destory(payOrderIds: string[]) {
  return Fetch<TResult>(`/account/payOrder/destory`, {
    method: 'PUT',
    body: JSON.stringify({
      payOrderIds: payOrderIds
    })
  });
}

/**
 * 查询用户收款账号
 * @param customerId
 * @returns {Promise<IAsyncResult<T>>}
 */
export function fetchAccountsByCustomerId(customerId: string) {
  return Fetch(`/customer/accountList/${customerId}`);
}

/**
 * 新增收款单
 * @param customerId
 * @returns {Promise<IAsyncResult<T>>}
 */
export function addReceivable(receivableForm: any) {
  return Fetch<TResult>(`/account/receivable`, {
    method: 'POST',
    body: JSON.stringify(receivableForm)
  });
}

/**
 * 验证
 * @param tid
 * @returns {Promise<IAsyncResult<T>>}
 */
export const verifyAfterProcessing = (tid: string) => {
  return Fetch<TResult>(`/return/find-all/${tid}`);
};
