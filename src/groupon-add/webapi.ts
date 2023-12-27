import { Fetch } from 'qmkit';

/**
 * 分页查询拼团活动
 */
export const fetchGoodsPage = (params) => {
  return Fetch<TResult>('/goods/groupon-spus', {
    method: 'POST',
    body: JSON.stringify({ ...params })
  });
};

/**
 * 查询全部签约的品牌
 */
export const getBrandList = () => {
  return Fetch('/contract/goods/brand/list', {
    method: 'GET'
  });
};

/**
 * 查询全部分类
 */
export const getCateList = () => {
  return Fetch('/storeCate', {
    method: 'GET'
  });
};

/**
 * 查询活动分类
 */
export const getGrouponCateList = () => {
  return Fetch('/groupon/cate/list', {
    method: 'GET'
  });
};

/**
 * 添加拼团活动
 */
export const add = (params) => {
  return Fetch('/groupon/activity/add', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 编辑拼团活动
 */
export const modify = (params) => {
  return Fetch('/groupon/activity/modify', {
    method: 'PUT',
    body: JSON.stringify(params)
  });
};

/**
 * 查看拼团活动详情
 */
export const detail = (activityId) => {
  return Fetch(`/groupon/activity/${activityId}`, {
    method: 'GET'
  });
};

/**
 * 获取拼团商品审核状态
 */
export const getGoodsAuditFlag = () => {
  return Fetch('/groupon/setting/get-goods-audit-flag', {
    method: 'GET'
  });
};
