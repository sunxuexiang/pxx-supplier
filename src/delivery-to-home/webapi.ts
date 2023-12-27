import { Fetch } from 'qmkit';
type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 获取规则
 * @param pageType 1: 同城配送 0：快递到家
 * @returns Promise<TResult>
 */
// export function fetchInfo(pageType = 0) {
//   return Fetch<TResult>(
//     `/freighttemplatedeliveryarea/${
//       pageType == 1 ? 'queryIntraCityLogistics' : 'queryPaidExpress'
//     }`
//   );
// }
export function fetchInfo() {
  return Fetch<TResult>('/freighttemplatedeliveryarea/queryPaidExpress');
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
