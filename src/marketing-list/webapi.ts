import { Fetch } from 'qmkit';
import 'whatwg-fetch';
import { Const } from 'qmkit';
/**
 * 获取营销列表
 * @param filterParams
 */
export function fetchList(filterParams = {}) {
  return Fetch<TResult>('/marketing/list', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

/**
 * 导出
 * @param params
 */
//  export function exportParams(params) {
//   return Fetch<TResult>(`/marketing/export/params`, {
//     method: 'POST',
//     body: JSON.stringify({
//       ...params
//     }),
//     credentials: 'include'
//   });
// }

export const exportParams = (params) => {
  return fetch(Const.HOST + '/marketing/export/params', {
    method: 'POST',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization:'Bearer' + ((window as any).token ? ' ' + (window as any).token : '')
    },
    body: JSON.stringify(params)
  }).then((res: any) => {
    console.log(res)
    return res.blob();
  }).catch(err=>{
    return err;
  });
};

export const exportMarketing = (params) => {
  return fetch(Const.HOST + '/marketing/export/marketing', {
    method: 'POST',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization:'Bearer' + ((window as any).token ? ' ' + (window as any).token : '')
    },
    body: JSON.stringify(params)
  }).then((res: any) => {
    console.log(res)
    return res.blob();
  }).catch(err=>{
    return err;
  });
};

/**
 * 暂停营销
 * @param marketingId
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const pause = (marketingId) => {
  return Fetch<TResult>(`/marketing/pause/${marketingId}`, {
    method: 'PUT'
  });
};

/**
 * 终止营销
 * @param marketingId
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const onTermination = (marketingId) => {
  return Fetch<TResult>(`/marketing/termination/${marketingId}`, {
    method: 'PUT'
  });
};

/**
 * 开始营销
 * @param marketingId
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const start = (marketingId) => {
  return Fetch<TResult>(`/marketing/start/${marketingId}`, {
    method: 'PUT'
  });
};

/**
 * 删除营销
 * @param marketingId
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const deleteMarketing = (marketingId) => {
  return Fetch<TResult>(`/marketing/deleteMarketingById/${marketingId}`, {
    method: 'DELETE'
  });
};

/**
 * 获取店铺客户等级列表
 */
export const getUserLevelList = () => {
  return Fetch<TResult>('/store/storeLevel/list', {
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
