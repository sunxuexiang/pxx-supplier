import { Fetch } from 'qmkit';
type TResult = {
  code: string;
  message: string;
  context: any;
};

type FResult = {
  code: number;
  msg: string;
  data: any;
};
/**
 * 获取规则
 */
export function fetchRuleInfo() {
  return Fetch<TResult>('/freighttemplatedeliveryarea/queryDeliveryToStore');
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

/**
 * 获取平台规则
 */
export function fetchPlateInfo() {
  return Fetch<TResult>(
    '/freightTemplate/freightTemplateDeliveryToStoreOpened'
  );
}

/**
 * 获取承运商信息
 */
export function fetchCarrierInfo(storeId) {
  return Fetch(`/tmsApi/site/lisSupplierSite/${storeId}`);
}
