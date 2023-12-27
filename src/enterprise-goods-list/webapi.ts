import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
  errorData: any;
};

/**
 * 企业购商品列表
 * @param params
 */
const goodsList = (params) => {
  const request = {
    method: 'POST',
    body: JSON.stringify({ ...params })
  };
  return Fetch<TResult>('/enterprise/goodsInfo/page', request);
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
 * 查询全部店铺分类
 * @returns {Promise<IAsyncResult<T>>}
 */
const getCateList = () => {
  return Fetch('/storeCate', {
    method: 'GET'
  });
};

/**
 * 删除企业购商品
 * @param params
 */
const delDistributionGoods = (goodsInfoId, goodsInfoNo) => {
  return Fetch<TResult>('/enterprise/delete', {
    method: 'POST',
    body: JSON.stringify({ goodsInfoId: goodsInfoId })
  });
};

/**
 * 批量添加企业购商品
 * @param goodsInfos
 */
const addDistributionGoods = (goodsInfos) => {
  return Fetch<TResult>('/enterprise/batchAdd', {
    method: 'POST',
    body: JSON.stringify({ batchEnterPrisePriceDTOS: goodsInfos })
  });
};

/**
 * 编辑企业购商品佣金
 * @param params
 */
const modifyEnterpriseGoodsPrice = (params) => {
  return Fetch<TResult>('/enterprise/modify', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

export {
  goodsList,
  getBrandList,
  getCateList,
  delDistributionGoods,
  addDistributionGoods,
  modifyEnterpriseGoodsPrice
};
