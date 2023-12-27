import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 获取列表
 */
export const getCateList = (params = {}) => {
  // return Fetch<TResult>('/roleMenuFunc/otherMenus');
  return Fetch('/videoResourceCateManager/video/resourceCates', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 分页获取视频列表
 * @param param
 * @returns {Promise<IAsyncResult<T>>}
 */
export function fetchVideos(params = {}) {
  return Fetch('/videoResource/resources', {
    method: 'POST',
    body: JSON.stringify(params)
  });
  // return mockFetch(data);
}

const mockFetch = async (data) => {
  const res = await new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, 50);
  });
  return { res };
};
