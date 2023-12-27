import { Store } from 'plume2';
import { message } from 'antd';
import { fromJS, Map } from 'immutable';
import momnet from 'moment';
import { Const, util } from 'qmkit';
import * as webapi from './webapi';
import ListActor from './actor/list-actor';
import SearchActor from './actor/search-actor';
import LoadingActor from './actor/loading-actor';
import SelectedActor from './actor/selected-actor';
import VisibleActor from './actor/visible-actor';
import EditActor from './actor/edit-actor';
import ExportActor from './actor/export-actor';

export default class AppStore extends Store {
  bindActor() {
    return [
      new ListActor(),
      new SearchActor(),
      new LoadingActor(),
      new SelectedActor(),
      new VisibleActor(),
      new EditActor(),
      new ExportActor()
    ];
  }

  constructor(props) {
    super(props);
    //debug
    (window as any)._store = this;
  }

  //;;;;;;;;;;;;;action;;;;;;;;;;;;;;;;;;;;;;;
  init = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    this.dispatch('loading:start');
    //查询已退款的
    const { res } = await webapi.fetchRefundOrderList({
      refundStatus: 2,
      pageNum,
      pageSize
    });
    const { res: offlineAccounts } = await webapi.offlineAccounts();
    const { res: sumReturnPrice } = await webapi.sumReturnPrice();
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
      this.dispatch('sumReturnPrice', (sumReturnPrice as any).context);
    });
  };

  onFormChange = (searchParam) => {
    this.dispatch('change:searchForm', searchParam);
  };

  /**
   * 查询
   * @returns {Promise<void>}
   */
  onSearch = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    const param = this.state()
      .get('searchForm')
      .toJS();

    const { res } = await webapi.fetchRefundOrderList({
      ...param,
      pageNum,
      pageSize
    });
    const { res: sumReturnPrice } = await webapi.sumReturnPrice(param);

    this.transaction(() => {
      this.dispatch('loading:end');
      this.dispatch('list:init', res);
      this.dispatch('sumReturnPrice', (sumReturnPrice as any).context);
    });
  };

  onSelect = (list) => {
    this.dispatch('select:init', list);
  };

  onConfirm = async (id) => {
    let ids = [];
    ids.push(id);
    const { res } = await webapi.confirm();
    this.messageByResult(res);
  };

  onDestory = async (id) => {
    const { res } = await webapi.destory(id);
    this.messageByResult(res);
  };

  onCreateRefund = async (customerId, refundId) => {
    const { res } = await webapi.fetchAccountsByCustomerId(customerId);
    this.dispatch('customerAccounts', fromJS(res));
    this.dispatch('refundId', refundId);
    this.dispatch('modal:show');
  };

  onCancel = async () => {
    this.dispatch('modal:hide');
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
   * 保存
   * @param refundForm
   * @returns {Promise<void>}
   */
  onSave = async (refundForm) => {
    refundForm.refundId = this.state().get('refundId');
    refundForm.createTime = momnet(refundForm.createTime)
      .format('YYYY-MM-DD')
      .toString();
    refundForm.offlineAccountId = refundForm.accountId;
    //保存
    const { res } = await webapi.addRefundBill(refundForm);
    if (res.code === Const.SUCCESS_CODE) {
      message.success(res.message);
      this.dispatch('modal:hide');
      this.init();
    } else {
      message.error(res.message);
    }
  };

  /**
   * 选中的账户id
   * @param accountId
   */
  onSelectAccountId = (accountId: string) => {
    this.dispatch('offlineAccount:selectedAccountId', accountId);
  };

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

    return this._onExport({ refundIds: selected.toJS() });
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
    return this._onExport(param);
  };

  _onExport = (params: {}) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 参数加密
        let base64 = new util.Base64();
        const token = (window as any).token;
        if (token) {
          let result = JSON.stringify({ ...params, token: token });
          let encrypted = base64.urlEncode(result);

          // 新窗口下载
          const exportHref = Const.HOST + `/account/export/refund/${encrypted}`;
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
    this.dispatch('refund:export-modal:change', fromJS(status));
  };

  /**
   * 隐藏导出框
   */
  onHideExportModal = () => {
    this.dispatch('refund: hide-export');
  };
}
