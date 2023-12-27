import { Fetch } from 'qmkit';

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
  return Fetch<TResult>('/goods/distribution-sku', request);
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
 * 删除分销商品
 * @param params
 */
const delDistributionGoods = (goodsInfoId,goodsInfoNo) => {
  return Fetch<TResult>('/goods/distribution-del', {
    method: 'POST',
    body: JSON.stringify({ goodsInfoId: goodsInfoId,goodsInfoNo:goodsInfoNo })
  });
};

/**
 * 添加分销商品
 * @param goodsInfos
 */
const addDistributionGoods = (goodsInfos) => {
  return Fetch<TResult>('/goods/distribution-add', {
    method: 'POST',
    body: JSON.stringify({ distributionGoodsInfoModifyDTOS: goodsInfos })
  });
};

/**
 * 已审核通过 编辑分销商品佣金
 * @param params
 */
const modifyDistributionGoodsCommission = (params) => {
  return Fetch<TResult>('/goods/distribution-modify-commission', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 审核未通过或禁止分销的商品重新编辑后，状态为待审核
 * @param params
 */
const modifyDistributionGoods = (params) => {
  return Fetch<TResult>('/goods/distribution-modify', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 查询分销设置
 */
export const fetchSetting = () => {
  return Fetch<TResult>('/distribution-setting');
};

export {
  goodsList,
  getBrandList,
  getCateList,
  delDistributionGoods,
  addDistributionGoods,
  modifyDistributionGoodsCommission,
  modifyDistributionGoods
};
