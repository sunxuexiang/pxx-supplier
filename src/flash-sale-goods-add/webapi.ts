import { Fetch } from 'qmkit';


/**
 * 新增秒杀商品
 * @param params
 */
export const addFlashsaleGoods = (params: {}) => {
  return Fetch('/flashsalegoods/batchAdd', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 获取秒杀商品分类列表
 */
export const getCateList = () => {
  return Fetch('/flashsalecate/list', {
    method: 'POST',
    body: JSON.stringify({})
  });
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