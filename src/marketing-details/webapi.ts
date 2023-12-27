import { Fetch } from 'qmkit';

/**
 * 获取营销基础信息
 * @returns {Promise<IAsyncResult<T>>}
 */
export const fetchMarketingInfo = (marketingId) => {
  return Fetch<TResult>(`/marketing/${marketingId}`);
};

/**
 * 获取店铺客户等级列表
 */
export const getUserLevelList = () => {
  return Fetch<TResult>('/store/storeLevel/list', {
    method: 'GET'
  });
};

/**
 * 获取赠品规则
 * @returns {Promise<IAsyncResult<T>>}
 */
export const fetchGiftList = (filterParams = {}) => {
  return Fetch<TResult>('/marketing/fullGift/giftList', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
};
/**
 * 新增商品
 */
export const addGoods = (params) => {
  return Fetch<TResult>('/marketing/addActivityGoods', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
}

/**
 * 新增赠品
 */
 export const addGif = (params) => {
  return Fetch<TResult>('/marketing/addActivityGiveGoods', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
}

// 终止赠品
export const oneGifTermination = (scope) => {
  return Fetch<TResult>('/marketing/stopGiveGoods', {
    method: 'POST',
    body: JSON.stringify(scope)
  });
}

export const oneGoodsTermination = (scope) => {
  return Fetch<TResult>('/marketing/terminationGoods', {
    method: 'POST',
    body: JSON.stringify(scope)
  });
};

/**
 * 结果
 * @param checkState
 * @param customerIds
 * @returns {Promise<IAsyncResult<T>>}
 */
type TResult = {
  code: string;
  message: string;
  context: any;
};
