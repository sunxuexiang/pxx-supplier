import 'whatwg-fetch';
import { Const } from 'qmkit';
export const getTokenRQ = () => {
  const params = {
    customerAccount: Const.customerAccount,
    customerPassword: Const.customerPassword
  };
  return fetch(Const.X_XITE_RENDER_HOST + '/login', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  }).then((res: any) => {
    return res.json();
  });
};

export const getMsgList = (params) => {
  return fetch(Const.X_XITE_RENDER_HOST + '/appMessage/page', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + params.token
    },
    body: JSON.stringify(params.body)
  }).then((res: any) => {
    return res.json();
  });
};
