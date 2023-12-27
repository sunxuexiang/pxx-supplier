import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 新增满减
 * @returns {Promise<IAsyncResult<T>>}
 */
export const addFullReduction = reductionBean => {
  return Fetch<TResult>('/marketing/fullReduction', {
    method: 'POST',
    body: JSON.stringify(reductionBean)
  });
};

/**
 * 编辑满减
 * @returns {Promise<IAsyncResult<T>>}
 */
export const updateFullReduction = reductionBean => {
  return Fetch<TResult>('/marketing/fullReduction', {
    method: 'PUT',
    body: JSON.stringify(reductionBean)
  });
};

/**
 * 草稿满减
 * @returns {Promise<IAsyncResult<T>>}
 */
 export const addDrafFullReduction = reductionBean => {
  return Fetch<TResult>('/marketing/fullReduction/draft', {
    method: 'POST',
    body: JSON.stringify(reductionBean)
  });
};

/**
 * 修改草稿满减
 * @returns {Promise<IAsyncResult<T>>}
 */
 export const updateDrafFullReduction = reductionBean => {
  return Fetch<TResult>('/marketing/fullReduction/draft', {
    method: 'PUT',
    body: JSON.stringify(reductionBean)
  });
};

