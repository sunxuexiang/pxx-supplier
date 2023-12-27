import { Fetch } from 'qmkit';
type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 获取商品
 * @returns {Promise<IAsyncResult<T>>}
 */
export const goodAnalysis = (val) => {
  return Fetch<TResult>(`/marketing/good/analysis/${val}`, {
    method: 'GET'
  });
};

/**
 * 错误提示
 * @returns {Promise<IAsyncResult<T>>}
 */
export const goodExcelErr = (val) => {
  return Fetch<TResult>(`/marketing/good/excel/err/${val}/123`, {
    method: 'GET'
  });
};

