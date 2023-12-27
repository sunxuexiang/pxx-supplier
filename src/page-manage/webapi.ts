import 'whatwg-fetch';
import { Const } from 'qmkit';

export const getTplList = (params) => {
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
  return fetch(
    Const.X_XITE_ADMIN_HOST + '/xsite-bin/user-tpl-svc/queryTemplateList',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: (window as any).token
      },
      body: JSON.stringify(params)
    }
  ).then((res: any) => {
    return res.json();
  });
};

export const copyPage = (params) => {
  return fetch(Const.X_XITE_OPEN_HOST + '/api/page/copy', {
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

export const delPage = (params) => {
  return fetch(Const.X_XITE_OPEN_HOST + '/api/page/delete', {
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

export const setIndex = (params) => {
  return fetch(Const.X_XITE_OPEN_HOST + '/api/page/activate/set', {
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

export const updateTitle = (params) => {
  return fetch(Const.X_XITE_OPEN_HOST + '/api/page/update/title', {
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
