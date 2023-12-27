import { Fetch } from 'qmkit';
type TResult = {
  code: string;
  message: string;
  context: any;
};
/**
 * 获取图片类目列表
 */
export const getVideoCate = () => {
  return Fetch<TResult>('/store/resourceCates');
};
/**
 * 分页获取视频列表
 * @param param
 * @returns {Promise<IAsyncResult<T>>}
 */
export function getVideoData(params = {}) {
  return Fetch<TResult>('/store/resources', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 获取上传OSS签名
 * @param param
 * @returns {Promise<IAsyncResult<T>>}
 */
export function getOssToken() {
  return Fetch<TResult>('/store/resource/getOssToken');
}

/**
 * 保存视频上传后信息
 * @param param
 * @returns {Promise<IAsyncResult<T>>}
 */
export function saveResources(params = {}) {
  return Fetch<TResult>('/store/saveResources', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}