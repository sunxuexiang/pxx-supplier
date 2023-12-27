import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 查询广告列表
 */
export function getPage(params) {
  return Fetch<TResult>('/advertising/adActivity/queryListPage', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 删除广告
 */
export function delAd(params) {
  return Fetch<TResult>('/advertising/adCreative/delete', {
    method: 'DELETE',
    body: JSON.stringify(params)
  });
}

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
