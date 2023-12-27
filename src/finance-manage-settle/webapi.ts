import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 获取结算单列表
 * @param filterParams
 */
export function fetchSettlementList(filterParams = {}) {
  return Fetch<TResult>('/finance/settlement/page', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

/**
 * 获取店铺信息
 * @param filterParams
 */
export function getStoreInfo() {
  return Fetch<TResult>('/store/info', {
    method: 'GET'
  });
}

/**
 * 更改结算单状态
 * @param settleIdArray
 * @param status
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function changeSettleStatus(
  settleIdList: Array<number>,
  status: number
) {
  return Fetch<TResult>('/finance/settlement/status', {
    method: 'PUT',
    body: JSON.stringify({
      settleIdList,
      status
    })
  });
}

/**
 * 根据店铺名称查询店铺
 * @param storeName
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function queryStoreByName(storeName: string) {
  return Fetch<TResult>(`/store/name/${storeName}`, {
    method: 'GET'
  });
}
