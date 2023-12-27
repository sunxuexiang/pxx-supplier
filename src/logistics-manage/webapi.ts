/**
 * Created by feitingting on 2017/6/20.
 */
import { Fetch } from 'qmkit';
type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 获取所有的物流接口
 * @returns {Promise<IAsyncResult<T>>}
 */
export const fetchAllExpress = () => {
  return Fetch<TResult>('/store/expressCompany/all');
};

/**
 * 获取商家勾选的物流接口
 * @returns {Promise<IAsyncResult<T>>}
 */
export const fetchCheckedExpress = () => {
  return Fetch<TResult>('/store/expressCompany');
};

/**
 * 删除商家使用的物流接口
 * @param id
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const deleteExpress = (id: any, expressCompanyId: any) => {
  return Fetch<TResult>(`/store/expressCompany/${id}/${expressCompanyId}`, {
    method: 'DELETE'
  });
};

/**
 * 添加商家绑定的物流接口
 * @param expressId
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const addExpress = (expressId) => {
  return Fetch<TResult>(`/store/expressCompany`, {
    method: 'POST',
    body: JSON.stringify({
      expressCompanyId: expressId
    })
  });
};
