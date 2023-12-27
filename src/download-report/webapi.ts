import { Fetch } from 'qmkit';

/**
 * 分页获取下载报表
 *
 * @param pageNum
 * @param pageSize
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function getDownloadReportByPage(pageNum, pageSize) {
  return Fetch<TResult>('/export/query', {
    method: 'POST',
    body: JSON.stringify({
      pageNum: pageNum,
      pageSize: pageSize
    })
  });
}

/**
 * 删除下载报表
 *
 * @param id
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function deleteDownloadReport(id) {
  return Fetch<TResult>('/export/delete', {
    method: 'DELETE',
    body: JSON.stringify({
      id: id
    })
  });
}
