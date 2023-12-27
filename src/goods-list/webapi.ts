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
const goodsList = (params) => {
  const request = {
    method: 'POST',
    body: JSON.stringify(params)
  };
  return Fetch<TResult>('/goods/devaning/devanningSpus', request);
};

/**
 * 类目树形结构
 * /goods/goodsCatesTree 这个接口返回了类目的树形结构
 * /goods/goodsAllCatesTree
 * https://supplierbff-t.cjdbj.cn/contract/goods/cate/list?reqId=0.5781644060669615
 */
const goodsCatesTree = () => {
  return Fetch<TResult>('/contract/goods/cate/list', {
    method: 'GET'
  });
};
// /goods/spus
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
 * spu上架(批量)
 */
const spuOnSale = (params: { goodsIds: string[] }) => {
  const request = {
    method: 'PUT',
    body: JSON.stringify(params)
  };
  return Fetch('/goods/spu/sale', request);
};

/**
 * spu下架(批量)
 */
const spuOffSale = (params: { goodsIds: string[] }) => {
  const request = {
    method: 'DELETE',
    body: JSON.stringify(params)
  };
  return Fetch('/goods/spu/sale', request);
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

/**
 * 查询店铺运费模板
 * @param params
 */
const freightList = () => {
  return Fetch<TResult>('/freightTemplate/freightTemplateGoods');
};

/**
 * 查询单个运费模板信息
 * @param freightTempId
 */
const goodsFreight = (freightTempId) => {
  return Fetch<TResult>(
    `/freightTemplate/freightTemplateGoods/${freightTempId}`
  );
};

/**
 * 查询单个运费模板信息
 * @param freightTempId
 */
const goodsFreightExpress = (freightTempId) => {
  return Fetch<TResult>(
    `/freightTemplate/freightTemplateExpress/${freightTempId}`
  );
};

/**
 * 编辑运费模板(批量)
 */
const updateFreight = (params) => {
  const request = {
    method: 'PUT',
    body: JSON.stringify(params)
  };
  return Fetch('/goods/spu/freight', request);
};

/**
 * 设置商品序号
 */
const setGoodsSeqNum = (params) => {
  const request = {
    method: 'PUT',
    body: JSON.stringify(params)
  };
  return Fetch('/goods/supplier/spu/modifySeqNum', request);
};
/**
 * 查询品牌关联
 */
const searchBrandLink = (brandId) => {
  return Fetch<TResult>(`/goods/goodsBrand/${brandId}`);
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
 * 同步特价仓
 *
 */
const synchronizeSpecialGoods = () => {
  return Fetch<TResult>('/goods/syn/special', {
    method: 'GET'
  });
};

/**
 * 批量修改分类
 * /goods/spu/cate/batch
 *
 */
const batchCate = (params) => {
  return Fetch<TResult>('/goods/spu/cate/batch', {
    method: 'PUT',
    body: JSON.stringify(params)
  });
};
/**
 * 获取商品详情
 */
const getGoodsDetail = (goodsId: string) => {
  return Fetch(`/goods/sku/${goodsId}`);
};
/**
 * 批量上下架
 * /goods/spu/cate/batch
 *
 */
const goodsSpecificationOperate = (params) => {
  return Fetch<TResult>('/storeGoods/sku/sale', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 退货地址列表
 * @param params { storeId: string | number }
 * @returns Promise<TResult>
 */
export const getReturnAddressList = (params) => {
  return Fetch<TResult>('/company/into-mall/listReturnGoodsAddress', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

export {
  goodsList,
  spuOnSale,
  spuOffSale,
  spuDelete,
  getBrandList,
  getCateList,
  freightList,
  goodsFreight,
  goodsFreightExpress,
  updateFreight,
  setGoodsSeqNum,
  searchBrandLink,
  setGoodPrice,
  synchronizeSpecialGoods,
  goodsCatesTree,
  batchCate,
  getGoodsDetail,
  goodsSpecificationOperate
};
