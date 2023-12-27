import { IOptions, Store } from 'plume2';
import { message } from 'antd';
import LoadingActor from './actor/loading-actor';
import ListActor from './actor/list-actor';
import FormActor from './actor/form-actor';
import TabActor from './actor/tab-actor';
import * as webapi from './webapi';
import { fromJS } from 'immutable';
import { Const, history, util } from 'qmkit';

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
    return [
      new LoadingActor(),
      new ListActor(),
      new FormActor(),
      new TabActor()
    ];
  }

  /**
   * 页面初始化
   * @param pageNum
   * @param pageSize
   */
  init = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    this.dispatch('loading:start');
    //获取form数据
    let form = this.state()
      .get('form')
      .toJS();
    const key = this.state().getIn(['tab', 'key']);

    if (key != '0') {
      const [state, value] = key.split('-');
      form['tradeState'][state] = value;
    }
    form['orderType'] = 'POINTS_ORDER';
    webapi.fetchOrderList({ ...form, pageNum, pageSize }).then(({ res }) => {
      if (res.code == Const.SUCCESS_CODE) {
        this.transaction(() => {
          this.dispatch('loading:end');
          this.dispatch('list:init', res.context);
          this.dispatch('list:page', fromJS({ currentPage: pageNum + 1 }));
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

  onTabChange = (key) => {
    this.dispatch('tab:init', key);
    this.init({ pageNum: 0, pageSize: 10 });
  };

  /**
   * 搜索
   * @param params
   */
  onSearch = (params) => {
    this.dispatch('form:clear');
    this.dispatch('form:field', params);
    this.init({ pageNum: 0, pageSize: 10 });
  };

  /**
   * 全选
   * @param checked
   */
  onCheckedAll = (checked: boolean) => {
    this.dispatch('list:checkedAll', checked);
  };

  /**
   * 单选
   * @param index
   * @param checked
   */
  onChecked = (index: number, checked: boolean) => {
    this.dispatch('list:check', {
      index,
      checked
    });
  };

  /**
   * 发货前 验证订单是否存在售后申请
   * @param tid
   * @returns {Promise<void>}
   */
  onCheckReturn = async (tid: string) => {
    history.push({
      pathname: `/points-order-detail/${tid}`,
      state: { tab: '2' }
    });
  };

  /**
   * 确认收货
   */
  onConfirm = async (tid: string) => {
    const { res } = await webapi.confirm(tid);
    if (res.code == Const.SUCCESS_CODE) {
      //成功
      message.success('确认收货成功!');
      //刷新
      this.init();
    } else if (res.code == 'K-000001') {
      message.error('订单状态已改变，请刷新页面后重试!');
    } else {
      message.error(res.message);
    }
  };

  /**
   * 隐藏导出modal
   */
  onExportModalHide = () => {
    this.dispatch('list:export-modal:hide');
  };

  /**
   * 线上导出modal
   * @param status
   */
  onExportModalChange = (status) => {
    this.dispatch('list:export-modal:change', fromJS(status));
  };

  /**
   * 按选中的编号导出
   * @returns {Promise<T>}
   */
  onExportByIds = () => {
    let selected = this.state()
      .get('dataList')
      .filter((v) => v.get('checked'))
      .map((v) => v.get('id'))
      .toJS();

    if (selected.length === 0) {
      message.error('请选择要导出的订单');
      return new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
    }

    return this._onExport({ ids: selected });
  };

  /**
   * 按搜索条件导出
   * @returns {Promise<T>}
   */
  onExportByParams = () => {
    // 搜索条件
    let params = this.state()
      .get('form')
      .toJS();
    // tab
    const key = this.state().getIn(['tab', 'key']);
    if (key != '0') {
      const [state, value] = key.split('-');
      params['tradeState'][state] = value;
    }
    const total = this.state().get('total');
    if (total > 0) {
      return this._onExport(params);
    } else {
      message.error('当前搜索结果没有要导出的订单');
      return new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
    }
  };

  _onExport = (params: {}) => {
    params['orderType'] = 'POINTS_ORDER';
    return new Promise((resolve) => {
      setTimeout(() => {
        // 参数加密
        let base64 = new util.Base64();
        const token = (window as any).token;
        if (token) {
          let result = JSON.stringify({ ...params, token: token });
          let encrypted = base64.urlEncode(result);

          // 新窗口下载
          const exportHref = Const.HOST + `/points/trade/export/params/${encrypted}`;
          window.open(exportHref);
        } else {
          message.error('请登录');
        }

        resolve();
      }, 500);
    });
  };
}
