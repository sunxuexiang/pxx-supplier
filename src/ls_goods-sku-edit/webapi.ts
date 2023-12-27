import { Fetch } from 'qmkit';

/**
 * 获取商品详情
 */
export const getGoodsDetail = (goodsId: string) => {
  return Fetch(`/retail/goods/sku/${goodsId}`);
};

/**
 * 获取用户等级列表
 */
export const getUserLevelList = () => {
  return Fetch('/store/storeLevel/list', {
    method: 'GET'
  });
};

/**
 * 查询平台客户等级列表
 */
export const getBossUserLevelList = () => {
  return Fetch('/store/storeLevel/listBoss', {
    method: 'GET'
  });
};

/**
 * 获取客户列表
 */
export const getUserList = (_customerName: any) => {
  return Fetch('/store/allCustomers', {
    method: 'POST'
  });
};

/**
 * 获取平台客户列表
 */
export const getBossUserList = () => {
  return Fetch('/store/allBossCustomers', {
    method: 'POST'
  });
};

/**
 * 获取平台客户列表
 */
export const getBossUserListByName = (customerName) => {
  return Fetch(`/store/bossCustomersByName/${customerName}`);
};

/**
 * 修改商品
 */
export const edit = (param: any) => {
  return Fetch('/retail/goods/sku', {
    method: 'PUT',
    body: JSON.stringify(param)
  });
};

/**
 * 修改商品
 */
export const editPrice = (param: any) => {
  return Fetch('/retail/goods/sku/price', {
    method: 'PUT',
    body: JSON.stringify(param)
  });
};

/**
 * 获取图片类目列表
 */
export const getImgCates = () => {
  return Fetch('/store/resourceCates');
};

/**
 * 分页获取图片列表
 * @param param
 * @returns {Promise<IAsyncResult<T>>}
 */
export function fetchImages(params = {}) {
  return Fetch('/store/resources', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 同步查询最新库存
 */
export const syncSkuStock = (param: any) => {
  return Fetch('/retail/goods/ware/stock/syncStock', {
    method: 'POST',
    body: JSON.stringify(param)
  });
};

/**
 * 同步查询最新库存
 */
export const syncErpGoodsWareStock = (param: any) => {
  return Fetch('/retail/goods/ware/stock/syncStockNew', {
    method: 'POST',
    body: JSON.stringify(param)
  });
};
