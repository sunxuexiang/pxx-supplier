/**
 * Created by feitingting on 2017/8/14.
 */
import { Fetch } from 'qmkit';

/**
 * 注册
 * @param mobile
 * @param code
 * @param password
 * @returns {Promise<Result<T>>}
 */
export const register = (account, telCode, password) => {
  return Fetch('/company/register', {
    method: 'POST',
    body: JSON.stringify({
      account: account,
      password: password,
      verifyCode: telCode
    })
  });
};

/**
 * 发送手机验证码
 * @param tel
 * @returns {Promise<IAsyncResult<T>>}
 */
export const sendCode = (tel: string, type: Number) => {
  return Fetch(`/company/verify-code/${tel}/${type}`, {
    method: 'POST',
    body: JSON.stringify({})
  });
};

/**
 * 获取平台站点信息
 * @type {Promise<AsyncResult<T>>}
 */
export const getSiteInfo = () => {
  return Fetch('/baseConfig');
};

export const getBusinessConfig = () => {
  return Fetch('/business/config');
};
