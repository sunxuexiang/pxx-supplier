import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
};

/**
 * 查询基本信息
 */
export const fetchSetting = () => {
  return Fetch<TResult>('/store/storeBaseInfo');
};

/**
 * 修改基本信息
 */
export const editSetting = (params = {}) => {
  return Fetch<TResult>('/store/storeBaseInfo', {
    method: 'PUT',
    body: JSON.stringify({
      ...params
    })
  });
};
