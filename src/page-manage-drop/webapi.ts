import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: Array<any>;
};

/**
 * 修改弹窗
 * @param params
 * @returns {Promise<IAsyncResult<T>>}
 */
export function fetchDetail(params = {}) {
  return Fetch('/pageInfoExtend/query', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
}

/**
 * 编辑页面投放
 * @param params
 * @returns {Promise<IAsyncResult<T>>}
 */
export function updatePageInfo(params = {}) {
  return Fetch('/pageInfoExtend/modify', {
    method: 'PUT',
    body: JSON.stringify({
      ...params
    })
  });
}
