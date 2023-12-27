import { Fetch } from 'qmkit';

export function fetchEmployList(params = {}) {
  return Fetch<TResult>('/customer/employees', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
}

/**
 * 查询所有角色
 * @returns {Promise<IAsyncResult<T>>}
 */
export function fetchAllRoles() {
  return Fetch('/customer/employee/roles');
}

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
 * 删除
 * @param employeeId
 * @returns {Promise<IAsyncResult<T>>}
 */
export function deleteEmployeeByIds(employeeIds: string[]) {
  return Fetch<TResult>('/customer/employee', {
    method: 'DELETE',
    body: JSON.stringify({
      employeeIds: employeeIds
    })
  });
}

/**
 * 批量设为离职
 * @param employeeIds 
 */
export function batchDimissionEmployees(employeeIds: string[]) {
  return Fetch<TResult>('/customer/employee/batch/dimission', {
    method: 'POST',
    body: JSON.stringify({
      employeeIds: employeeIds,
      accountState:2
    })
  });
}

export function batchSetEmployee(employeeIds: string[]) {
  return Fetch<TResult>('/customer/employee/batch/setEmployee', {
    method: 'POST',
    body: JSON.stringify({
      employeeIds: employeeIds
    })
  });
}

/**
 * 启用客户
 * @param employeeIds
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function enableEmployee(employeeIds: string[]) {
  return Fetch<TResult>('/customer/employee/enable', {
    method: 'POST',
    body: JSON.stringify({
      employeeIds: employeeIds
    })
  });
}

/**
 * 禁用客户
 * @param employeeIds
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function disableEmployee(
  employeeId,
  accountDisableReason,
  accountState
) {
  return Fetch<TResult>('/customer/employee/disable', {
    method: 'POST',
    body: JSON.stringify({
      employeeId: employeeId,
      accountDisableReason: accountDisableReason,
      accountState: accountState
    })
  });
}

/**
 * 批量禁用客户
 * @param employeeIds
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function batchDisableEmployee(
  employeeIds,
  accountDisableReason,
  accountState
) {
  return Fetch<TResult>('/customer/employee/batch/disable', {
    method: 'POST',
    body: JSON.stringify({
      employeeIds: employeeIds,
      accountDisableReason: accountDisableReason,
      accountState: accountState
    })
  });
}

/**
 * 保存员工
 * @param employee
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function saveEmployee(employee) {
  return Fetch<TResult>('/customer/employee', {
    method: 'POST',
    body: JSON.stringify(employee)
  });
}

/**
 * 修改员工
 * @param employee
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function updateEmployee(employee) {
  return Fetch<TResult>('/customer/employee', {
    method: 'PUT',
    body: JSON.stringify(employee)
  });
}

/**
 * 根据姓名模糊查询5条业务员记录
 * @param params
 */
export function searchEmployees(params={}){
  return Fetch<TResult>('/customer/employee/name',{
    method:'POST',
    body:JSON.stringify({...params})
  });
};

export function getDepartTree(){
  return Fetch<TResult>('/department/get-department-tree', {
    method: 'POST',
    body:JSON.stringify({})
  });
}

/**
 * 批量调整部门
 * @param params 
 */
export function adjustDepartment(params){
  return Fetch<TResult>('/customer/employee/adjustDepartment', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
};

/**
 * 业务员交接
 */
export function connectEmployee(params){
  return Fetch<TResult>('/customer/employee/handoverEmployee', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
};

/**
 * 业务员激活
 * @param params 
 */
export function activateAccount(params){
  return Fetch<TResult>('/customer/activateAccount', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
};

export function countNum(){
  return Fetch<TResult>('/customer/employee/countNum');
}



