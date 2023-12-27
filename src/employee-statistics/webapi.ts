/**
 * Created by feitingting on 2017/10/21.
 */

import { Fetch } from 'qmkit';

/**
 * 业务员获客报表
 * @param params
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function getClientTable(params = {}) {
  return Fetch<TResult>('/view/employee/client', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
}

/**
 * 业务员业绩报表
 * @param params
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function getAchieveTable(params = {}) {
  return Fetch<TResult>('/view/employee/performance', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
}
