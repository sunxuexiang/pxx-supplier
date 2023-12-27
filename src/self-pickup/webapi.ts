import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 获取上门自提配置信息
 */
export function fetchRuleInfo() {
  return Fetch<TResult>('/freighttemplatedeliveryarea/queryToDoorPick', {
    method: 'GET'
  });
}

/**
 * 保存上门自提配置信息
 */
export function saveRuleInfo(params) {
  return Fetch<TResult>('/freighttemplatedeliveryarea/save', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
}

/**
 * 保存上门自提配置信息校验
 */
export function checkSaveRuleInfo() {
  return Fetch<TResult>('/doorPickConfig/findStartedInfoByStoreId');
}

/**
 * 新增自提点
 */
export function addDoorPickConfig(params) {
  return Fetch<TResult>('/doorPickConfig/add', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
}

/**
 * 修改自提点
 */
export function editDoorPickConfig(params) {
  return Fetch<TResult>('/doorPickConfig/update', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
}

/**
 * 查询自提点列表
 */
export function fetchDoorPickConfig(params) {
  return Fetch<TResult>('/doorPickConfig/list', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
}

/**
 * 启用自提点
 */
export function startDoorPickConfig(params) {
  return Fetch<TResult>('/doorPickConfig/start', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
}

/**
 * 停用自提点
 */
export function endDoorPickConfig(params) {
  return Fetch<TResult>('/doorPickConfig/stop', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
}

/**
 * 删除自提点
 */
export function delDoorPickConfig(params) {
  return Fetch<TResult>('/doorPickConfig/delete', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
}
