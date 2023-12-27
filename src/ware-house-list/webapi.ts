import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 查询列表
 */
export function getPage(params) {
  return Fetch<TResult>('/ware/house/page', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 单个查询
 */
export function getById(id) {
  return Fetch<TResult>(`/ware/house/${id}`, {
    method: 'GET'
  });
}

/**
 * 添加
 */
export function add(info) {
  return Fetch<TResult>('/ware/house/add', {
    method: 'POST',
    body: JSON.stringify(info)
  });
}

/**
 * 修改
 */
export function modify(info) {
  return Fetch<TResult>('/ware/house/modify', {
    method: 'PUT',
    body: JSON.stringify(info)
  });
}

/**
 * 设为默认
 */
export function onDefault(info) {
  return Fetch<TResult>('/ware/house/modify-default-flag', {
    method: 'PUT',
    body: JSON.stringify(info)
  });
}

/**
 * 单个删除
 */
export function deleteById(info) {
  return Fetch<TResult>('/ware/house/delete-by-id', {
    method: 'POST',
    body: JSON.stringify(info)
  });
}

/**
 * 查询已经被选中的区域Ids
 */
export function fetchSelectedAreaIds(info) {
  return Fetch<TResult>('/ware/house/selected/area', {
    method: 'POST',
    body: JSON.stringify(info)
  });
}
/**
 * 新增仓库
 */
export function addNewWarehouse(info) {
  return Fetch<TResult>('/ware/house/add', {
    method: 'POST',
    body: JSON.stringify(info)
  });
}
