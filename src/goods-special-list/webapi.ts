import { Fetch, Const, util } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 分销商品列表
 * @param params
 */
const goodsList = (params) => {
  const request = {
    method: 'POST',
    body: JSON.stringify({ ...params })
  };
  return Fetch<TResult>('/goods/special-sku', request);
};

/**
 * 查询全部品牌
 * @returns {Promise<IAsyncResult<T>>}
 */
const getBrandList = () => {
  return Fetch('/goods/allGoodsBrands', {
    method: 'GET'
  });
};

/**
 * 查询全部分类
 * @returns {Promise<IAsyncResult<T>>}
 */
const getCateList = () => {
  return Fetch('/goods/goodsCatesTree', {
    method: 'GET'
  });
};

/**
 * 设价
 * @param params
 */
const setGoodPrice = (params) => {
  return Fetch<TResult>('/goods/special-setGoodPrice', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};
/**
 * sku上架(批量)
 */
const skuOnSale = (params: {
  goodsInfoIds: string[];
  goodsInfoType: number;
}) => {
  const request = {
    method: 'PUT',
    body: JSON.stringify(params)
  };
  return Fetch('/goods/sku/sale', request);
};

/**
 * sku下架(批量)
 */
const skuOffSale = (params: {
  goodsInfoIds: string[];
  goodsInfoType: number;
}) => {
  const request = {
    method: 'DELETE',
    body: JSON.stringify(params)
  };
  return Fetch('/goods/sku/sale', request);
};

/**
 * spu删除
 * @param params
 */
const spuDelete = (params: { goodsInfoIds: string[] }) => {
  const request = {
    method: 'DELETE',
    body: JSON.stringify(params)
  };
  return Fetch('/goods/sku', request);
};

/**
 * 同步特价仓
 *
 */
const synchronizeSpecialGoods = () => {
  return Fetch<TResult>('/goods/syn/special', {
    method: 'GET'
  });
};

/**
 * 根据店铺名称模糊查询店铺，Autocomplete
 * @param storeName
 * @returns {Promise<IAsyncResult<TResult>>}
 */
const queryStoreByName = (storeName: string) => {
  return Fetch<TResult>(`/store/name/?storeName=${storeName}`, {
    method: 'GET'
  });
};

export {
  goodsList,
  getBrandList,
  getCateList,
  spuDelete,
  setGoodPrice,
  queryStoreByName,
  skuOnSale,
  skuOffSale,
  synchronizeSpecialGoods
};
