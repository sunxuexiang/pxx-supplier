import { Fetch } from 'qmkit';

/**
 * 查询列表
 */
export function getPage(params) {
  return Fetch<TResult>('/stockoutmanage/page', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

export function getBrandList() {
  return Fetch<TResult>('/contract/goods/brand/list', {
    method: 'GET'
  });
}

/**
 * 单个查询
 */
export function getById(id) {
  return Fetch<TResult>(`/stockoutmanage/${id}`, {
    method: 'GET'
  });
}

/**
 * 添加
 */
export function add(info) {
  return Fetch<TResult>('/stockoutmanage/add', {
    method: 'POST',
    body: JSON.stringify(info)
  });
}

/**
 * 修改
 */
export function modify(info) {
  return Fetch<TResult>('/stockoutmanage/modify', {
    method: 'PUT',
    body: JSON.stringify(info)
  });
}

/**
 * 单个删除
 */
export function deleteById(id) {
  return Fetch<TResult>(`/stockoutmanage/${id}`, {
    method: 'DELETE'
  });
}

/**
 * 批量删除
 */
export function deleteByIdList(idList) {
  return Fetch<TResult>('/stockoutmanage/delete-by-id-list', {
    method: 'DELETE',
    body: JSON.stringify({ stockoutIdList: idList })
  });
}
