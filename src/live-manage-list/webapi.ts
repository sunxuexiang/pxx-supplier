import { Fetch } from 'qmkit';
type TResult = {
  code: string;
  message: string;
  context: any;
};
/**
 * 查询直播列表
 */
export function getPage(params) {
  return Fetch<TResult>('/liveStream/streamPageList', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 查询直播商品库列表
 */
export function getLiveGoodsPage(params) {
  return Fetch<TResult>('/liveStream/goodsNewLists', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 添加商品到直播商品库列表
 */
export function getLiveStreamGoodsAdd(params) {
  return Fetch<TResult>('/liveStream/goodsAdd', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 查询直播优惠券活动列表
 */
export function getLiveCompanyPage(params) {
  return Fetch<TResult>('/liveStream/activityList', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 添加优惠券活动到直播优惠列表
 */
export function getLiveStreamActivityAdd(params) {
  return Fetch<TResult>('/liveStream/activityAdd', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 查询直播间福袋列表
 */
export function liveStreamRoomBagPage(params) {
  return Fetch<TResult>('/liveStreamRoomBag/getPage', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 添加福袋
 */
export function liveStreamRoomBagAdd(params) {
  return Fetch<TResult>('/liveStreamRoomBag/add', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 编辑福袋
 */
export function liveStreamRoomBagModify(params) {
  return Fetch<TResult>('/liveStreamRoomBag/modify', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 详情福袋
 */
export function liveStreamRoomBagGetInfo(params) {
  return Fetch<TResult>('/liveStreamRoomBag/getInfo', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 发放type 0 文字消息 1 商品消息 2 优惠卷活动
 */
export function getLiveStreamSendMessage(params) {
  return Fetch<TResult>('/liveStream/sendMessage', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 商品取消推送
 */
export function getLiveStreamGoodsExplain(params) {
  return Fetch<TResult>('/liveStream/goodsExplain', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 移除优惠活动
 */
export function getLiveStreamActivityModify(params) {
  return Fetch<TResult>('/liveStream/activityModify', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 移除商品和上下架（商品编辑）
 */
export function getLiveStreamGoodsModify(params) {
  return Fetch<TResult>('/liveStream/saleGoodsBatch', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 查询直播列表(删除)
 */
export function deleteLiveStream(params) {
  return Fetch<TResult>('/liveStream/deleteLiveStream', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}
