import { Fetch } from 'qmkit';
type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 查询商家店铺品牌
 * @returns {Promise<IAsyncResult<T>>}
 */
export const fetchBrandList = () => {
  return Fetch<TResult>('/contract/goods/brand/list', {
    method: 'GET'
  });
};

/**
 * 查询商家店铺全部分类
 * @returns {Promise<IAsyncResult<T>>}
 */
export const fetchCateList = () => {
  return Fetch<TResult>('/contract/goods/cate/list', {
    method: 'GET'
  });
};

/**
 * 查询商品列表
 * @returns {Promise<IAsyncResult<T>>}
 */
export const fetchGoodsList = params => {
  return Fetch('/goods/skus', {
    method: 'POST',
    body: JSON.stringify({ ...params })
  });
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
 * 满减满折 切换仓库
 * @returns  {Promise<IAsyncResult<T>>}
 */
export const udtalGoods = (params) => {
  return Fetch('/goods/catWareMarketing', {
    method: 'POST',
    body: JSON.stringify({ ...params })
  });
}

/**
 * 满赠 切换仓库
 * @returns  {Promise<IAsyncResult<T>>}
 */
 export const udtalgifGoods = (params) => {
  return Fetch('/goods/catWareMarketingGive', {
    method: 'POST',
    body: JSON.stringify({ ...params })
  });
}

// 获取当前时间
export const gettiem = () => {
  let d = new Date(),
    str = '';
  str += d.getHours() <= 9 ? '0' + d.getHours() + ':' : d.getHours() + ':';
  str +=
    d.getMinutes() <= 9 ? '0' + d.getMinutes() + ':' : d.getMinutes() + ':';
  str += d.getSeconds() <= 9 ? '0' + d.getSeconds() : d.getSeconds();
  // console.log(str, 's')
  let itmes = {
    n: d.getFullYear() + '-',
    y:
      d.getMonth() + 1 <= 9
        ? '0' + (d.getMonth() + 1) + '-'
        : d.getMonth() + 1 + '-',
    d: d.getDate() <= 9 ? '0' + d.getDate() : d.getDate() + ' '
  };
  let Time = itmes.n + '' + itmes.y + '' + itmes.d + ' ' + str;
  return Time
}
/**
 * 判断sku是否已经存在于其他同类型的营销活动中
 * @returns {Promise<IAsyncResult<T>>}
 */
export const skuExists = params => {
  return Fetch<TResult>('/marketing/sku/exists', {
    method: 'POST',
    body: JSON.stringify({ ...params })
  });
};

/**
 * 获取详情
 * @returns {Promise<IAsyncResult<T>>}
 */
export const getMarketingInfo = marketingId => {
  return Fetch<TResult>(`/marketing/${marketingId}`, {
    method: 'GET'
  });
};
