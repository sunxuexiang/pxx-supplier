import { Fetch } from 'qmkit';
type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 获取规则
 * @returns Promise<TResult>
 */
export function fetchInfo(pageType = 0) {
  return Fetch<TResult>(
    `/freighttemplatedeliveryarea/${
      pageType == 1 ? 'queryIntraCityLogistics' : 'queryExpressArrived'
    }`
  );
}

/**
 * 保存规则
 */
export function saveInfo(params) {
  return Fetch<TResult>('/freighttemplatedeliveryarea/save', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}
