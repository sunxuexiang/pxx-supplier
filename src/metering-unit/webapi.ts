import { Fetch } from 'qmkit';
type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 获取计量单位
 */
export const getGoodsUnit = (params = {}) => {
  return Fetch<TResult>('/goodsUnit/page', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};
/**
 * 新增计量单位
 */
export const addGoodsUnit = (params = {}) => {
  return Fetch<TResult>('/goodsUnit/add', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};
/**
 * 修改计量单位
 */
export const editGoodsUnit = (params = {}) => {
  return Fetch<TResult>('/goodsUnit/updateUnitById', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};
/**
 * 删除计量单位
 */
export const delGoodsUnit = (params = {}) => {
  return Fetch<TResult>('/goodsUnit/deleteById', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};
