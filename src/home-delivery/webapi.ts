import { Fetch } from 'qmkit';

/**
 * 保存地址信息
 */
export function save(params) {
  return Fetch('/freighttemplatedeliveryarea/save', {
    method: 'POST',
    body: JSON.stringify({ ...params })
  });
}

/**
 * 初始化地址信息
 */
export function query() {
  return Fetch<any>('/freighttemplatedeliveryarea/query', {
    method: 'GET'
  });
}
