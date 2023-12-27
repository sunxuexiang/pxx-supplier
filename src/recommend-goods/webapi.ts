import { Fetch } from 'qmkit';
type TResult = {
  code: string;
  message: string;
  context: any;
};
/**
 * 获取推荐商品
 * @param param
 * @returns {Promise<IAsyncResult<T>>}
 */
export function getRecommendGoods(params = {}) {
  return Fetch<TResult>('/merchantConfig/page', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}
/**
 * 获取所有商品列表
 * @param param
 * @returns {Promise<IAsyncResult<T>>}
 */
export function getGoodsList(params = {}) {
  return Fetch<TResult>('/storeGoods/sku', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}
/**
 * 批量新增
 * @param param
 * @returns {Promise<IAsyncResult<T>>}
 */
export function addRecommendGoods(params = {}) {
  return Fetch<TResult>('/merchantConfig/batachAdd', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}
/**
 * 批量删除
 * @param param
 * @returns {Promise<IAsyncResult<T>>}
 */
export function delRecommendGoods(params = {}) {
  return Fetch<TResult>('/merchantConfig/delMerchantGoods', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}
/**
 * 获取平台类目
 */
export const getCateList = () => {
  return Fetch<TResult>('/storeCate', {});
};
/**
 * 获取商品品牌列表
 */
export const getBrandList = () => {
  return Fetch<TResult>('/contract/goods/brand/list');
};
/**
 * 商品排序
 * @param param
 * @returns {Promise<IAsyncResult<T>>}
 */
export function changeGoodsSort(params = {}) {
  return Fetch<TResult>('/merchantConfig/sortMerchantRecommendGoods', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}
