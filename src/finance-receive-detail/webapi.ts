import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
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
      payOrderStatus: 0,
      ...params
    })
  });
}

/**
 * 查询线下付款账户
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function offlineAccounts() {
  return Fetch<TResult>(`/account/offlineAccounts`);
}

/**
 * 查询收款合计
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function sumPayOrderPrice(params) {
  return Fetch<TResult>(`/account/sumPayOrderPrice`, {
    method: 'POST',
    body: JSON.stringify({
      payOrderStatus: 0,
      ...params
    })
  });
}

//获取网关支付渠道列表
export const getChannelsByGateWaysId = gatewayId => {
  return Fetch<TResult>('/tradeManage/items/' + gatewayId);
};
