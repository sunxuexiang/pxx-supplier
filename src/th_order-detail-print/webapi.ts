import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
};

export function fetchOrderDetail(tid: string) {
  return Fetch(`/pile/trade/print/${tid}`);
}

/**
 * 查询列表
 */
export function getList(params) {
  return Fetch<TResult>('/ware/house/list', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 查询打印配置
 */
export const fetchPrintSetting = () => {
  return Fetch<TResult>('/print/config/fetch');
};
