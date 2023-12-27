import { Fetch } from 'qmkit';

/**
 * 查询即将进行活动列表
 */
export function getSoonlist(params) {
  return Fetch<TResult>('/flashsaleactivity/soonlist', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 查询进行中活动列表
 */
export function getSaleList(params) {
  return Fetch<TResult>('/flashsaleactivity/salelist', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 查询已结束活动列表
 */
export function getEndList(params) {
  return Fetch<TResult>('/flashsaleactivity/endlist', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}
