import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
};

/**
 * 查询线下付款账户
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function fetchAccounts() {
  return Fetch<TResult>(`/account/offlineValidAccounts`);
}

/**
 * 查询用户收款账号
 * @param customerId
 * @returns {Promise<IAsyncResult<T>>}
 */
export function fetchCustomerAccounts(customerId: string) {
  return Fetch(`/customer/accountList/${customerId}`);
}

/**
 * 保存
 * @param refundForm
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function save(refundForm: any) {
  return Fetch<TResult>(`/account/refundBill`, {
    method: 'POST',
    body: JSON.stringify(refundForm)
  });
}
