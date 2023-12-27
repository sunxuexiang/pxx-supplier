import { QL } from 'plume2';

/**
 * 优惠券说明格式转换
 */
export const couponDescQL = QL('couponDescQL', [
  'couponDesc',
  (couponDesc) => {
    return couponDesc.replace(/\n/g, '<br/>');
  }
]);
