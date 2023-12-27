import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 获取须知列表
 */
export const getInstructionsList = (filterParams = {}) => {
  return Fetch<TResult>('/positionPicture/list', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
};

/**
 * 添加
 */
export const addInstructions = (formData) => {
  return Fetch<TResult>('/positionPicture/add', {
    method: 'POST',
    body: JSON.stringify({
      ...formData
    })
  });
};

/**
 * 删除
 */
export const deleteInstructions = (formData = {}) => {
  return Fetch<TResult>('/positionPicture/delet', {
    method: 'DELETE',
    body: JSON.stringify({
      ...formData
    })
  });
};

/**
 * 修改
 */
export const editInstructions = (formData) => {
  return Fetch<TResult>('/positionPicture/update', {
    method: 'PUT',
    body: JSON.stringify({
      ...formData
    })
  });
};
