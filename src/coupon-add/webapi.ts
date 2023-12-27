import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 查询优惠券分类列表
 */
export const fetchCouponCate = () => {
  return Fetch('/coupon-cate/list');
};

/**
 * 查询店铺签约的品牌
 */
export const fetchBrands = () => {
  return Fetch<TResult>('/contract/goods/brand/list');
};

/**
 * 查询店铺分类
 */
export const fetchCates = () => {
  return Fetch<TResult>('/storeCate');
};

/**
 * 新增优惠券
 * @param params
 */
export const addCoupon = (params) => {
  return Fetch('/coupon-info', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 查询优惠券信息
 * @param couponId 优惠券Id
 */
export const fetchCoupon = (couponId) => {
  return Fetch(`/coupon-info/${couponId}`);
};

/**
 * 修改优惠券
 * @param params
 */
export const editCoupon = (params) => {
  return Fetch('/coupon-info', {
    method: 'PUT',
    body: JSON.stringify(params)
  });
};

/**
 * 查询商品列表
 * @returns {Promise<IAsyncResult<T>>}
 */
export const goodsList = (params) => {
  return Fetch<TResult>('/goods/skus', {
    method: 'POST',
    body: JSON.stringify({ ...params })
  });
};
