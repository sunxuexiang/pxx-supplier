/**
 * Created by feitingting on 2017/12/13.
 */
import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 获取所有支付方式的枚举
 * @returns {Promise<IAsyncResult<T>>}
 */
export function fetchAllPayWays() {
  return Fetch<TResult>('/finance/bill/pay-methods');
}

/**
 * 获取收入明细
 * @param params
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function fetchIncomeDetail(params: {}) {
  return Fetch<TResult>('/finance/bill/income/details', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 获取退款明细
 * @param params
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function fetchRefundDetail(params: {}) {
  return Fetch<TResult>('/finance/bill/refund/details', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}
