import { Fetch } from 'qmkit';
import { IMap } from 'typings/globalType';

/**
 * 获取类目列表
 */
export const getCateList = () => {
  return Fetch(`/store/resourceCates`);
};

/**
 * 添加
 */
export const addCate = (formData: IMap) => {
  return Fetch(`/store/resourceCate`, {
    method: 'POST',
    body: JSON.stringify(formData.toJS())
  });
};

/**
 * 删除
 */
export const deleteCate = (cateId: string) => {
  return Fetch(`/store/resourceCate/${cateId}`, {
    method: 'DELETE'
  });
};

/**
 * 修改
 */
export const editCate = (formData: IMap) => {
  return Fetch(`/store/resourceCate`, {
    method: 'PUT',
    body: JSON.stringify(formData.toJS())
  });
};

/**
 * 检测素材分类是否有子类
 */
export const getChild = (param: IMap) => {
  return Fetch(`/store/resourceCate/child`, {
    method: 'POST',
    body: JSON.stringify(param)
  });
};

/**
 * 检测素材分类是否有子类素材
 */
export const getResource = (param: IMap) => {
  return Fetch(`/store/resourceCate/resource`, {
    method: 'POST',
    body: JSON.stringify(param)
  });
};
