import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 获取限购商品列表
 * @returns {Promise<IAsyncResult<T>>}
 */
export const fetchList = (params = {}) => {
  return Fetch<TResult>('/goods/area/limit/page', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 删除限购商品
 * @returns {Promise<IAsyncResult<T>>}
 */
export const delLimit = (goodsInfoId) => {
  return Fetch<TResult>(`/goods/area/limit/delete/${goodsInfoId}`);
};
