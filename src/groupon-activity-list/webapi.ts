import { Fetch } from 'qmkit';

/**
 * 获取分页列表
 */
export const getPageList = (filterParams = {}) => {
  return Fetch('/groupon/activity/page', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
};

/**
 * 删除
 * @param grouponActivityId
 * @returns {Promise<IAsyncResult<any>>}
 */
export const del = (grouponActivityId) => {
  return Fetch('/groupon/activity/delete-by-id', {
    method: 'POST',
    body: JSON.stringify({ grouponActivityId: grouponActivityId })
  });
};

/**
 * 获取所有拼团分类
 * @returns {Promise<IAsyncResult<T>>}
 */
export const getGrouponCateList = () => {
    return Fetch<TResult>('/groupon/cate/list');
};
