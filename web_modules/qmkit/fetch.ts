import 'whatwg-fetch';
import Const from './config';
import { util } from 'qmkit';
import * as _ from 'lodash';
import { message } from 'antd';

/**
 * 定义异步返回结果
 */
export interface IAsyncResult<T> {
  res: T;
  err: Error;
}

/**
 * 封装业务fetch
 * @param input 输入url等
 * @param init 初始化http header信息等
 */
export default async function Fetch<T>(
  input: RequestInfo,
  init?: RequestInit
): Promise<IAsyncResult<T>> {
  try {
    if (!(window as any).token) {
      //判断是否登陆
      util.isLogin();
    }

    if (typeof input === 'string') {
      input += `${
        input.indexOf('?') == -1 ? '?reqId=' : '&reqId='
      }${Math.random()}`;
    }

    const request = {
      method: 'GET',
      mode: 'cors',
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization:
          'Bearer' + ((window as any).token ? ' ' + (window as any).token : '')
      },
      credentials: 'include'
    };
    let r = init && init.body;
    if (r) {
      init.body = JSON.stringify(trimValueDeep(JSON.parse(r as string)));
    }

    const merge = Object.assign({}, request, init);
    let url = Const.HOST + input;
    //去掉url中可能存在的//
    url = url.replace(/([^:])\/\//, '$1/');
    const res = await fetch(url, merge);

    const resJSON = await res.json();
    // console.log(resJSON,'resJSON')
    if (resJSON.code === 'K-999996') {
      message.error(resJSON.message);
      return;
    }

    if (resJSON === 'Method Not Allowed') {
      message.error('此功能您没有权限访问');
      return;
    }

    // 账号禁用
    if (resJSON.code === 'K-000005') {
      message.error('账号已被禁用');
      util.logout();
      return;
    }

    if (resJSON.code === 'K-000015') {
      message.error('获取授权失败');
      util.logout();
      return;
    }

    //TODO 和后端约定返回的数据格式, 然后再细分
    return {
      res: resJSON,
      err: null
    };
  } catch (err) {
    //dev
    if (process.env.NODE_ENV != 'production') {
      console.warn(err);
    }
    //全局的错误提示
    return {
      res: null,
      err
    };
  }
}

/**
 * 所有请求参数trim
 * @param value
 */
function trimValueDeep(value) {
  return value && !_.isNumber(value) && !_.isBoolean(value) && !_.isDate(value)
    ? _.isString(value)
      ? _.trim(value)
      : _.isArray(value)
        ? _.map(value, trimValueDeep)
        : _.mapValues(value, trimValueDeep)
    : value;
}
