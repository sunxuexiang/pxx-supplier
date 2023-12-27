import { Fetch } from 'qmkit';

/**
 * 查询列表
 */
export function getAllGoodsList(params) {
  return Fetch<TResult>('/livegoods/list', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 单个查询
 */
export function getById(id) {
  return Fetch<TResult>(`/livegoods/${id}`, {
    method: 'GET'
  });
}

/**
 * 添加
 */
export function add(info) {
  return Fetch<TResult>('/livegoods/add', {
    method: 'POST',
    body: JSON.stringify(info)
  });
}

/**
 * 修改
 */
export function modify(info) {
  return Fetch<TResult>('/livegoods/modify', {
    method: 'PUT',
    body: JSON.stringify(info)
  });
}

/**
 * 单个删除
 */
export function deleteById(id) {
  return Fetch<TResult>(`/livegoods/${id}`, {
    method: 'DELETE'
  });
}

/**
 * 批量删除
 */
export function deleteByIdList(idList) {
  return Fetch<TResult>('/livegoods/delete-by-id-list', {
    method: 'DELETE',
    body: JSON.stringify({ idList: idList })
  });
}

/**
 * 提交审核
 */
export function submit(params) {
  return Fetch<TResult>('/livegoods/supplier', {
    method: 'POST',
    body: JSON.stringify({ goodsInfoVOList: params })
  });
}
