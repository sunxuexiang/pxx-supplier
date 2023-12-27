import { Fetch } from 'qmkit';
type TResult = {
  code: string;
  message: string;
  context: any;
};
/**
 * 获取推荐分类
 * @param param
 * @returns {Promise<IAsyncResult<T>>}
 */
export function getRecommendClassifiy(params = {}) {
  return Fetch<TResult>('/typeConfig/page', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}
/**
 * 获取所有店铺分类
 * @param param
 * @returns {Promise<IAsyncResult<T>>}
 */
export function getStoreCate() {
  return Fetch<TResult>('/storeCate');
}
/**
 * 批量新增推荐分类
 * @param param
 * @returns {Promise<IAsyncResult<T>>}
 */
export function addClassify(params = {}) {
  return Fetch<TResult>('/typeConfig/batachAdd', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}
/**
 * 批量删除分类
 * @param param
 * @returns {Promise<IAsyncResult<T>>}
 */
export function delClassify(params = {}) {
  return Fetch<TResult>('/typeConfig/delMerchantType', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}
/**
 * 分类排序
 * @param param
 * @returns {Promise<IAsyncResult<T>>}
 */
export function changeClassifySort(params = {}) {
  return Fetch<TResult>('/typeConfig/sort-recommend-cat', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}
