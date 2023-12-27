import { Fetch } from 'qmkit';
type TResult = {
  code: string;
  message: string;
  context: any;
};

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
 * 获取商品类目
 */
export const getCateList = () => {
  return Fetch<TResult>('/storeCate', {});
};

/**
 * 新增限购商品
 * @returns {Promise<IAsyncResult<T>>}
 */
export const addLimit = (params = {}) => {
  return Fetch<TResult>('/goods/area/limit/add', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 修改限购商品
 * @returns {Promise<IAsyncResult<T>>}
 */
export const updeteLimit = (params = {}) => {
  return Fetch<TResult>('/goods/area/limit/update', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 获取商品限购详情
 * @returns {Promise<IAsyncResult<T>>}
 */
export const fetchDetail = (goodsInfoId) => {
  return Fetch<TResult>(`/goods/area/limit/get/${goodsInfoId}`);
};
