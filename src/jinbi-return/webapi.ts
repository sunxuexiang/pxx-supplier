import { Fetch } from 'qmkit';

/**
 * 新增返鲸币活动
 */
export const addCoinActivity = (params) => {
  return Fetch<TResult>('/coinActivity/add', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 结果
 * @param checkState
 * @param customerIds
 * @returns {Promise<IAsyncResult<T>>}
 */
type TResult = {
  code: string;
  message: string;
  context: any;
};
