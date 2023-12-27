import { Fetch } from 'qmkit';
import { IMap } from 'typings/globalType';

/**
 * 获取类目列表
 */
export const getCateList = () => {
  return Fetch('/storeCate');
};

/**
 * 添加
 */
export const addCate = (parmas) => {
  return Fetch('/storeCate', {
    method: 'POST',
    body: JSON.stringify(parmas)
  });
};

/**
 * 删除
 */
export const deleteCate = (storeCateId: string) => {
  return Fetch(`/storeCate/${storeCateId}`, {
    method: 'DELETE'
  });
};

/**
 * 修改
 */
export const editCate = (parmas) => {
  return Fetch('/storeCate', {
    method: 'PUT',
    body: JSON.stringify(parmas)
  });
};

/**
 * 检测店铺分类是否有子类
 */
export const chkChild = (param: IMap) => {
  return Fetch('/storeCate/checkHasChild', {
    method: 'POST',
    body: JSON.stringify(param)
  });
};

/**
 * 检测店铺分类是否关联了商品
 */
export const chkGoods = (param: IMap) => {
  return Fetch('/storeCate/checkHasGoods', {
    method: 'POST',
    body: JSON.stringify(param)
  });
};

/**
 * 拖拽排序
 */
export const dragSort = (param) => {
  return Fetch('/storeCate/sort', {
    method: 'PUT',
    body: JSON.stringify(param)
  });
};
