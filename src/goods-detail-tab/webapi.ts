import { Fetch } from 'qmkit';
import { IMap } from 'typings/globalType';

/**
 * 获取类目列表
 */
export const getStoreGoodsTabList = () => {
  return Fetch(`/storeGoodsTab`);
};

/**
 * 添加
 */
export const addTab = (formData: IMap) => {
  return Fetch(`/storeGoodsTab`, {
    method: 'POST',
    body: JSON.stringify(formData.toJS())
  });
};

/**
 * 删除
 */
export const deleteTabById = (tabId: string) => {
  return Fetch(`/storeGoodsTab/${tabId}`, {
    method: 'DELETE'
  });
};

/**
 * 修改
 */
export const editTab = (formData: IMap) => {
  return Fetch(`/storeGoodsTab`, {
    method: 'PUT',
    body: JSON.stringify(formData.toJS())
  });
};

/**
 * 设置排序
 * @param params
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const setSort = (params) => {
  return Fetch<TResult>(`/storeGoodsTab/editSort`, {
    method: 'PUT',
    body: JSON.stringify(params)
  });
};
