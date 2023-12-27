import { Fetch } from 'qmkit';
type TResult = {
  code: string;
  message: string;
  context: any;
};
/**
 * 获取登录签名
 * @param storeId
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function getLoginSignature(params = {}) {
  return Fetch<TResult>('/imCustomerService/tencentIm/userSig', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 获取客服登录状态
 * @param params {phoneNo: string | number}
 * @returns { Promise<IAsyncResult<TResult>> }
 */
export function getImAccountLoginState(params: { phoneNo: string | number }) {
  return Fetch<TResult>('/customerAccount/getImAccountLoginState', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 获取接收离线消息的账号列表
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function offlineAccountList() {
  return Fetch<TResult>('/serviceSetting/getList', {
    method: 'POST',
    body: JSON.stringify({ settingType: 4 })
  });
}
