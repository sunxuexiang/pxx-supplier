import { Fetch } from 'qmkit';
type TResult = {
  code: string;
  message: string;
  context: any;
};
/**
 * 获取平台类目
 */
export const getCateList = () => {
  return Fetch<TResult>('/contract/goods/cate/list');
};
/**
 * 获取商品品牌列表
 */
export const getBrandList = () => {
  return Fetch<TResult>('/contract/goods/brand/list');
};
/**
 * 获取商品属性
 */
export const getGoodsAttr = (params = {}) => {
  return Fetch<TResult>('/storeGoodsAttribute/list', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};
/**
 * 获取计量单位
 */
export const getGoodsUnit = (params = {}) => {
  return Fetch<TResult>('/goodsUnit/list', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};
/**
 * 获取商品分类列表
 */
export const getStoreCate = () => {
  return Fetch<TResult>('/storeCate');
};
/**
 * 根据属性生成表格
 * @param params
 * @returns {Promise<IAsyncResult<T>>}
 */
export function createTableByAttr(params = {}) {
  return Fetch<TResult>('/goods/getSkuInfo', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}
/**
 * 查询店铺运费模板
 * @param params
 */
export const getFreightList = () => {
  return Fetch<TResult>('/freightTemplate/freightTemplateGoods');
};
/**
 * 新增商品
 * @param params
 * @returns {Promise<IAsyncResult<T>>}
 */
export function addNewProduct(params = {}) {
  return Fetch<TResult>('/goods/addSpu', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}
/**
 * 获取商品详情
 */
export const getGoodsDetail = (goodsId: string) => {
  return Fetch<TResult>(`/goods/spu/${goodsId}`);
};
/**
 * 商品编辑
 */
export const saveProductInfo = (params = {}) => {
  // return Fetch<TResult>('/goods/spu', {
  //   method: 'PUT',
  //   body: JSON.stringify(params)
  // });
  const request = {
    method: 'PUT',
    body: JSON.stringify(params)
  };
  return Fetch<TResult>('/goods/spu', request);
};
/**
 * 上传富文本图片
 * @param params
 * @returns {Promise<IAsyncResult<T>>}
 */
export function uploadEditorImg(params = {}) {
  return Fetch<TResult>('/uploadImage4UEditor', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}