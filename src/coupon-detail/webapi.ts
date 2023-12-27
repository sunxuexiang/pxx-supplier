import { Fetch } from 'qmkit';



type TResult = {
  code: string;
  message: string;
  context: Array<any>;
};
export const fetchCouponInfo = (couponId: string) => {
  return Fetch<TResult>(`/coupon-info/${couponId}`);
};

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