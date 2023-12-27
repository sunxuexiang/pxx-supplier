import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
};

/**
 * 查询
 */
export function getById(params) {
  return Fetch<TResult>('/liveStream/ruleInfo', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 直播活动记录列表
 */
export function saveRule(params) {
  return Fetch<TResult>('/liveStream/saveRule', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}
