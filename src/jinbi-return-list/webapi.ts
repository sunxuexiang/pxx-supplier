import { Fetch } from 'qmkit';
import 'whatwg-fetch';
import { Const } from 'qmkit';
/**
 * 获取返鲸币列表
 * @param filterParams
 */
export function fetchList(filterParams = {}) {
  return Fetch<TResult>('/coinActivity/page', {
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
  return fetch(Const.HOST + '/coinActivity/export', {
    method: 'POST',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization:
        'Bearer' + ((window as any).token ? ' ' + (window as any).token : '')
    },
    body: JSON.stringify(params)
  })
    .then((res: any) => {
      console.log(res);
      return res.blob();
    })
    .catch((err) => {
      return err;
    });
};

export const exportDetail = (params) => {
  return fetch(Const.HOST + '/coinActivity/export/detail', {
    method: 'POST',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization:
        'Bearer' + ((window as any).token ? ' ' + (window as any).token : '')
    },
    body: JSON.stringify(params)
  })
    .then((res: any) => {
      console.log(res);
      return res.blob();
    })
    .catch((err) => {
      return err;
    });
};

/**
 * 终止活动
 * @param activityId
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const onTermination = (activityId) => {
  return Fetch<TResult>(`/coinActivity/termination/${activityId}`, {
    method: 'PUT'
  });
};

/**
 * 删除活动
 * @param activityId
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const deleteMarketing = (activityId) => {
  return Fetch<TResult>(`/coinActivity/${activityId}`, {
    method: 'DELETE'
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
