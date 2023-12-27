import { Fetch } from 'qmkit';

/**
 * 优惠券活动列表
 */
export function getPage(params) {
  return Fetch<TResult>('/coupon-activity/page', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 查询优惠券信息
 */
export function fetchCouponActivity(params) {
  return Fetch<TResult>('/liveStream/activityInfo', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}
