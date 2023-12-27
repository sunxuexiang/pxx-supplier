import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 商品列表
 * @param params
 */
const goodsList = params => {
  const request = {
    method: 'POST',
    body: JSON.stringify(params)
  };
  return Fetch<TResult>(`/goods/spus`, request);
};

/**
 * spu删除
 * @param params
 */
const spuDelete = (params: { goodsIds: string[] }) => {
  const request = {
    method: 'DELETE',
    body: JSON.stringify(params)
  };
  return Fetch('/goods/spu', request);
};

/**
 * 查询全部签约的品牌
 * @returns {Promise<IAsyncResult<T>>}
 */
const getBrandList = () => {
  return Fetch('/contract/goods/brand/list', {
    method: 'GET'
  });
};

/**
 * 查询全部分类
 * @returns {Promise<IAsyncResult<T>>}
 */
const getCateList = () => {
  return Fetch('/storeCate', {
    method: 'GET'
  });
};

export { goodsList, spuDelete, getBrandList, getCateList };
