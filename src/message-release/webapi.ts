import { Fetch } from 'qmkit';

/**
 * 新增
 * @param params  /pushMessage/add
 * @returns
 */
export const pushMessageAdd = (params) => {
  return Fetch('/pushMessage/add', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
};

/**
 * 列表
 * @param params  /pushMessage/add
 * @returns
 */
export const pushMessageList = (params) => {
  return Fetch('/pushMessage/page', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
};

/**
 * 删除
 *  /pushMessage/delete/{msgId}
 */
export const pushMessageDelete = (id) => {
  return Fetch(`/pushMessage/delete/${id}`, {
    method: 'DELETE'
  });
};
