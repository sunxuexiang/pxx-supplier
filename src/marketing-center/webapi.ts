import { Fetch } from 'qmkit';

/**
 * 查询直播功能状态
 */
export function liveStatus() {
  return Fetch<TResult>('/sysconfig/isOpen', {
    method: 'GET'
  });
}
