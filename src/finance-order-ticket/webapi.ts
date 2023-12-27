import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 分页查询订单开票
 * @param param
 * @returns {Promise<IAsyncResult<T>>}
 */
export function fetchOrderInovices(param = {}) {
  return Fetch<TResult>(`/account/orderInvoices`, {
    method: 'POST',
    body: JSON.stringify(param)
  });
}

/**
 * 判断订单是否有开票信息
 * @param orderNo
 * @returns {Promise<IAsyncResult<T>>}
 */
export function isOpenOrderInovice(orderNo: string) {
  return Fetch(`/account/orderInvoice/${orderNo}`);
}

/**
 * 查询开票详情
 * @param orderNo
 * @returns {Promise<IAsyncResult<T>>}
 */
export function fetchOrderInvoiceDetail(orderNo: string) {
  return Fetch<TResult>(`/account/orderInvoiceDetail/${orderNo}`);
}

/**
 * 新增开票记录
 * @param orderInvoiceForm
 * @returns {Promise<IAsyncResult<T>>}
 */
export function createOrderInvoice(orderInvoiceForm: {}) {
  return Fetch(`/account/orderInvoice`, {
    method: 'POST',
    body: JSON.stringify(orderInvoiceForm)
  });
}

/**
 * 订单批量/单个开票
 * @param orderInvoiceIds
 * @returns {Promise<IAsyncResult<T>>}
 */
export function openOrderInvocies(orderInvoiceIds: string[]) {
  return Fetch(`/account/orderInvoiceState`, {
    method: 'POST',
    body: JSON.stringify({
      orderInvoiceIds: orderInvoiceIds
    })
  });
}

/**
 * 作废开票记录
 * @param invoiceId
 * @returns {Promise<IAsyncResult<T>>}
 */
export function destoryOrderInvoice(invoiceId: string) {
  return Fetch(`/account/orderInvoice/${invoiceId}`, {
    method: 'PUT',
    body: JSON.stringify({})
  });
}

export function exportOrderInvoice(orderInvoiceIds: string[]) {
  return Fetch(`/account/orderInvoices/export`, {
    method: 'POST',
    body: JSON.stringify({
      orderInvoiceIds: orderInvoiceIds
    })
  });
}

type TInvoiceProject = {
  projectId: string;
  projectName: string;
};

/**
 * 查询开票项管理
 * @returns {Promise<IAsyncResult<Array<TInvoiceProject>>>}
 */
export const fetchInvoiceProjects = () => {
  return Fetch<Array<TInvoiceProject>>('/account/invoiceProjects');
};

/**
 * 查询会员收件地址
 */
export const fetchAddressInfos = (customerId: string) => {
  return Fetch<TResult>(`/customer/addressList/${customerId}`);
};

/**
 * 查询订单开票详情
 * @param invoiceId
 * @returns {Promise<IAsyncResult<T>>}
 */
export const fetchInvoiceView = (invoiceId: string) => {
  return Fetch<TResult>(`/account/orderInvoice/${invoiceId}`);
};

/**
 * 查询订增专资质状态
 * @returns {Promise<IAsyncResult<T>>}
 */
export const invoiceConfig = () => {
  return Fetch(`/customer/invoiceConfig`);
};
