import { Fetch } from 'qmkit';

/**
 * 查询列表
 */
export function getPage(params) {
  return Fetch<TResult>('/flashsalegoods/page', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 获取秒杀商品分类列表
 */
export const getCateList = () => {
  return Fetch('/flashsalecate/list', {
    method: 'POST',
    body: JSON.stringify({})
  });
};

/**
 * 修改
 */
export function modify(info) {
  return Fetch<TResult>('/flashsalegoods/modify', {
    method: 'PUT',
    body: JSON.stringify(info)
  });
}

/**
 * 单个删除
 */
export function deleteById(id) {
  return Fetch<TResult>(`/flashsalegoods/${id}`, {
    method: 'DELETE',
  });
}