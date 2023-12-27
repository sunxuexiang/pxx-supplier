/**
 * Created by feitingting on 2017/10/19.
 */
import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 获取商品概况
 * @param params
 * @returns {Promise<IAsyncResult<T>>}
 */
export const getGoodsTotal = (params = {}) => {
  return Fetch<TResult>(`/goodsReport/total`, {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 获取商品报表
 * @param params
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const getskuList = (params = {}) => {
  return Fetch<TResult>(`/goodsReport/skuList`, {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 获取分类报表
 * @param params
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const getcateList = (params = {}) => {
  return Fetch<TResult>(`/goodsReport/storeCateList`, {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 获取品牌报表
 * @param params
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const getbrandList = (params = {}) => {
  return Fetch<TResult>(`/goodsReport/brandList`, {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 查询全部品牌分类
 * @returns {Promise<IAsyncResult<T>>}
 */
export const getAllBrands = () => {
  return Fetch<TResult>('/contract/goods/brand/list', {
    method: 'GET'
  });
};

/**
 * 查询全部分类
 * @returns {Promise<IAsyncResult<T>>}
 */
export const getAllCates = () => {
  return Fetch<TResult>('/storeCate', {
    method: 'GET'
  });
};

/**
 * 仓库列表
 * @param params
 */
 export const wareHousePage = (params) => {
  return Fetch<TResult>('/ware/house/page', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
}
