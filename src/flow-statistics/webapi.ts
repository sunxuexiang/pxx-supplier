import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: string;
};

/**
 * 获取流量概况和折线图数据
 *
 * @param startTime
 * @param endTime
 * @param isWeek
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function getFlowData(dateCycle, isWeek) {
  return Fetch<TResult>(`/flow/list`, {
    method: 'POST',
    body: JSON.stringify({
      selectType: dateCycle,
      isWeek: isWeek
    })
  });
}

/**
 * 获取分页table数据
 *
 * @param startTime
 * @param endTime
 * @param pageNum
 * @param pageSize
 * @param sortName
 * @param sortType
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function getPageData(dateCycle, pageNum, pageSize, sortName, sortType) {
  pageNum = pageNum ? pageNum : 1;
  pageSize = pageSize ? pageSize : 10;
  sortName = sortName ? sortName : 'date';
  sortType = sortType ? sortType : 'DESC';
  let sorterOrder = 'DESC';
  if (sortType == 'ascend') {
    sorterOrder = 'ASC';
  }
  return Fetch<TResult>(`/flow/page`, {
    method: 'POST',
    body: JSON.stringify({
      selectType: dateCycle,
      pageNum: pageNum,
      pageSize: pageSize,
      sortName: sortName,
      sortOrder: sorterOrder
    })
  });
}
