import { Fetch } from 'qmkit';
type TResult = {
  code: string;
  message: string;
  context: any;
};
/**
 * 查询客服设置
 * @param storeId
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function getOnlineServerSwitch() {
  return Fetch<TResult>('/customerService/qq/switch');
}

/**
 * 查询客服列表
 * @param storeId
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function getOnlineServerList() {
  return Fetch<TResult>('/customerService/qq/detail');
}

/**
 * 保存客服列表
 * @param storeId
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function onSaveOnlineServer(
  qqOnlineServerRop,
  qqOnlineServerItemRopList
) {
  return Fetch<TResult>('/customerService/qq/saveDetail', {
    method: 'POST',
    body: JSON.stringify({
      qqOnlineServerRop: qqOnlineServerRop,
      qqOnlineServerItemRopList: qqOnlineServerItemRopList
    })
  });
}

/**
 * 查询IM客服开关
 * @param storeId
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function getImSwitch() {
  return Fetch<TResult>('/imCustomerService/tencentIm/switch');
}

/**
 * 查询IM客服配置
 * @param storeId
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function getIMConfig() {
  return Fetch<TResult>('/imCustomerService/tencentIm/detail');
}

/**
 * 保存IM配置
 * @param
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function saveIMConfig(data) {
  return Fetch<TResult>('/imCustomerService/tencentIm/saveDetail', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}
/**
 * 获取所有员工列表
 * @param
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function getAllEmployees(data = {}) {
  // return Fetch<TResult>('/employee/allEmployees');
  return Fetch<TResult>('/customer/employeesList', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}
/**
 * 智齿状态查询
 * @param
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function smartToothStatus() {
  return Fetch<TResult>('/customerService/sobot/switch');
}
/**
 * 修改智齿状态
 * @param
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function updateSmartTooth(data = {}) {
  return Fetch<TResult>('/customerService/sobot/switch/update', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

/**
 * 保存客服服务配置
 * @param data 参数
 * @returns Promise<TResult>
 */
export function saveCustomerServiceConfig(data = {}) {
  return Fetch<TResult>('/serviceSetting/save', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

/**
 * 获取客服服务配置
 * @param data 参数
 * @returns Promise<TResult>
 */
export function getCustomerServiceConfig(data = {}) {
  return Fetch<TResult>('/serviceSetting/getList', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

/**
 * 获取客服聊天统计列表
 * @param data 参数
 * @returns Promise<TResult>
 */
export function getServiceChatManagerList() {
  return Fetch<TResult>('/serviceChat/managerList');
}

/**
 * 添加IM快捷回复分组Tree
 * @param data 参数
 * @returns Promise<TResult>
 */
export function saveImReplyMessageGroup(data = {}) {
  return Fetch<TResult>('/commonMessageGroup/add', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

/**
 * 更新IM快捷回复Tree信息
 * @param data 参数
 * @returns Promise<TResult>
 */
export function updateImReplyMessageTree(data = {}) {
  return Fetch<TResult>('/commonMessageGroup/update', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}
/**
 * 删除IM快捷回复Tree节点
 * @param data 参数
 * @returns
 */
export function deleteImReplyMessageTree(data = {}) {
  return Fetch<TResult>('/commonMessageGroup/delete', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

/**
 * 获取IM快捷回复Tree列表
 * @returns Promise<TResult>
 */
export function getImReplyMessageGroupList() {
  return Fetch<TResult>('/commonMessageGroup/getAll');
}

/**
 * 保存客服回复的常用语
 * @param data 参数
 * @returns Promise<TResult>
 */
export function saveCustomerCommonMessage(data = {}) {
  return Fetch<TResult>('/commonMessage/add', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

/**
 * 获取客服回复的常用语列表
 * @param data 参数
 * @returns Promise<TResult>
 */
export function getCustomerCommonMessageList(data = {}) {
  return Fetch<TResult>('/commonMessage/getList', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

/**
 * 删除客服回复的常用语
 * @param data 参数
 * @returns Promise<TResult>
 */
export function deleteCustomerCommonMessage(data = {}) {
  return Fetch<TResult>('/commonMessage/delete', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

/**
 * 更新客服回复的常用语
 * @param data 参数
 * @returns Promise<TResult>
 */
export function updateCustomerCommonMessage(data = {}) {
  return Fetch<TResult>('/commonMessage/update', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

/**
 * 修改登录IM在线状态 （下线状态：不分配客户，上线状态：分配客户）
 * @param {customerServiceAccount, serviceStatus} data
 * @returns Promise
 */
export const updateServiceOnlineStatus = (data = {}) => {
  return Fetch<TResult>('/imCustomerService/tencentIm/updateServiceStatus', {
    method: 'POST',
    body: JSON.stringify(data)
  });
};
