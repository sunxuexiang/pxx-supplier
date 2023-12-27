import { Fetch } from 'qmkit';


/**
 * 查询等级列表
 */
export function fetchCustomerLevel() {
  return Fetch<TResult>('/store/storeLevel/list', {
    method: 'GET'
  });
}

/**
 * 查询平台等级列表
 */
export function fetchBossCustomerLevel() {
  return Fetch<TResult>('/store/storeLevel/listBoss', {
    method: 'GET'
  });
}

/**
 * 保存等级
 */
export function saveCustomerLevel(params) {
  return Fetch<TResult>('/store/storeLevel/add', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
}

/**
 * 编辑等级
 */
export function updateCustomerLevel(params) {
  return Fetch<TResult>('/store/storeLevel/modify', {
    method: 'PUT',
    body: JSON.stringify({
      ...params
    })
  });
}


/**
 * 删除等级
 */

export function deleteCustomerLevel(customerLevelId) {
  return Fetch<TResult>(`/store/storeLevel/deleteById/${customerLevelId}`, {
    method: 'DELETE'
  });
}


type TResult = {
  code: string;
  message: string;
  context: any;
};



export function infoCustomerLevel(customerLevelId) {
  return Fetch<TResult>('/storelevel/level/' + customerLevelId, {
    method: 'GET'
  });
}



