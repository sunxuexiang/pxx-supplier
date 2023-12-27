import { Fetch } from 'qmkit';

/**
 * 获取优惠券列表
 */
export function couponList(params) {
  return Fetch<TResult>('/coupon-info/page', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
}

/**
 * 删除优惠券
 */
export function deleteCoupon(id) {
  return Fetch<TResult>(`/coupon-info/${id}`, { method: 'DELETE' });
}

/**
 * 复制优惠券
 */
export function copyCoupon(id) {
  return Fetch<TResult>(`/coupon-info/copy/${id}`, { method: 'GET' });
}
