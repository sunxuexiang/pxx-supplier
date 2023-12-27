import { Fetch } from 'qmkit';

/**
 * 保存地址信息
 */
export function save(params) {
  return Fetch('/villages/address/batch-add', {
    method: 'POST',
    body: JSON.stringify([...params])
  });
}

/**
 * 获取乡镇是否重复
 */
export function checkaddressList(params) {
  return Fetch<TResult>('/villages/address/check-repeat-address', {
    method: 'POST',
    body: JSON.stringify([...params])
  });
}
/**
 * 初始化地址信息
 */
export function query() {
  return Fetch<any>('/villages/address/page', {
    method: 'POST'
  });
}
