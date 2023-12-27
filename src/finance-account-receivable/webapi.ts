import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: string;
};

// 查询所有有效的线下账户
export const fetchAllOfflineAccounts = () => {
  return Fetch('/account/managerOfflineAccounts');
};

// 新增收款账户
export const saveOfflineAccount = (params = {}) => {
  return Fetch<TResult>('/account/offlineAccount', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
};

// 编辑收款账户
export const editOfflineAccount = (params = {}) => {
  return Fetch<TResult>('/account/offlineAccount', {
    method: 'PUT',
    body: JSON.stringify({
      ...params
    })
  });
};

// 删除收款账户
export const deleteOfflineAccount = (accountId: string) => {
  return Fetch<TResult>(`/account/offlineAccount/${accountId}`, {
    method: 'DELETE',
    body: JSON.stringify(accountId)
  });
};

// 启用收款账户
export const enableOfflineAccount = (accountId: string) => {
  return Fetch<TResult>(`/account/offline/enable/${accountId}`, {
    method: 'POST',
    body: JSON.stringify(accountId)
  });
};

// 禁用收款账户
export const disableOfflineAccount = (accountId: string) => {
  return Fetch<TResult>(`/account/offline/disable/${accountId}`, {
    method: 'POST',
    body: JSON.stringify(accountId)
  });
};

//获取网关详情
export const getTradeGateWays = () => {
  return Fetch<TResult>('/tradeManage/gateways');
};

//获取网关支付渠道列表
export const getChannelsByGateWaysId = gatewayId => {
  return Fetch<TResult>('/tradeManage/items/' + gatewayId);
};

//保存网关及支付渠道的修改
export const saveGateWaysDetails = content => {
  return Fetch<TResult>('/tradeManage/save', {
    method: 'POST',
    body: JSON.stringify(content)
  });
};
