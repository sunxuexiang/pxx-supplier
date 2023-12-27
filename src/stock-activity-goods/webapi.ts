import { Fetch } from 'qmkit';


type TResult = {
  code: string;
  message: string;
  context: any;
};





/**
 * 获取商品列表
 */
export function pileActivityPage(params) {
  return Fetch<TResult>('/pileActivity/goods/page', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
}

/**
 * 添加商品
 */
 export function pileActivityGoodsAdd(params) {
  return Fetch<TResult>('/pileActivity/goods/add', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
}

/**
 * 删除商品
 * @returns {Promise<IAsyncResult<T>>}
 */
 export const pileActivityGoodsDel = reductionBean => {
  return Fetch<TResult>('/pileActivity/goods/delete', {
    method: 'DELETE',
    body: JSON.stringify(reductionBean)
  });
};


/**
 * 修改表格里库存
 * @returns {Promise<IAsyncResult<T>>}
 */
 export const pileActivityGoodsModify = reductionBean => {
  return Fetch<TResult>('/pileActivity/goods/modify', {
    method: 'PUT',
    body: JSON.stringify(reductionBean)
  });
};


/**
 * 查询全部品牌
 */
 export const fetchBrands = () => {
  return Fetch('/goods/allGoodsBrands');
};

/**
 * 查询全部分类
 */
 export const fetchCates = () => {
  return Fetch('/goods/goodsCatesTree');
};



// /**
//  * 关闭活动
//  * @returns {Promise<IAsyncResult<T>>}
//  */
//  export const pileActivityClose = reductionBean => {
//   return Fetch<TResult>('/pileActivity/close/'+reductionBean.id, {
//     method: 'PUT',
//     body: JSON.stringify(reductionBean)
//   });
// };

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