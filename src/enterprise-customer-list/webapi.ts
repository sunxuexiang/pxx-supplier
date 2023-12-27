import { Fetch } from 'qmkit';

/**
 * 获取业务员自己的信息,用于判断是否业务员
 */
export function fetchMyselfInfo() {
  return Fetch<TResult>('/customer/employee/myself');
}

/**
 * 获取企业会员列表
 * @param filterParams
 */
export function fetchCustomerList(filterParams = {}) {
  return Fetch<TResult>('/enterpriseCustomer/page', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

/**
 * 获取boss所有业务员
 * @returns {Promise<IAsyncResult<T>>}
 */
export const fetchAllEmployee = () => {
  return Fetch('/customer/boss/allEmployees');
};

/**
 * 获取商家名称
 * @returns {Promise<IAsyncResult<T>>}
 */
export const getSupplierNameByCustomerId = (customerId) => {
  return Fetch<TResult>(`/customer/supplier/name/${customerId}`);
};

/**
 * 获取所有客户等级
 * @returns {Promise<IAsyncResult<T>>}
 */
export const fetchAllCustomerLevel = () => {
  return Fetch<TResult>('/customer/levellist');
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
export const saveCustomer = (customerForm) => {
  return Fetch<TResult>('/customer', {
    method: 'POST',
    body: JSON.stringify(customerForm)
  });
};

/**
 * 修改
 * @param customer
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const updateCustomer = (customer) => {
  return Fetch<TResult>('/customer', {
    method: 'PUT',
    body: JSON.stringify(customer)
  });
};

//禁用启用客户
export const batchAudit = (
  customerStatus: number,
  customerIds: Array<String>,
  forbidReason
) => {
  return Fetch<TResult>('/customer/detailState', {
    method: 'POST',
    body: JSON.stringify({
      customerIds,
      customerStatus,
      forbidReason
    })
  });
};

//审核客户状态，审核/驳回
export const updateCheckState = (
  checkState: number,
  customerId: String,
  rejectReason: String
) => {
  return Fetch<TResult>('/customer/customerState', {
    method: 'POST',
    body: JSON.stringify({
      customerId,
      checkState,
      rejectReason
    })
  });
};

//批量删除
export const batchDelete = (customerIds: Array<string>) => {
  return Fetch<TResult>('/customer', {
    method: 'DELETE',
    body: JSON.stringify({
      customerIds
    })
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
