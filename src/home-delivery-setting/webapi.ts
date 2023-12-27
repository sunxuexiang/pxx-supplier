import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
};

export const fetchhomeDeliverySetting = () => {
  return Fetch('/homedelivery/list');
};

/**
 * 修改配送到家基本信息
 * @param params
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const editHomeDeliverySetting = (params = {}) => {
  return Fetch<TResult>('/homedelivery/modify', {
    method: 'PUT',
    body: JSON.stringify({
      ...params
    })
  });
};
