import { Fetch } from 'qmkit';
import { IMap } from 'typings/globalType';
import { number } from 'prop-types';

type TParams = {
  //线下账户
  offLineAccountId: string;
  //支付单id
  payOrderId: string;
  createTime: string;
  //备注
  comment: string;
};

/**
 * 订单信息
 * @param tid 订单号
 */

export function fetchOrderDetail(tid: string) {
  return Fetch(`/supplier/newPileTrade/${tid}/detail`);
}

/**
 * 查询订单下的所有收款记录
 * @param orderNo 订单号
 */
export const payRecord = (orderNo: string) => {
  return Fetch(`/supplier/newPileTrade/${orderNo}/payOrder`);
};

/**
 * 查询订单下的所有提货记录
 * @param tid 订单号
 */
export const pickTrades = (tid: string) => {
  return Fetch(`/supplier/newPileTrade/${tid}/pickTrades`);
};

// ---------以上最新修改

export function addPay(params: TParams) {
  return Fetch<{ code: string; message: string }>('/account/receivable', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
}

/**
 * 查询订单是否需要审核
 */
export const getOrderNeedAudit = () => {
  return Fetch('/getSupplierOrderAudit');
};

/**
 *查询所有有效的线下账户
 */
type TAccount = {
  accountId: number;
  bankName: string;
  bankNo: string;
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

export function fetchOffLineAccout() {
  return Fetch<[TAccount]>('/account/offlineAccounts');
}

/**
 * 审核
 * @param tid
 * @param audit
 * @returns {Promise<IAsyncResult<TResult>>}
 */
type TResult = {
  code: string;
  message: string;
  context: Array<any>;
};

export const audit = (tid: string, audit: string, reason: string) => {
  return Fetch<TResult>(`/trade/audit/${tid}`, {
    method: 'POST',
    body: JSON.stringify({
      auditState: audit,
      reason: reason
    })
  });
};

export const deliver = (tid: string, formData: IMap) => {
  const request = {
    method: 'PUT',
    body: JSON.stringify(formData)
  };
  return Fetch<TResult>(`/trade/deliver/${tid}`, request);
};

export const pickUpCommit = (tradeId: string, pickUpCode: string) => {
  const request = {
    method: 'PUT',
    body: JSON.stringify({
      tradeId: tradeId,
      pickUpCode: pickUpCode
    })
  };
  return Fetch<TResult>('/pickuprecord/updatePickUpCode', request);
};

export const delivers = (tid: string, formData: IMap) => {
  const request = {
    method: 'PUT',
    body: JSON.stringify(formData)
  };
  return Fetch<TResult>(`/trade/provider/deliver/${tid}`, request);
};

export const confirm = (tid: string) => {
  return Fetch<TResult>(`/trade/confirm/${tid}`);
};

export const queryLogisticscompany = (urlType = 0) => {
  const request = {
    method: 'POST',
    body: JSON.stringify({})
  };
  return Fetch<TResult>(
    `/${urlType == 1 ? 'specifyLogistics' : 'logisticscompany'}/list`,
    request
  );
};

/**
 * 发货单作废
 * @param tid
 * @param tdId
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const obsoleteDeliver = (tid: string, tdId: string) => {
  return Fetch<TResult>(`/trade/deliver/${tid}/void/${tdId}`);
};

/**
 * 验证订单是否存在售后申请
 * @param tid
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const deliverVerify = (tid: string) => {
  return Fetch<TResult>(`/trade/deliver/verify/${tid}`);
};

/**
 * 回审
 */
export const retrial = (tid: string) => {
  return Fetch<TResult>(`/trade/retrial/${tid}`);
};

export function fetchLogistics() {
  return Fetch<TResult>('/store/expressCompany');
}

/**
 * 作废收款记录
 * @param payOrderId
 * @returns {Promise<IAsyncResult<T>>}
 */
export function destroyOrder(payOrderId: string) {
  return Fetch<TResult>(`/account/payOrder/destory/${payOrderId}`, {
    method: 'PUT'
  });
}

/**
 * 修改卖家备注
 */
export const remedySellerRemark = (tid: string, sellerRemark: string) => {
  const request = {
    method: 'POST',
    body: JSON.stringify({ sellerRemark })
  };
  return Fetch<TResult>(`/trade/remark/${tid}`, request);
};

/**
 * 修改卖家备注
 */
export const remedySelfSellerRemark = (tid: string, sellerRemark: string) => {
  const request = {
    method: 'POST',
    body: JSON.stringify({ buyerRemark: sellerRemark })
  };
  return Fetch<TResult>(`/trade/provider/remark/${tid}`, request);
};

/**
 * 验证
 * @param tid
 * @returns {Promise<IAsyncResult<T>>}
 */
export const verifyAfterProcessing = (tid: string) => {
  return Fetch<TResult>(`/return/find-all/${tid}`);
};

/**
 * 验证购买人
 * @param buyerId
 * @returns {Promise<IAsyncResult<T>>}
 */
export const verifyBuyer = (buyerId: string) => {
  return Fetch(`/customer/customerDelFlag/${buyerId}`);
};

/**
 * 批量确认
 * @param payOrderIds
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function payConfirm(payOrderIds: string[]) {
  return Fetch<TResult>('/account/confirm', {
    method: 'POST',
    body: JSON.stringify({
      payOrderIds: payOrderIds
    })
  });
}

export const updateTradeLogisticsCompany = (
  tradeId: string,
  companyId: string,
  areaInfo: string,
  urlType = 0
) => {
  const request = {
    method: 'PUT',
    body: JSON.stringify({
      tid: tradeId,
      companyId: companyId,
      areaInfo: areaInfo
    })
  };
  return Fetch<TResult>(
    `/${
      urlType == 1 ? 'specifyLogistics' : 'logisticscompany'
    }/updateTradeCompanyInfo`,
    request
  );
};
