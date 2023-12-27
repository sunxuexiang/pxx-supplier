import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 获取客户增长报表的table数据
 *
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function getCustomerPageData(
  dateCycle,
  pageNum,
  pageSize,
  sortName,
  sortType
) {
  pageNum = pageNum ? pageNum : 1;
  pageSize = pageSize ? pageSize : 10;

  let sorterOrder = 'DESC';
  if (sortType == 'ascend') {
    sorterOrder = 'ASC';
  }

  let requestJson = {
    pageNum: pageNum,
    pageSize: pageSize,
    sortField: sortName,
    sortType: sorterOrder
  };

  if (isNaN(dateCycle)) {
    requestJson['month'] = dateCycle;
  } else {
    requestJson['dateCycle'] = dateCycle;
  }

  return Fetch<TResult>(`/customer_grow/page`, {
    method: 'POST',
    body: JSON.stringify(requestJson)
  });
}

/**
 * 获取客户增长报表的table数据
 *
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function getCustomerMultiPageData(
  queryType,
  dateCycle,
  queryText,
  pageNum,
  pageSize,
  sortName,
  sortType
) {
  queryType = queryType ? queryType : 0;
  pageNum = pageNum ? pageNum : 1;
  pageSize = pageSize ? pageSize : 10;

  let sorterOrder = 'DESC';
  if (sortType == 'ascend') {
    sorterOrder = 'ASC';
  }

  let requestJson = {
    queryType: queryType,
    queryText: queryText,
    pageNum: pageNum,
    pageSize: pageSize,
    sortField: sortName,
    sortType: sorterOrder
  };

  if (isNaN(dateCycle)) {
    requestJson['month'] = dateCycle;
  } else {
    requestJson['dateCycle'] = dateCycle;
  }

  return Fetch<TResult>(`/customer_report/order`, {
    method: 'POST',
    body: JSON.stringify(requestJson)
  });
}

/**
 * 获取客户增长趋势的chart图
 *
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function getCustomerChartData(dateCycle, isWeek) {
  let requestJson = {
    weekly: isWeek
  };

  if (isNaN(dateCycle)) {
    requestJson['month'] = dateCycle;
  } else {
    requestJson['queryDateCycle'] = dateCycle;
  }

  return Fetch<TResult>(`/customer_grow/trend`, {
    method: 'POST',
    body: JSON.stringify(requestJson)
  });
}

/**
 * 级别分布视图接口
 *
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function getCustomerLevelData(dateCycle, month) {
  return Fetch<TResult>(`/view/customer/distribute/level`, {
    method: 'POST',
    body: JSON.stringify({
      dateCycle: dateCycle,
      month: month
    })
  });
}

/**
 * 地区分布视图接口
 *
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function getCustomerAreaData(dateCycle, month) {
  return Fetch<TResult>(`/view/customer/distribute/area`, {
    method: 'POST',
    body: JSON.stringify({
      dateCycle: dateCycle,
      month: month
    })
  });
}

/**
 * 查询平台客户等级列表
 */
export const getBossUserLevelList = () => {
  return Fetch<TResult>('/store/storeLevel/listBoss', {
    method: 'GET'
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
