import { Fetch } from 'qmkit';



type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 分页
 */

export const fetchOrderList = (filter = {}) => {
  return Fetch<TResult>('/supplier/newPileTrade/page', {
    method: 'POST',
    body: JSON.stringify(filter)
  });
};


/**
 * 订单取消
 * @param tid
 */
 export const cancelOrder = (tid: string) => {
  return Fetch<TResult>(`/supplier/newPileTrade/cancel/${tid}`);
};


// --------


/**
 * 查询订单是否需要审核
 */
export const getOrderNeedAudit = () => {
  return Fetch<TResult>('/getSupplierOrderAudit');
};

/**
 * 批量审核
 * @param ids
 * @returns {Promise<IAsyncResult<T>>}
 */
export const batchAudit = (ids) => {
  return Fetch<TResult>('/pile/trade/audit', {
    method: 'POST',
    body: JSON.stringify({
      ids
    })
  });
};

/**
 * 审核
 * @param tid
 * @param audit
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const audit = (tid: string, audit: string, reason: string) => {
  return Fetch<TResult>(`/trade/audit/${tid}`, {
    method: 'POST',
    body: JSON.stringify({
      auditState: audit,
      reason: reason
    })
  });
};

/**
 * 回审
 */
export const retrial = (tid: string) => {
  return Fetch<TResult>(`/pile/trade/retrial/${tid}`);
};

export const confirm = (tid: string) => {
  return Fetch<TResult>(`/pile/trade/confirm/${tid}`);
};


/**
 * 验证订单是否存在售后申请
 * @param tid
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const deliverVerify = (tid: string) => {
  return Fetch<TResult>(`/pile/trade/deliver/verify/${tid}`);
};

/**
 * 验证购买人
 * @param buyerId
 * @returns {Promise<IAsyncResult<T>>}
 */
export const verifyBuyer = (buyerId: string) => {
  return Fetch(`/customer/customerDelFlag/${buyerId}`);
};
