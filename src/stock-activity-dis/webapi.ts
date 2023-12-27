import { Fetch } from 'qmkit';


type TResult = {
  code: string;
  message: string;
  context: Array<any>;
};


/**
 * 详情
 * @returns {Promise<IAsyncResult<T>>}
 */
 export const pileActivityDis = (activityId) => {
  return Fetch<TResult>('/pileActivity/'+activityId, {
    method: 'GET'
  });
};


/**
 * 查询退款单
 * @param params
 * @returns {Promise<IAsyncResult<T>>}
 */
 export function pileActivityGoodsPage(params = {}) {
  return Fetch<TResult>('/pileActivity/goods/page', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
}