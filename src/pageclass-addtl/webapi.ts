import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 获取通栏详情
 */
export const getActivityDetail = (activityId) => {
  return Fetch<TResult>('/home/page/advertising/get-by-id/', {
    method: 'POST',
    body: JSON.stringify(activityId)
  });
};

/**
 * 新增优惠券活动
 */
export const addCouponActivity = (params) => {
  return Fetch<TResult>('/home/page/advertising', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 修改优惠券活动
 */
export const modifyCouponActivity = (params) => {
  return Fetch<TResult>('/home/page/advertising', {
    method: 'PUT',
    body: JSON.stringify(params)
  });
};

/**
 * 查询活动（注册赠券活动、进店赠券活动）不可用的时间范围
 */
export const queryActivityEnableTime = (activityId) => {
  return Fetch<TResult>(`/home/page/advertising/get-by-id/${activityId}`);
};
