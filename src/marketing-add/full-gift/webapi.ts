import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 新增满赠
 * @returns {Promise<IAsyncResult<T>>}
 */
export const addFullGift = giftBean => {
  return Fetch<TResult>('/marketing/fullGift', {
    method: 'POST',
    body: JSON.stringify(giftBean)
  });
};

/**
 * 编辑满赠
 * @returns {Promise<IAsyncResult<T>>}
 */
export const updateFullGift = giftBean => {
  return Fetch<TResult>('/marketing/fullGift', {
    method: 'PUT',
    body: JSON.stringify(giftBean)
  });
};

/**
 * 草稿满赠
 * @returns {Promise<IAsyncResult<T>>}
 */
 export const addDraftFullGift = giftBean => {
  return Fetch<TResult>('/marketing/fullGift/draft', {
    method: 'POST',
    body: JSON.stringify(giftBean)
  });
};

/**
 * 编辑草稿满赠
 * @returns {Promise<IAsyncResult<T>>}
 */
 export const updateDraftFullGift = giftBean => {
  return Fetch<TResult>('/marketing/fullGift/draft', {
    method: 'PUT',
    body: JSON.stringify(giftBean)
  });
};
