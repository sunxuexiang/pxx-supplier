import { Fetch } from 'qmkit';

/**
 * 获取活动列表
 */
export function activityList(params) {
  return Fetch<TResult>('/coupon-activity/page', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
}

/**
 * 开始活动
 */
export function startActivity(id) {
  return Fetch<TResult>(`/coupon-activity/start/${id}`, { method: 'PUT' });
}

/**
 * 暂停活动
 */
export function pauseActivity(id) {
  return Fetch<TResult>(`/coupon-activity/pause/${id}`, { method: 'PUT' });
}

/**
 * 删除活动
 */
export function deleteActivity(id) {
  return Fetch<TResult>(`/coupon-activity/${id}`, { method: 'DELETE' });
}

/**
 * 获取店铺客户等级列表
 */
export const getUserLevelList = () => {
  return Fetch<TResult>('/store/storeLevel/list', {
    method: 'GET'
  });
};

/**
 * 获取平台客户等级列表
 */
export const allCustomerLevel = () =>{
  return Fetch<TResult>('/store/storeLevel/listBoss');
}