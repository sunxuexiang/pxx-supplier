import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 获取优惠券详情
 */
export const getActivityDetail = (activityId) => {
  return Fetch<TResult>(`/coupon-activity/${activityId}`);
};

/**
 * 检测商品重复
 */
 export const addCouponexists = (params) => {
  return Fetch<TResult>('/coupon-activity/sku/exists', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 新增优惠券活动
 */
export const addCouponActivity = (params) => {
  return Fetch<TResult>('/coupon-activity/add', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 修改优惠券活动
 */
export const modifyCouponActivity = (params) => {
  return Fetch<TResult>('/coupon-activity/modify', {
    method: 'PUT',
    body: JSON.stringify(params)
  });
};

/**
 * 查询活动（注册赠券活动、进店赠券活动）不可用的时间范围
 */
export const queryActivityEnableTime = (couponActivityType, activityId) => {
  if (!activityId) {
    activityId = '-1';
  }
  return Fetch<TResult>(
    `/coupon-activity/activity-disable-time/${couponActivityType}/${activityId}`
  );
};
/**
 * 查询店铺分类
 */
 export const fetchCates = () => {
  return Fetch<TResult>('/storeCate');
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
/**
 * 查询店铺签约的品牌
 */
 export const fetchBrands = () => {
  return Fetch<TResult>('/contract/goods/brand/list');
};
