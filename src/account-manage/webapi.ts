import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
};

type TLogResult = {
  code: string;
  message: string;
  context: {
    logVOList: any[];
  };
};

/**
 * 查询员工账号
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function fetchEmployee() {
  return Fetch<TResult>('/customer/employee/info');
}

/**
 * 保存员工名称
 * @param employeeName
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function saveEmployeeName(employeeName: string) {
  return Fetch<TResult>('/customer/employeeName', {
    method: 'PUT',
    body: JSON.stringify({
      employeeName: employeeName
    })
  });
}

/**
 * 校验图形验证码
 * @param uuid uuid
 * @param enterValue enterValue
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function checkCaptcha(uuid: string, enterValue: string) {
  return Fetch<TResult>(`/check/captcha?uuid=${uuid}&enterValue=${enterValue}`);
}

/**
 * 发送短信
 * @param uuid uuid
 * @param phone phone
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function sendSms(uuid: string, phone: string) {
  return Fetch<TResult>(`/customer/send/sms?uuid=${uuid}&phone=${phone}`, {
    method: 'POST',
    body: JSON.stringify({})
  });
}

/**
 * 校验短信
 * @param phone
 */
export function validSms(phone: string, code: string) {
  return Fetch<TResult>(`/customer/sms/valid?phone=${phone}&code=${code}`, {
    method: 'POST',
    body: JSON.stringify({})
  });
}

/**
 *  bind手机
 * @param phone
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function sendBind(phone: string) {
  return Fetch<TResult>(`/customer/send/bind?phone=${phone}`, {
    method: 'POST',
    body: JSON.stringify({})
  });
}

/**
 * 查询登录日志
 * @returns {Promise<IAsyncResult<T>>}
 */
export function fetchLoginLogs() {
  return Fetch<TLogResult>('/system/operationLog');
}
