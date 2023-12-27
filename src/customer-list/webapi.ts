import { Fetch } from 'qmkit';

/**
 * 获取客户列表
 * @param filterParams
 */
export function fetchCustomerList(filterParams = {}) {
  return Fetch<TResult>('/customer/page', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

/**
 * 获取平台客户列表
 * @param filterParams
 */
export function fetchBossCustomerList(filterParams = {}) {
  return Fetch<TResult>('/customer/pageBoss', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

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

/**
 * 批量审核
 * @param checkState
 * @param customerIds
 * @returns {Promise<IAsyncResult<T>>}
 */
type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 新增
 * @param customer
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const saveCustomer = customerForm => {
  return Fetch<TResult>('/customer', {
    method: 'POST',
    body: JSON.stringify(customerForm)
  });
};

/**
 * 修改用户等级
 * @param customer
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const updateCustomerLevel = (customerId, customerLevel, employeeId) => {
  let params = `?customerLevelId=${customerLevel}`;
  if (employeeId) {
    params += `&employeeId=${employeeId}`;
  }
  return Fetch<TResult>(`/customer/level/${customerId}${params}`, {
    method: 'PUT'
  });
};

/**
 * 获取所有业务员
 * @returns {Promise<IAsyncResult<T>>}
 */
export const fetchAllEmployee = () => {
  return Fetch('/customer/employee/allEmployees');
};

/**
 * 获取平台所有业务员
 * @returns {Promise<IAsyncResult<T>>}
 */
export const fetchAllBossEmployee = () => {
  return Fetch('/customer/employee/allBossEmployees');
};

/**
 * 商家绑定平台用户
 * @param customer
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const addPlatformRelated = (customerId, customerLevel) => {
  const params = customerLevel ? `?customerLevelId=${customerLevel}` : '';
  return Fetch<TResult>(`/customer/related/${customerId}${params}`, {
    method: 'POST'
  });
};

/**
 * 商家删除与平台客户的关联
 * @param customer
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const deletePlatformCustomerRelated = customerId => {
  return Fetch<TResult>(`/customer/related/delete/${customerId}`, {
    method: 'DELETE'
  });
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
