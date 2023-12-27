import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 查询基本信息
 */
export const fetchSetting = () => {
  return Fetch<TResult>('/store/storeBaseInfo');
};

/**
 * 修改基本信息
 */
export const editSetting = (params = {}) => {
  return Fetch<TResult>('/store/storeBaseInfo', {
    method: 'PUT',
    body: JSON.stringify({
      ...params
    })
  });
};

export const uploadBase64File = (data = {}) => {
  return Fetch<TResult>('/uploadBase64File?cateId=34343&resourceType=IMAGE', {
    method: 'POST',
    body: JSON.stringify({
      ...data
    })
  });
};

/**
 * 获取店招边框列表
 */
export function fetchImages() {
  return Fetch<TResult>('/store-border-image/list', {
    method: 'POST'
  });
}
