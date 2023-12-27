import { Fetch } from 'qmkit';
import { IMap } from 'typings/globalType';

/**
 * 获取部门列表
 */
export const getDepartmentList = () => {
  return Fetch('/department/list-department-tree', {
    method: 'POST',
    body: JSON.stringify({})
  });
};

/**
 * 添加
 */
export const addDepartment = (formData: IMap) => {
  return Fetch('/department/add', {
    method: 'POST',
    body: JSON.stringify({
      ...formData.toJS()
    })
  });
};

/**
 * 修改
 */
export const modifyDepartmentName = (formData: IMap) => {
  return Fetch('/department/modifyDepartmentName', {
    method: 'PUT',
    body: JSON.stringify({
      ...formData.toJS()
    })
  });
};

/**
 * 删除
 */
export const deleteDepartment = (departmentId: number) => {
  return Fetch(`/department/${departmentId}`, {
    method: 'DELETE'
  });
};

/**
 * 过滤员工信息
 * @param params
 */
export const filterEmployee = (params) => {
  return Fetch<TResult>('/customer/employees', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
};

/**
 * 拖拽排序
 */
export const dragSort = (sortList, sourceIndex, targetIndex) => {
  return Fetch('/department/sort', {
    method: 'PUT',
    body: JSON.stringify({
      list: sortList,
      sourceIndex: sourceIndex,
      targetIndex: targetIndex
    })
  });
};

/**
 * 修改主管
 */
export const modifyLeader = (departmentId, oldEmployeeId, newEmployeeId) => {
  return Fetch('/department/modify-leader', {
    method: 'PUT',
    body: JSON.stringify({
      departmentId: departmentId,
      oldEmployeeId: oldEmployeeId,
      newEmployeeId: newEmployeeId
    })
  });
};
