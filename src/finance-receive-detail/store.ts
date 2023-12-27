import { Store } from 'plume2';
import { message } from 'antd';
import { fromJS, Map } from 'immutable';
import { Const, util } from 'qmkit';
import moment from 'moment';
import * as webapi from './webapi';
import ListActor from './actor/list-actor';
import SearchActor from './actor/search-actor';
import LoadingActor from './actor/loading-actor';
import SelectedActor from './actor/selected-actor';
import ExportActor from './actor/export-actor';

export default class AppStore extends Store {
  bindActor() {
    return [
      new ListActor(),
      new SearchActor(),
      new LoadingActor(),
      new SelectedActor(),
      new ExportActor()
    ];
  }

  constructor(props) {
    super(props);
    //debug
    (window as any)._store = this;
  }

  //;;;;;;;;;;;;;action;;;;;;;;;;;;;;;;;;;;;;;
  init = async (param?) => {
    this.dispatch('loading:start');
    param = this.state()
      .get('searchForm')
      .merge(fromJS(param))
      .toJS();
    param.startTime =
      param.dateRange[0] &&
      moment(param.dateRange[0])
        .format('YYYY-MM-DD')
        .toString();
    param.endTime =
      param.dateRange[1] &&
      moment(param.dateRange[1])
        .format('YYYY-MM-DD')
        .toString();

    if (param && param.endTime) {
      param.endTime = moment(param.endTime)
        .add(1, 'day')
        .format(Const.DAY_FORMAT);
    }
    //根据收款单时间排序
    param.sortByReceiveTime = true;
    const { res } = await webapi.fetchPayOrderList(param);
    const { res: offlineAccounts } = await webapi.offlineAccounts();
    const { res: sumPrice } = await webapi.sumPayOrderPrice(param);
    const { res: channel } = await webapi.getChannelsByGateWaysId(1);
    let channelJson = channel.context;
    let channelValue = [];
    channelJson['channelItemList'].forEach((value) => {
      channelValue.push(Map({ id: value['id'], name: value['name'] }));
    });

    this.transaction(() => {
      this.dispatch('loading:end');
      this.dispatch('list:init', res);
      this.dispatch('offlineAccounts', offlineAccounts);
      this.dispatch('channelItem', channelValue);
      this.dispatch('sumPrice', (sumPrice as any).context);
      this.dispatch('current', param && param.pageNum + 1);
    });
  };

  onFormChange = (searchParam) => {
    this.dispatch('change:searchForm', searchParam);
  };

  /**
   * 查询
   * @returns {Promise<void>}
   */
  onSearch = async () => {
    const param = this.state().get('searchForm');
    this.dispatch('current', 1);
    this.init(param);
  };

  onSelect = (list) => {
    this.dispatch('select:init', list);
  };

  messageByResult(res) {
    if (res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.init();
    } else {
      message.error(res.message);
    }
  }

  /**
   * 按选中的编号导出
   * @returns {Promise<T>}
   */
  onExportByIds = () => {
    let selected = this.state().get('selected');
    if (selected.count() === 0) {
      message.error('请选择要导出的数据');
      return new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
    }

    return this._onExport({ payOrderIds: selected.toJS() }, () =>
      this.dispatch('select:init', [])
    );
  };

  /**
   * 按搜索条件导出
   * @returns {Promise<IAsyncResult<TResult>>}
   */
  onExportByParams = () => {
    const param = this.state()
      .get('searchForm')
      .toJS();
    // param.startTime = momnet(param.dateRange[0]).format('yyyy-MM-dd HH:mm').toString()
    // param.endTime = momnet(param.dateRange[1]).format('yyyy-MM-dd HH:mm').toString()
    return this._onExport(param, () => this.dispatch('select:init', []));
  };

  _onExport = (params: {}, action: Function) => {
    action();
    return new Promise((resolve) => {
      setTimeout(() => {
        // 参数加密
        let base64 = new util.Base64();
        const token = (window as any).token;
        if (token) {
          let result = JSON.stringify({
            ...params,
            payOrderStatus: 0,
            token: token
          });
          let encrypted = base64.urlEncode(result);

          // 新窗口下载
          const exportHref = Const.HOST + `/account/export/params/${encrypted}`;
          window.open(exportHref);
        } else {
          message.error('请登录');
        }

        resolve();
      }, 500);
    });
  };

  /**
   * 导出状态
   * @param status
   */
  onExportModalChange = (status) => {
    this.dispatch('receive:export-modal:change', fromJS(status));
  };

  /**
   * 隐藏导出框
   */
  onHideExportModal = () => {
    this.dispatch('receive: hide-export');
  };
}
