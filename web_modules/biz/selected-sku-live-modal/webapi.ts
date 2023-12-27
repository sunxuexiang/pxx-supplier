import { Fetch } from 'qmkit';
type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 查询全部品牌
 * @returns {Promise<IAsyncResult<T>>}
 */
export const fetchBrandList = () => {
  return Fetch<TResult>('/goods/allGoodsBrands', {
    method: 'GET'
  });
};

/**
 * 查询全部分类
 * @returns {Promise<IAsyncResult<T>>}
 */
export const fetchCateList = () => {
  return Fetch<TResult>('/goods/goodsCatesTree', {
    method: 'GET'
  });
};

/**
 * 查询商品列表
 * @returns {Promise<IAsyncResult<T>>}
 */
export const fetchGoodsList = (params) => {
  return Fetch('/liveStream/goodsSkuLists', {
    method: 'POST',
    body: JSON.stringify({ ...params })
  });
};

/**
 * 散批查询商品列表
 * @returns {Promise<IAsyncResult<T>>}
 */
 export const batchGoodsList = (params) => {
  return Fetch('/boss/retail/goods/spus', {
    method: 'POST',
    body: JSON.stringify({ ...params })
  });
};


/**
 * 仓库列表
 * @param params
 */
 export const wareHousePage = (params) => {
  return Fetch<TResult>('/ware/house/page', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
};
