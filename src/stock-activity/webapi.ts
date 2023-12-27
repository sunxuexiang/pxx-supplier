import { Fetch } from 'qmkit';


type TResult = {
  code: string;
  message: string;
  context: any;
};





/**
 * 获取活动列表
 */
export function pileActivityPage(params) {
  return Fetch<TResult>('/pileActivity/page', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
}


/**
 * 关闭活动
 * @returns {Promise<IAsyncResult<T>>}
 */
 export const pileActivityClose = reductionBean => {
  return Fetch<TResult>('/pileActivity/close/'+reductionBean.id, {
    method: 'PUT',
    body: JSON.stringify(reductionBean)
  });
};

// /**
//  * 开始活动
//  */
// export function startActivity(id) {
//   return Fetch<TResult>(`/coupon-activity/start/${id}`, { method: 'PUT' });
// }

// /**
//  * 暂停活动
//  */
// export function pauseActivity(id) {
//   return Fetch<TResult>(`/coupon-activity/pause/${id}`, { method: 'PUT' });
// }

// /**
//  * 删除活动
//  */
// export function deleteActivity(id) {
//   return Fetch<TResult>(`/coupon-activity/${id}`, { method: 'DELETE' });
// }

// /**
//  * 获取店铺客户等级列表
//  */
// export const getUserLevelList = () => {
//   return Fetch<TResult>('/store/storeLevel/list', {
//     method: 'GET'
//   });
// };

// /**
//  * 获取平台客户等级列表
//  */
// export const allCustomerLevel = () =>{
//   return Fetch<TResult>('/store/storeLevel/listBoss');
// }