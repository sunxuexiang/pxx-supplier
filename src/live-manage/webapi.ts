import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

const mockFetch = async (data) => {
  const res = await new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, 50);
  });
  return { res };
};

/**
 * 查询列表
 */
export function getPage(params) {
  return Fetch<TResult>('/liveStreamRoom/getPage', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 修改/删除
 */
export const modify = (params) => {
  return Fetch<TResult>('/liveStreamRoom/modify', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};
/**
 * 新增
 */
export const add = (params) => {
  return Fetch<TResult>('/liveStreamRoom/add', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};
/**
 * 查询厂商列表
 */
export const goodsCompanyPages = (params) => {
  return Fetch<TResult>('/goods/goodsCompanyPage', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};
/**
 * 查询品牌
 */
export const goodsBrands = () => {
  // /contract/goods/brand/list
  return Fetch<TResult>('/goods/allGoodsBrands', {
    method: 'GET'
  });
};
