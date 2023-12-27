import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 物流信息
 * @param code
 * @param id
 * @returns {Promise<Result<T>>}
 */
export const fetchDeliveryDetail = (params) => {
  return Fetch<TResult>('/trade/deliveryInfos', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};
