import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 获取乡镇列表
 */
export function addressList(params) {
  return Fetch<TResult>('/villages/address/page', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
}

/**
 * 删除优惠券
 */
export function deleteCoupon(id) {
  return Fetch<TResult>('/villages/address', {
    method: 'DELETE',
    body: JSON.stringify({ ids: id })
  });
}

/**
 * 获取乡镇件规则配置信息
 */
export function fetchRuleInfo() {
  return Fetch<TResult>('/freighttemplatedeliveryarea/queryVillagesDilivery', {
    method: 'GET'
  });
}

/**
 * 保存乡镇件规则配置信息
 */
export function saveRuleInfo(params) {
  return Fetch<TResult>('/freighttemplatedeliveryarea/save', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
}
