import { Fetch, Const } from 'qmkit';

/**
 * 获取返鲸币活动基础信息
 * @returns {Promise<IAsyncResult<T>>}
 */
export const fetchCoinInfo = (activityId) => {
  return Fetch<TResult>(`/coinActivity/${activityId}`);
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
 * 新增商品
 */
export const addGoods = (params) => {
  return Fetch<TResult>('/coinActivity/addActivityGoods', {
    method: 'PUT',
    body: JSON.stringify({
      ...params
    })
  });
};

export const oneGoodsTermination = (scope) => {
  return Fetch<TResult>('/coinActivity/termination/goods', {
    method: 'PUT',
    body: JSON.stringify(scope)
  });
};

/**
 * 查询领取记录
 * @param params
 * @returns {Promise<IAsyncResult<T>>}
 */
export function fetchcoupRecordList(params = {}) {
  return Fetch<TResult>('/coinActivity/record/page', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
}

export const exportRecords = (params) => {
  return fetch(Const.HOST + '/coinActivity/record/export', {
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
