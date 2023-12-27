import { Fetch } from 'qmkit';

/**
 * 获取权益列表
 */
export const getEquitiesList = () => {
  return Fetch('/role-list');
};

/**
 * 添加角色
 */
export const addEquities = (formData: object) => {
  return Fetch('/role', {
    method: 'POST',
    body: JSON.stringify({
      ...formData
    })
  });
};

/**
 * 修改角色
 * @param formData
 */
export const modifyEquities = (formData: object) => {
  return Fetch('/role', {
    method: 'PUT',
    body: JSON.stringify({
      ...formData
    })
  });
};

/**
 * 删除角色
 */
export const deleteEquities = (id) => {
  return Fetch(`/role/${id}`, {
    method: 'DELETE'
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
