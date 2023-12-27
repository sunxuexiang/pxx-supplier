import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
};

/**
 * 查询基本信息
 */
export const fetchSetting = () => {
  return Fetch<TResult>('/gatherBoxSet/info');
};

/**
 * 修改基本信息
 */
export const editSetting = (params = {}) => {
  return Fetch<TResult>('/gatherBoxSet/update', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
};
