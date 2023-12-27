import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 支付
 */
export function adActivityPay(filterParams) {
  return Fetch<TResult>('/advertising/adActivity/pay', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

/**
 * 查询广告
 */
export function fetchAd(id) {
  return Fetch<TResult>(`/advertising/adActivity/getById?id=${id}`);
}
