import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 查询退款单
 * @param params
 * @returns {Promise<IAsyncResult<T>>}
 */
export function fetchRefundOrderList(params = {}) {
  return Fetch('/account/refundOrders', {
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
  return Fetch<TResult>(`/account/allOfflineAccounts`);
}

/**
 * 确认
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function confirm() {
  return null;
}

/**
 * 批量确认
 * @param refundId
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function destory(refundId: string) {
  return Fetch<TResult>(`/account/refundOrders/destory/${refundId}`);
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
 * 新增退单流水
 * @param refundForm
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function addRefundBill(refundForm: any) {
  return Fetch<TResult>(`/account/refundBill`, {
    method: 'POST',
    body: JSON.stringify(refundForm)
  });
}

/**
 * 求和退款金额
 * @returns {Promise<IAsyncResult<T>>}
 */
export function sumReturnPrice(params = {}) {
  return Fetch(`/account/sumReturnPrice`, {
    method: 'POST',
    body: JSON.stringify({ ...params })
  });
}

//获取网关支付渠道列表
export const getChannelsByGateWaysId = gatewayId => {
  return Fetch<TResult>('/tradeManage/items/' + gatewayId);
};
