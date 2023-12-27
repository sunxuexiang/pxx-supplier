import { Fetch } from 'qmkit';

/**
 * 查询列表
 */
type TResult = {
  code: string;
  message: string;
  context: any;
};

export function getPage(params, urlType = 0) {
  return Fetch<TResult>(
    `/${urlType == 1 ? 'specifyLogistics' : 'logisticscompany'}/page`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  );
}

/**
 * 添加
 */
export function add(info, urlType = 0) {
  return Fetch<TResult>(
    `/${urlType == 1 ? 'specifyLogistics' : 'logisticscompany'}/add`,
    {
      method: 'POST',
      body: JSON.stringify(info)
    }
  );
}

/**
 * 修改
 */
export function modify(info, urlType = 0) {
  return Fetch<TResult>(
    `/${urlType == 1 ? 'specifyLogistics' : 'logisticscompany'}/modify`,
    {
      method: 'PUT',
      body: JSON.stringify(info)
    }
  );
}

/**
 * 单个删除
 */
export function deleteById(id, urlType = 0) {
  return Fetch<TResult>(
    `/${urlType == 1 ? 'specifyLogistics' : 'logisticscompany'}/${id}`,
    {
      method: 'DELETE'
    }
  );
}

/**
 * 批量删除
 */
export function deleteByIdList(idList, urlType = 0) {
  return Fetch<TResult>(
    `/${
      urlType == 1 ? 'specifyLogistics' : 'logisticscompany'
    }/delete-by-id-list`,
    {
      method: 'DELETE',
      body: JSON.stringify({ idList: idList })
    }
  );
}

/**
 * 获取托运部规则配置信息
 */
export function fetchRuleInfo(urlType = 0) {
  return Fetch<TResult>(
    `/freighttemplatedeliveryarea/${
      urlType == 1 ? 'querySpecifyLogistics' : 'queryThirdLogisticsDilivery'
    }`,
    {
      method: 'GET'
    }
  );
}

/**
 * 保存托运部规则配置信息
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
 * 查询自营商家
 */
export function fetchSelfManage() {
  return Fetch<TResult>('/store/list-self-manage', {
    method: 'GET'
  });
}

/**
 * 同步规则配置
 */
export function syncRuleInfo(params) {
  return Fetch<TResult>(
    '/freighttemplatedeliveryarea/syncThirdLogisticsDilivery',
    {
      method: 'POST',
      body: JSON.stringify({
        ...params
      })
    }
  );
}

/**
 * 同步物流公司
 */
export function syncCompanyInfo(params, urlType = 0) {
  return Fetch<TResult>(
    `/${
      urlType == 1 ? 'specifyLogistics' : 'logisticscompany'
    }/syncLogisticsCompany`,
    {
      method: 'POST',
      body: JSON.stringify({
        ...params
      })
    }
  );
}
