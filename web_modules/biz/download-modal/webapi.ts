/**
 * Created by feitingting on 2017/11/7.
 */
import { Fetch } from 'qmkit';

export const downLoadReport = (params = {}) => {
  return Fetch<TResult>(`/export/send`, {
    method: 'POST',
    body: JSON.stringify(params)
  });
};
