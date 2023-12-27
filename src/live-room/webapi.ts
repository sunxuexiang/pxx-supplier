import { Fetch } from 'qmkit';

//直播列表

/**
 * 查询列表
 */
export function getPage(params) {
  return Fetch<TResult>('/liveroom/page', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 单个查询
 */
export function getById(id) {
  return Fetch<TResult>(`/liveroom/${id}`, {
    method: 'GET'
  });
}

/**
 * 添加
 */
export function add(info) {
  return Fetch<TResult>('/liveroom/add', {
    method: 'POST',
    body: JSON.stringify(info)
  });
}

/**
 * 修改
 */
export function modify(info) {
  return Fetch<TResult>('/liveroom/modify', {
    method: 'PUT',
    body: JSON.stringify(info)
  });
}

/**
 * 单个删除
 */
export function deleteById(id) {
  return Fetch<TResult>(`/liveroom/${id}`, {
    method: 'DELETE'
  });
}

/**
 * 批量删除
 */
export function deleteByIdList(idList) {
  return Fetch<TResult>('/liveroom/delete-by-id-list', {
    method: 'DELETE',
    body: JSON.stringify({ idList: idList })
  });
}

//直播商品库

/**
 * 查询列表
 */
export function getLiveGoodsPage(params) {
  return Fetch<TResult>('/livegoods/page', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 单个查询
 */
export function getLiveGoodsById(id) {
  return Fetch<TResult>(`/livegoods/${id}`, {
    method: 'GET'
  });
}

/**
 * 添加
 */
export function addLiveGoods(info) {
  return Fetch<TResult>('/livegoods/add', {
    method: 'POST',
    body: JSON.stringify(info)
  });
}

/**
 * 修改
 */
export function modifyLiveGoods(info) {
  return Fetch<TResult>('/livegoods/modify', {
    method: 'PUT',
    body: JSON.stringify(info)
  });
}

/**
 * 单个删除
 */
export function deleteLiveGoodsById(id) {
  return Fetch<TResult>(`/livegoods/${id}`, {
    method: 'DELETE'
  });
}

/**
 * 批量删除
 */
export function deleteLiveGoodsByIdList(idList) {
  return Fetch<TResult>('/livegoods/delete-by-id-list', {
    method: 'DELETE',
    body: JSON.stringify({ idList: idList })
  });
}

/**
 * 申请开通
 */
export function livecompanyAdd(info) {
  return Fetch<TResult>('/livecompany/add', {
    method: 'POST',
    body: JSON.stringify(info)
  });
}

/**
 * 查询开通状态
 */
export function getlivecompanyById(id) {
  return Fetch<TResult>(`/livecompany/${id}`, {
    method: 'GET'
  });
}

/**
 * 直播间添加商品
 */
export function liveListGoodsAdd(info) {
  return Fetch<TResult>('/livegoods/add', {
    method: 'POST',
    body: JSON.stringify(info)
  });
}

/**
 * 审核未通过删除
 */
export function deleteLiveGoods(info) {
  return Fetch<TResult>('/livegoods/delete', {
    method: 'DELETE',
    body: JSON.stringify(info)
  });
}
