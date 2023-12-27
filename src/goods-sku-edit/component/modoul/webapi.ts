import { Fetch } from 'qmkit';
type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 查询商家店铺品牌
 * @returns {Promise<IAsyncResult<T>>}
 */
export const fetchBrandList = () => {
  return Fetch<TResult>('/contract/goods/brand/list', {
    method: 'GET'
  });
};

/**
 * 查询商家店铺全部分类
 * @returns {Promise<IAsyncResult<T>>}
 */
export const fetchCateList = () => {
  return Fetch<TResult>('/contract/goods/cate/list', {
    method: 'GET'
  });
};

/**
 * 查询商品列表
 * @returns {Promise<IAsyncResult<T>>}
 */
export const fetchGoodsList = (params) => {
  return Fetch('/goods/skus', {
    method: 'POST',
    body: JSON.stringify({ ...params })
  });
};
