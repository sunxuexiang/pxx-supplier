import { Fetch } from 'qmkit';
type TResult = {
  code: string;
  message: string;
  context: any;
};


/**
 * 新增
 * @returns {Promise<IAsyncResult<T>>}
 */
 export const pileActivityAdd = reductionBean => {
  return Fetch<TResult>('/pileActivity/add', {
    method: 'POST',
    body: JSON.stringify(reductionBean)
  });
};

/**
 * 修改
 * @returns {Promise<IAsyncResult<T>>}
 */
 export const pileActivityModify = reductionBean => {
  return Fetch<TResult>('/pileActivity/modify', {
    method: 'PUT',
    body: JSON.stringify(reductionBean)
  });
};

/**
 * 详情
 * @returns {Promise<IAsyncResult<T>>}
 */
 export const pileActivityDis = (activityId) => {
  return Fetch<TResult>('/pileActivity/'+activityId, {
    method: 'GET'
  });
};




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


// ------------

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




/**
 * 新增满减
 * @returns {Promise<IAsyncResult<T>>}
 */
export const addFullReduction = reductionBean => {
  return Fetch<TResult>('/marketing/fullReduction', {
    method: 'POST',
    body: JSON.stringify(reductionBean)
  });
};

/**
 * 编辑满减
 * @returns {Promise<IAsyncResult<T>>}
 */
export const updateFullReduction = reductionBean => {
  return Fetch<TResult>('/marketing/fullReduction', {
    method: 'PUT',
    body: JSON.stringify(reductionBean)
  });
};

/**
 * 草稿满减
 * @returns {Promise<IAsyncResult<T>>}
 */
 export const addDrafFullReduction = reductionBean => {
  return Fetch<TResult>('/marketing/fullReduction/draft', {
    method: 'POST',
    body: JSON.stringify(reductionBean)
  });
};

/**
 * 修改草稿满减
 * @returns {Promise<IAsyncResult<T>>}
 */
 export const updateDrafFullReduction = reductionBean => {
  return Fetch<TResult>('/marketing/fullReduction/draft', {
    method: 'PUT',
    body: JSON.stringify(reductionBean)
  });
};


