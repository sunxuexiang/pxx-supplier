import 'whatwg-fetch';
import { Const } from 'qmkit';

export const getList = (params) => {
  return fetch(Const.X_XITE_OPEN_HOST + '/api/tpl/list', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: (window as any).token
    },
    body: JSON.stringify(params)
  }).then((res: any) => {
    return res.json();
  });
};

export const queryTemplateList = (params) => {
  return fetch(Const.X_XITE_ADMIN_HOST + '/xsite-bin/user-tpl-svc/templates', {
    method: 'POST',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  }).then((res: any) => {
    return res.json();
  });
};

export const delTemplate = (params) => {
  return fetch(Const.X_XITE_ADMIN_HOST + '/xsite-bin/user-tpl-svc/delete', {
    method: 'POST',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  }).then((res: any) => {
    return res.json();
  });
};

export const copyTemplate = (params) => {
  return fetch(Const.X_XITE_ADMIN_HOST + '/xsite-bin/user-tpl-svc/update', {
    method: 'POST',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  }).then((res: any) => {
    return res.json();
  });
};

export const updateTitle = (params) => {
  return fetch(Const.X_XITE_ADMIN_HOST + '/xsite-bin/user-tpl-svc/update', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: (window as any).token
    },
    body: JSON.stringify(params)
  }).then((res: any) => {
    return res.json();
  });
};
export const getStore = () => {
  return fetch(Const.HOST + '/store/storeInfo', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + (window as any).token
    }
  }).then((res: any) => {
    return res.json();
  });
};