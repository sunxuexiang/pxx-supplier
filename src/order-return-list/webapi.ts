import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

type DeliverParam = {
  logisticCompanyCode: string;
  logisticCompany: string;
  logisticNo: string;
  date: string;
};

export const fetchOrderReturnList = (filter = {}) => {
  return Fetch<TResult>('/return', {
    method: 'POST',
    body: JSON.stringify(filter)
  });
};

/**
 * 批量审核
 * @param rids
 * @returns {Promise<IAsyncResult<T>>}
 */
export const batchAudit = (rids) => {
  return Fetch<TResult>('/return/audit', {
    method: 'POST',
    body: JSON.stringify({
      rids
    })
  });
};

/**
 * 审核
 * @param rid
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const audit = (rid: string) => {
  return Fetch<TResult>(`/return/audit/${rid}`, { method: 'POST' });
};

/**
 * 驳回
 * @param rid
 * @param reason
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const reject = (rid: string, reason: string) => {
  return Fetch<TResult>(`/return/cancel/${rid}?reason=${reason}`, {
    method: 'POST'
  });
};

/**
 * 填写物流信息
 * @param rid
 * @param values
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const deliver = (rid: string, values: DeliverParam) => {
  return Fetch<TResult>(`/return/deliver/${rid}`, {
    method: 'POST',
    body: JSON.stringify({
      code: values.logisticCompanyCode || '',
      company: values.logisticCompany,
      no: values.logisticNo,
      createTime: values.date
    })
  });
};

/**
 * 收货
 * @param rid
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const receive = (rid: string) => {
  return Fetch<TResult>(`/return/receive/${rid}`, { method: 'POST' });
};

/**
 * 收货
 * @param ids
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const batchReceive = (rids) => {
  return Fetch<TResult>('/return/receive/', {
    method: 'POST',
    body: JSON.stringify({ rids })
  });
};

/**
 * 拒绝收货
 * @param rid
 * @param reason
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const rejectReceive = (rid: string, reason: string) => {
  return Fetch<TResult>(`/return/receive/${rid}/reject`, {
    method: 'POST',
    body: JSON.stringify({ reason: reason })
  });
};

/**
 * 校验退款单的状态，是否已经在退款处理中
 * @param {string} rid
 * @returns {Promise<IAsyncResult<any>>}
 */
export const checkRefundStatus = (rid: string) => {
  return Fetch(`/return/verifyRefundStatus/${rid}`);
};

/**
 * 验证用户是否有该接口权限
 */
export const checkFunctionAuth = (urlPath: string, requestType: string) => {
  return Fetch<TResult>('/check-function-auth', {
    method: 'POST',
    body: JSON.stringify({
      urlPath,
      requestType
    })
  });
};

/**
 * 线上退款
 * @param rid
 */
export const refundOnline = (rid: string, params = {}) => {
  // return Fetch<TResult>(`/return/refund/${rid}/online`, {
  return Fetch<TResult>(`/return/edit/price/${rid}`, {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 线下退款
 * @param rid
 * @param params
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const refundOffline = (rid: string, params = {}) => {
  return Fetch<TResult>(`/return/refund/${rid}/offline`, {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 拒绝退款
 * @param rid
 * @param reason
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const rejectRefund = (rid: string, reason: string) => {
  return Fetch<TResult>(`/return/refund/${rid}/reject`, {
    method: 'POST',
    body: JSON.stringify({ reason: reason })
  });
};
