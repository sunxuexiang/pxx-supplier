import { Fetch } from 'qmkit';

export const fetchOrderList = (filter = {}) => {
  return Fetch<TResult>('/trade/supplierPage', {
    method: 'POST',
    body: JSON.stringify(filter)
  });
};

type TResult = {
  code: string;
  message: string;
  context: any;
};

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
  return Fetch<TResult>('/trade/audit', {
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
  return Fetch<TResult>(`/trade/retrial/${tid}`);
};

export const confirm = (tid: string) => {
  return Fetch<TResult>(`/trade/confirm/${tid}`);
};
/**
 * 订单取消
 * @param tid
 */
export const cancelOrder = (tid: string) => {
  return Fetch<TResult>(`/trade/cancel/${tid}`);
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
 * 验证购买人
 * @param buyerId
 * @returns {Promise<IAsyncResult<T>>}
 */
export const verifyBuyer = (buyerId: string) => {
  return Fetch(`/customer/customerDelFlag/${buyerId}`);
};

/**
 * 仓库列表
 */
export const wareList = () => {
  return Fetch<TResult>('/ware/house/page', {
    method: 'POST',
    body: JSON.stringify({
      pageNum: 0,
      pageSize: 10
    })
  });
};

/**
 * 获取商家勾选的物流接口
 * @returns
 */
export const fetchCheckedExpress = () => {
  return Fetch<TResult>('/store/expressCompany');
};

/**
 * 订单发货提交接口
 * @returns
 */
export const supplierDeliver = (params, tid) => {
  return Fetch<TResult>(`/trade/supplier/deliver/${tid}`, {
    method: 'PUT',
    body: JSON.stringify(params)
  });
};

/**
 * 修改运单号提交接口
 * @returns
 */
export const updateLogistics = (params, tid) => {
  return Fetch<TResult>(`/trade/supplier/updateLogistics/${tid}`, {
    method: 'PUT',
    body: JSON.stringify(params)
  });
};

/**
 * 托运部公司列表接口
 * @returns
 */
export function getLogisticscompany(params, urlType = 0) {
  return Fetch<TResult>(
    `/${urlType == 1 ? 'specifyLogistics' : 'logisticscompany'}/page`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  );
}
/**
 * 接货点选项接口
 * @returns
 */
export const fetchMarketShipment = (marketId, carrierId) => {
  return Fetch<TResult>(
    `/trade/supplier/getSiteByCarrierId?marketId=${marketId}&carrierId=${carrierId}`
  );
};

/**
 * 预售到货
 * @returns
 */
export function deliverPresell(id) {
  return Fetch<TResult>(`/trade/deliverPresell/${id}`, {
    method: 'PUT'
  });
}

/**
 * 获取快递到家（自费）发货点列表
 */
export const fetchShippingAddress = () => {
  return Fetch<TResult>('/store/shippingAddress/get');
};
