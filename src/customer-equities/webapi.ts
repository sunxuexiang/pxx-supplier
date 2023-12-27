import { Fetch } from 'qmkit';

/**
 * 获取权益列表
 */
export const getEquitiesList = () => {
  return Fetch('/customer/customerLevelRights/list');
};

/**
 * 添加权益
 */
export const addEquities = (formData: object) => {
  return Fetch('/customer/customerLevelRights/add', {
    method: 'POST',
    body: JSON.stringify({
      ...formData
    })
  });
};
export const modifyEquities = (formData: object) => {
  return Fetch('/customer/customerLevelRights/modify', {
    method: 'PUT',
    body: JSON.stringify({
      ...formData
    })
  });
};

/**
 * 拖拽排序
 */
export const dragSort = (param) => {
  return Fetch('/customer/customerLevelRights/editSort', {
    method: 'PUT',
    body: JSON.stringify(param)
  });
};

/**
 * 删除优惠券分类
 */
export const deleteEquities = (id) => {
  return Fetch(`/customer/customerLevelRights/deleteById/${id}`, {
    method: 'DELETE'
  });
};

/********************************富文本编辑开始*********************************/

/**
 * 获取图片类目列表
 */
export const getImgCates = () => {
  return Fetch('/system/resourceCates');
};

/**
 * 分页获取图片列表
 * @param param
 * @returns {Promise<IAsyncResult<T>>}
 */
export const fetchImages = (params = {}) => {
  return Fetch('/system/resources', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/********************************富文本编辑结束*********************************/
