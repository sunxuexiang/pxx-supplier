import { Fetch } from 'qmkit';

/**
 * 获取账户信息列表
 */
export const fetchList = (params) => {
  return Fetch<TResult>('/pay/queryRecordList', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 商户给用户充值
 */
export const merchantGiveUser = (params) => {
  return Fetch<TResult>('/pay/merchantGiveUser', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

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
 * 获取鲸币赠送/收回详情
 * @param filterParams
 */
export const getApplyDetail = (id) => {
  return Fetch<TResult>(`/claims-coin/getApplyDetail/${id}`, {
    method: 'GET'
  });
};

/**
 * 获取鲸币明细详情
 */
export const getRecordDetail = (orderId: string) => {
  return Fetch<TResult>(`/claims-coin/record/${orderId}`, {
    method: 'GET'
  });
};

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
