import { Fetch } from 'qmkit';

/**
 * 商户充值鲸币，调用接口返回支付宝/微信充值二维码
 */
export const fetchQRcode = (params) => {
  return Fetch<TResult>('/pay/performAlipayRecharge', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 添加 腾讯 Im 账号
 */
export const addImAccount = (params) => {
  return Fetch<TResult>('/imOnlineService/web/addImAccount', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 获取腾讯 Im 签名
 */
export const fetchImSign = (params) => {
  return Fetch<TResult>('/imOnlineService/web/imSign', {
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
 * 结果
 * @param checkState
 * @param customerIds
 * @returns {Promise<IAsyncResult<T>>}
 */
type TResult = {
  code: string;
  message: string;
  context: any;
};
