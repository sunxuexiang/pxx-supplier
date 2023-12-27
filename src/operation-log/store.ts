import { IOptions, Store } from 'plume2';
import { message } from 'antd';
import { fromJS } from 'immutable';

import { Const } from 'qmkit';

import LogActor from './actor/log-actor';
import * as webapi from './webapi';
import * as util from '../../web_modules/qmkit/util';

export default class AppStore extends Store {
  //btn加载
  btnLoading = false;

  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new LogActor()];
  }

  /**
   * 页面初始化
   * @param pageNum
   * @param pageSize
   */
  init = ({ pageNum, pageSize } = { pageNum: 0, pageSize: 15 }) => {
    this.dispatch('loading:start');
    //获取form数据
    let form = this.state()
      .get('form')
      .toJS();
    form['beginTime'] = form.beginTime.format(Const.DATE_FORMAT) + ':00';
    form['endTime'] = form.endTime.format(Const.DATE_FORMAT) + ':59';

    webapi
      .fetchOperationLogList({ ...form, pageNum, pageSize })
      .then(({ res }) => {
        if (res.code == Const.SUCCESS_CODE) {
          this.transaction(() => {
            this.dispatch('loading:end');
            this.dispatch('list:init', res.context.opLogPage);
            this.dispatch(
              'list:page',
              fromJS({ pageSize: pageSize, currentPage: pageNum + 1 })
            );
            this.btnLoading = false;
          });
        } else {
          message.error(res.message);
          if (res.code === 'K-110001') {
            this.dispatch('loading:end');
          }
        }
      });
  };

  /**
   * 搜索
   * @param params
   */
  onSearch = (params) => {
    if (__DEV__) {
      console.log('params--->', params);
    }
    this.dispatch('form:clear');
    this.dispatch('form:field', params);
    this.init({ pageNum: 0, pageSize: 15 });
  };

  /**
   * 按搜索条件导出
   * @returns {Promise<T>}
   */
  onExportByParams = (params) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        params['beginTime'] =
          params.beginTime.format(Const.DATE_FORMAT) + ':00';
        params['endTime'] = params.endTime.format(Const.DATE_FORMAT) + ':59';
        // 参数加密
        let base64 = new util.Base64();
        const token = (window as any).token;
        if (token) {
          let result = JSON.stringify({ ...params, token: token });
          let encrypted = base64.urlEncode(result);
          // 新窗口下载
          const exportHref =
            Const.HOST +
            `/system/operationLog/exportOperationLogByParams/${encrypted}`;
          window.open(exportHref);
        } else {
          message.error('请登录');
        }

        resolve();
      }, 500);
    });
  };
}
