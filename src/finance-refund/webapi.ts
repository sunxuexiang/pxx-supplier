import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: Array<any>;
};

/**
 * 查询退款单
 * @param params
 * @returns {Promise<IAsyncResult<T>>}
 */
export function fetchRefundOrderList(params = {}) {
  return Fetch<TResult>('/account/refundOrders', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
}

/**
 * 查询线下付款账户
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function offlineAccounts() {
  return Fetch<TResult>('/account/offlineValidAccounts');
}

/**
 * 拒绝退款
 * @param params
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function saveRefuse(params = {}) {
  return Fetch<TResult>('/account/refundOrders/refuse', {
    method: 'PUT',
    body: JSON.stringify({
      ...params
    })
  });
}

/**
 * 确认
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function confirm() {
  return null;
}

/**
 * 作废退单退款
 * @param returnOrderCode
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function destory(returnOrderCode: string) {
  return Fetch<TResult>(`/account/refundOrders/destory/${returnOrderCode}`);
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
 * 查询用户收款账号
 * @param customerId
 * @returns {Promise<IAsyncResult<T>>}
 */
export function fetchAccountsByCustomerId(customerId: string) {
  return Fetch(`/customer/accountList/${customerId}`);
}

/**
 * 新增退单流水
 * @param refundForm
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function addRefundBill(refundForm: any) {
  return Fetch<TResult>('/account/refundBill', {
    method: 'POST',
    body: JSON.stringify(refundForm)
  });
}

/**
 * 线下退款
 * @param rid
 * @param params
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const refundOffline = (rid: string, params = {}) => {
  return Fetch<TResult>(`/return/refund/${rid}/offline`, {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 线上退款
 * @param rid
 */
export const refundOnline = (rid: string) => {
  return Fetch<TResult>(`/return/refund/${rid}/online`, {
    method: 'POST'
  });
};

/**
 * 校验退款单的状态，是否已经在退款处理中
 * @param {string} rid
 * @returns {Promise<IAsyncResult<any>>}
 */
export const checkRefundStatus = (rid: string) => {
  return Fetch(`/return/verifyRefundStatus/${rid}`);
};
