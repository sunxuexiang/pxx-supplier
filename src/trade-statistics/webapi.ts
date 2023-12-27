/**
 * Created by feitingting on 2017/10/17.
 */
import { Fetch } from 'qmkit';

/**
 * 趋势图
 * @param params
 * @returns {Promise<IAsyncResult<T>>}
 */
export const getTradeView = (params = {}) => {
  return Fetch<TResult>(`/tradeReport/list`, {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 概况
 * @param params
 * @returns {Promise<IAsyncResult<T>>}
 */
export const getTradeGeneral = (params = {}) => {
  return Fetch<TResult>(`/tradeReport/overview`, {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 报表
 * @param params
 * @returns {Promise<IAsyncResult<T>>}
 */
export const getTradePage = (params = {}) => {
  return Fetch<TResult>(`/tradeReport/page`, {
    method: 'POST',
    body: JSON.stringify(params)
  });
};
