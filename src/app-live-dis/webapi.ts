import { Fetch } from 'qmkit';

/**
 * 查询列表
 */
export function getPage(params) {
  return Fetch<TResult>('/liveroom/page', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 单个查询
 */
export function getById(params) {
  return Fetch<TResult>('/liveStream/streamDetail', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 直播活动记录列表
 */
export function getActivityRecordList(params) {
  return Fetch<TResult>('/liveStream/activityNewRecordList', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 直播商品记录列表
 */
export function getLiveGoodsRecordList(params) {
  return Fetch<TResult>('/liveStream/liveGoodsNewRecordList', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 直播神福代记录列表
 */
export function liveBagRecordListt(params) {
  return Fetch<TResult>('/liveStreamRoomBag/liveBagRecordList', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 直播领取券记录
 */
export function getRecord(params) {
  return Fetch<TResult>('/coupon-code/getRecord', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 添加
 */
export function add(info) {
  return Fetch<TResult>('/liveroom/add', {
    method: 'POST',
    body: JSON.stringify(info)
  });
}

/**
 * 修改
 */
export function modify(info) {
  return Fetch<TResult>('/liveroom/modify', {
    method: 'PUT',
    body: JSON.stringify(info)
  });
}

/**
 * 单个删除
 */
export function deleteById(id) {
  return Fetch<TResult>(`/liveroom/${id}`, {
    method: 'DELETE'
  });
}

/**
 * 批量删除
 */
export function deleteByIdList(idList) {
  return Fetch<TResult>('/liveroom/delete-by-id-list', {
    method: 'DELETE',
    body: JSON.stringify({ idList: idList })
  });
}
