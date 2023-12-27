import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 分页查询优惠券信息
 */
export const fetchCouponPage = (params) => {
  return Fetch<TResult>('/coupon-info/page', {
    method: 'POST',
    body: JSON.stringify({ ...params })
  });
};
