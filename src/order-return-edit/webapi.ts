import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 获取退货方式
 */
export const getReturnWays = () => {
  return Fetch<TResult>('/return/ways');
};

/**
 * 获取退货原因
 */
export const getReturnReasons = () => {
  return Fetch<TResult>('/return/reasons');
};

/**
 * 获取退货详情
 */
export const getReturnDetail = (rid: string) => {
  return Fetch(`/return/detail/${rid}`);
};

/**
 * 修改
 */
export const remedy = (param: any) => {
  return Fetch('/return/remedy', {
    method: 'POST',
    body: JSON.stringify(param)
  });
};

/**
 * 获取订单详情
 */
export const getTradeDetail = (tid: string) => {
  return Fetch<TResult>(`/return/trade/${tid}`);
};

/**
 * 查询退单列表
 */
export const fetchOrderReturnList = (tid) => {
  return Fetch(`/return/findByTid/${tid}`);
};

/**
 * 查询订单的可退金额
 * @param {string} rid
 * @returns {Promise<IAsyncResult<any>>}
 */
export const getCanRefundPrice = (rid: string) => {
  return Fetch(`/return/refundPrice/${rid}`);
};
