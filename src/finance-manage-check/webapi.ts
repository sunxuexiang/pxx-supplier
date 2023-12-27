/**
 * Created by feitingting on 2017/12/12.
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
 * 获取收入对账列表
 * @returns {Promise<IAsyncResult<T>>}
 */
export function fetchIncomeList(params: {}) {
  return Fetch<TResult>('/finance/bill/income', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 获取退款对账列表
 * @returns {Promise<IAsyncResult<T>>}
 */
export function fetchRefundList(params: {}) {
  return Fetch<TResult>('/finance/bill/refund', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 获取收入对账汇总
 * @returns {Promise<IAsyncResult<T>>}
 */
export function fetchIncomeTotal(params: {}) {
  return Fetch<TResult>('/finance/bill/income/gross', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 获取退款对账汇总
 * @returns {Promise<IAsyncResult<T>>}
 */
export function fetchRefundTotal(params: {}) {
  return Fetch<TResult>('/finance/bill/refund/gross', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}
