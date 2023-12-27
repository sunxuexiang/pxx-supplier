import { Fetch } from 'qmkit';

/**
 * 获取客户列表
 * @param filterParams
 */
export function fetchGoodsEvaluateList(filterParams = {}) {
  return Fetch<TResult>('/goods/evaluate/page', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}


/**
 * 获取店铺180天评价统计信息
 * @param filterParams
 */
export function fetchStoreEvaluateSum(param = {}) {
    return Fetch<TResult>('/store/evaluate/sum/getByStoreId', {
        method: 'POST',
        body: JSON.stringify({
            ...param
        })
    });
}

/**
 * 获取180天评价信息
 * @param {{}} param
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function fetchStoreEvaluateNum(param = {}) {
	return Fetch<TResult>('/store/evaluate/num/storeEvaluateNumByStoreIdAndScoreCycle', {
		method: 'POST',
		body: JSON.stringify({
			...param
		})
	});
}

/**
 * 获取店铺评价历史记录
 * @param {{}} filterParams
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function fetchStoreEvaluateList(filterParams = {}) {
	return Fetch<TResult>('/store/evaluate/num/page', {
		method: 'POST',
		body: JSON.stringify({
			...filterParams
		})
	});
}

/**
 * 获取商品评价详情
 * @param {{}} param
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function fetchGoodsEvaluateDetail(param = {}) {
	return Fetch<TResult>('/goods/evaluate/detail', {
		method: 'POST',
		body: JSON.stringify({
			...param
		})
	});
}

/**
 * 保存评价回复
 * @param {{}} param
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function saveGoodsEvaluateAnswer(param = {}) {
	return Fetch<TResult>('/goods/evaluate/answer', {
		method: 'POST',
		body: JSON.stringify({
			...param
		})
	});
}