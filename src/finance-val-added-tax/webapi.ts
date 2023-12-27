import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

type TList = Array<{
  accountId: string;
  accountName: string;
  customerLevelName: string;
  customerName: string;
}>;

/**
 * 查询增值税资质审核
 * @param params
 * @returns {Promise<IAsyncResult<T>>}
 */
export function fetchInvoices(params = {}) {
  return Fetch<TResult>('/customer/invoices', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
}

/**
 * 批量操作
 * @param params
 * @returns {Promise<IAsyncResult<T>>}
 */
export function bathCheck(
  checkState: number,
  customerInvoiceIds: Array<number>
) {
  return Fetch<TResult>(`/customer/invoice/checklist`, {
    method: 'PUT',
    body: JSON.stringify({
      customerInvoiceIds,
      checkState
    })
  });
}

/**
 * 保存增专票
 * @param params
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function saveInvoice(params = {}) {
  return Fetch<TResult>(`/customer/invoice`, {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 批量作废
 * @param params
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function batchDestoryInvoice(ids: number[] = []) {
  return Fetch<TResult>(`/customer/invalidInvoice`, {
    method: 'PUT',
    body: JSON.stringify({
      customerInvoiceIds: ids
    })
  });
}

/**
 * 批量删除
 * @param ids ids
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function batchDeleteInvoice(ids: number[] = []) {
  return Fetch<TResult>(`/customer/invoices`, {
    method: 'DELETE',
    body: JSON.stringify({
      customerInvoiceIds: ids
    })
  });
}

/**
 * 查询增专票
 * @param id
 * @returns {Promise<IAsyncResult<T>>}
 */
export function findInvoiceById(id: number) {
  return Fetch(`/invoiceInfo/${id}`);
}

/**
 * 查询所有会员
 * @returns {Promise<IAsyncResult<TList>>}
 */
export const fetchAllCustomer = () => {
  return Fetch<TList>('/customer/list');
};

/**
 * 保存增专资质状态
 *
 * @param status status
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const saveInvoiceStatus = (status: number) => {
  return Fetch<TResult>(`/customer/invoiceConfig?status=${status}`, {
    method: 'POST',
    body: JSON.stringify({})
  });
};

/**
 * 查询订增专资质状态
 * @returns {Promise<IAsyncResult<T>>}
 */
export const invoiceConfig = () => {
  return Fetch(`/customer/invoiceConfig`);
};

/**
 * 根据id查询增专票
 * @param customerId
 * @returns {Promise<IAsyncResult<T>>}
 */
export const findInvoiceByCustomerId = (customerId: string) => {
  return Fetch(`/customer/invoice/${customerId}`);
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
