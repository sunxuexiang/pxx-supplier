import { Fetch } from 'qmkit';
import { IMap } from 'typings/globalType';

/**
 * 查询列表
 */
export function getPage(params) {
  return Fetch<TResult>('/goods/goodsCompanyPage', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 获取类目列表
 */
export const getCateList = () => {
  return Fetch('/goods/goodsCates');
};

/**
 * 根据id删除厂商
 * @param id
 */
export const deleteById = (companyId) => {
  return Fetch<TResult>('/goods/deleteGoodsCompany?companyId=' + companyId, {
    method: 'PUT'
  });
};
/**
 * 禁用/启用列表
 */
export function setGoodsCompany(params) {
  return Fetch<TResult>(
    '/goods/setGoodsCompany?status=' +
      params.status +
      '&companyId=' +
      params.companyId,
    {
      method: 'PUT'
      // body: JSON.stringify(params)
    }
  );
}
/**
 * 新增厂商
 */
export const addGoodsCompany = (params) => {
  return Fetch<TResult>('/goods/addGoodsCompany', {
    method: 'POST',
    body: JSON.stringify({
      goodsCompany: params
    })
  });
};
/**
 * 编辑厂商
 */
export const editGoodsCompany = (info) => {
  return Fetch<TResult>('/goods/editGoodsCompany', {
    method: 'PUT',
    body: JSON.stringify({
      goodsCompany: info
    })
  });
};
/**
 * 查询品牌
 */
export const goodsBrands = () => {
  return Fetch<TResult>('/goods/allGoodsBrands', {
    method: 'GET'
  });
};
