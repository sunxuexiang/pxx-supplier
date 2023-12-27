import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
};

// 查询开票项目
export const fetchFinaceTicket = (params = {}) => {
  return Fetch('/account/invoiceProjects', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
};

// 新增开票项目
export const addFinaceTicket = (params = {}) => {
  return Fetch<TResult>('/account/invoiceProject', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
};

// 编辑开票项目
export const editFinaceTicket = (params = {}) => {
  return Fetch<TResult>('/account/invoiceProject', {
    method: 'PUT',
    body: JSON.stringify({
      ...params
    })
  });
};

// 删除项目
export const deleteFinaceTicket = (projectId: string) => {
  return Fetch<TResult>(`/account/invoiceProject`, {
    method: 'DELETE',
    body: JSON.stringify({
      projectId: projectId
    })
  });
};
