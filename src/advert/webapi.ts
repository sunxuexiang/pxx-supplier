import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 查询可用的广告位时间
 */
export function queryAvailableTime(params) {
  return Fetch<TResult>('/advertising/adActivity/queryAvailableTime', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 提交广告
 */
export function saveAd(params) {
  return Fetch<TResult>('/advertising/adActivity/save', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 获取商城分类列表
 * @param params
 * @returns {Promise<IAsyncResult<T>>}
 */
export function getMallData(params = {}) {
  return Fetch<TResult>('/company/into-mall/supplier-tab/page', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 获取批发市场
 */
export const getMarkets = (params) => {
  return Fetch<TResult>('/company/into-mall/mall-market/page', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 查询鲸币账户余额
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function queryCustomerWallet(filterParams) {
  return Fetch<TResult>('/pay/queryCustomerWallet', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

/**
 * 查询广告
 */
export function fetchAd(id) {
  return Fetch<TResult>(`/advertising/adActivity/getById?id=${id}`);
}

/**
 * 支付
 */
export function adActivityPay(filterParams) {
  return Fetch<TResult>('/advertising/adActivity/pay', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
