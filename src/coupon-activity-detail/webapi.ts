import { Fetch } from 'qmkit';


type TResult = {
  code: string;
  message: string;
  context: Array<any>;
};
/**
 * 获取优惠券活动详情
 */
export function activityDetail(id) {
  return Fetch<TResult>(`/coupon-activity/${id}`);
}
/**
 * 查询退款单
 * @param params
 * @returns {Promise<IAsyncResult<T>>}
 */
 export function fetchcoupRecordList(params = {}) {
  return Fetch<TResult>('/coupon-code/getRecord', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
}