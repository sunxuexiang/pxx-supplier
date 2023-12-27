import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
};

export function fetchOrderDetail(tid: string) {
  return Fetch(`/trade/print/${tid}`);
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

/**
 * 打印次数计数
 */
export const setPrintCount = (id) => {
  return Fetch<TResult>(`/trade/print/count/${id}`);
};

/**
 * 获取面单信息
 * @param id ID
 * @returns Promise<TResult>
 */
export const orderGetWayBillNo = (id) => {
  return Fetch<TResult>(`/tmsApi/order/getWayBillNo/${id}`);
};
