import { Fetch } from 'qmkit';
type TResult = {
  code: string;
  message: string;
  context: any;
};
/**
 * 获取图片类目列表
 */
export const getImgCates = () => {
  return Fetch<TResult>('/store/resourceCates');
};
/**
 * 分页获取图片列表
 * @param param
 * @returns {Promise<IAsyncResult<T>>}
 */
export function fetchImages(params = {}) {
  return Fetch<TResult>('/store/resources', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}
