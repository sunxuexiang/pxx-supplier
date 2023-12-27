import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 获取须知列表
 */
export const uploadBase64File = (data = {}) => {
  return Fetch<TResult>('/uploadBase64File?cateId=34343&resourceType=IMAGE', {
    method: 'POST',
    body: JSON.stringify({
      ...data
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
