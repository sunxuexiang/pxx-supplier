import { Fetch } from 'qmkit';

/**
 * 声明接口返回值
 */
type TResult = {
  code: string;
  message: string;
  context: {
    opLogPage: any;
  };
};

/**
 * 请求后台接口
 * @param filter
 */
export const fetchOperationLogList = (filter = {}) => {
  return Fetch<TResult>('/system/operationLog/queryOpLogByCriteria', {
    method: 'POST',
    body: JSON.stringify(filter)
  });
};
