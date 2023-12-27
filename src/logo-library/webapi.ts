import { Fetch } from 'qmkit';
type TResult = {
  code: string;
  message: string;
  context: any;
};
/**
 * 获取logo类目列表
 */
export const getLogoCates = () => {
  return Fetch('/store/resourceCates');
};
/**
 * 分页获取logo列表
 * @param param
 * @returns {Promise<IAsyncResult<T>>}
 */
export function getLogoList(params = {}) {
  return Fetch<TResult>('/store/resources', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}
/**
 * 上传logo
 * @param param
 * @returns {Promise<IAsyncResult<T>>}
 */
export function uploadLogo(params = {}) {
  return Fetch<TResult>('/store/uploadStoreResource', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}
/**
 * 修改logo名称
 * @param param
 * @returns {Promise<IAsyncResult<T>>}
 */
export function editLogo(params = {}) {
  return Fetch<TResult>('/store/resource', {
    method: 'PUT',
    body: JSON.stringify(params)
  });
}
/**
 * 修改logo名称
 * @param param
 * @returns {Promise<IAsyncResult<T>>}
 */
export function delLogoData(params = {}) {
  return Fetch<TResult>('/store/resource', {
    method: 'DELETE',
    body: JSON.stringify(params)
  });
}
