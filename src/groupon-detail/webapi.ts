import { Fetch } from 'qmkit';

/**
 * 查看拼团活动详情
 */
export const detail = (activityId) => {
  return Fetch(`/groupon/activity/${activityId}`, {
    method: 'GET'
  });
};

/**
 * 查看拼团活动订单列表
 */
export const fetchOrderPage = (params) => {
  return Fetch<TResult>('/trade/groupon/page', {
    method: 'POST',
    body: JSON.stringify({ ...params })
  });
};
