import { Fetch, util } from 'qmkit';
type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 获取客户列表
 * @param filterParams
 */
export function fetchCustomerList(filterParams = {}) {
  let url = util.isThirdStore() ? '/customer/pageSupplier' : '/customer/pageBoss';
  return Fetch<TResult>(url, {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

/**
 * 获取所有业务员
 * @returns {Promise<IAsyncResult<T>>}
 */
export const fetchAllEmployee = () => {
  return Fetch<TResult>('/customer/employee/allEmployees');
};
/**
 * 获取平台所有业务员
 * @returns {Promise<IAsyncResult<T>>}
 */
export const fetchAllBossEmployee = () => {
  return Fetch('/customer/employee/allBossEmployees');
};

/**
 * 获取商家名称
 * @returns {Promise<IAsyncResult<T>>}
 */
export const getSupplierNameByCustomerId = (customerId) => {
  return Fetch<TResult>(`/customer/supplier/name/${customerId}`);
};

/**
 * 获取当前店铺所有客户等级
 * @returns {Promise<IAsyncResult<T>>}
 */
export const fetchAllCustomerLevel = () => {
  return Fetch<TResult>('/store/storeLevel/list');
};

/**
 * 获取当前平台所有客户等级
 * @returns {Promise<IAsyncResult<T>>}
 */
export const fetchAllBossCustomerLevel = () => {
  return Fetch<TResult>('/store/storeLevel/listBoss');
};
