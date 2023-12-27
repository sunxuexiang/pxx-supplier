import { Fetch } from 'qmkit';

/**
 * 获取退货方式
 */
export const getReturnWays = () => {
  return Fetch('/return/ways');
};

/**
 * 获取退货原因
 */
export const getReturnReasons = () => {
  return Fetch('/return/reasons');
};

/**
 * 获取订单详情
 */
export const getTradeDetail = (tid: string) => {
  return Fetch(`/return/trade/${tid}`);
};

/**
 * 提交申请
 */
export const addApply = (param: any) => {
  return Fetch('/return/add', {
    method: 'POST',
    body: JSON.stringify(param)
  });
};

/**
 * 查询退单列表
 */
export const fetchOrderReturnList = (tid) => {
  return Fetch(`/return/findCompletedByTid/${tid}`);
};
