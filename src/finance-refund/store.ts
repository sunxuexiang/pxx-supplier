import { Store } from 'plume2';
import ListActor from './actor/list-actor';

import * as webapi from './webapi';
import SearchActor from './actor/search-actor';
import LoadingActor from './actor/loading-actor';
import SelectedActor from './actor/selected-actor';
import { message } from 'antd';
import VisibleActor from './actor/visible-actor';
import EditActor from './actor/edit-actor';
import { fromJS } from 'immutable';
import RefuseActor from './actor/refuse-actor';
import { Const } from 'qmkit';

export default class AppStore extends Store {
  bindActor() {
    return [
      new ListActor(),
      new SearchActor(),
      new LoadingActor(),
      new SelectedActor(),
      new VisibleActor(),
      new EditActor(),
      new RefuseActor()
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
    Promise.all([
      webapi.fetchRefundOrderList(param),
      webapi.offlineAccounts()
    ]).then((res) => {
      if (res[0].res.code != Const.SUCCESS_CODE) {
        message.error(res[0].res.message);
      }
      if (res[1].res.code != Const.SUCCESS_CODE) {
        message.error(res[1].res.message);
      }
      this.transaction(() => {
        this.dispatch('loading:end');
        this.dispatch('list:init', res[0].res.context);
        this.dispatch('offlineAccounts', res[1].res.context);
        this.dispatch('current', param && param.pageNum + 1);
      });
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
    const param = this.state()
      .get('searchForm')
      .toJS();

    this.init(param);
    this.dispatch('current', 1);
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

  onDestory = async (returnOrderCode) => {
    const { res } = await webapi.destory(returnOrderCode);
    this.messageByResult(res);
  };

  onCreateRefund = async (
    customerId,
    refundId,
    returnOrderCode,
    returnPrice
  ) => {
    const { res: result } = await webapi.checkFunctionAuth(
      '/return/refund/*/online',
      'POST'
    );
    if (!result.context) {
      message.error('此功能您没有权限访问');
      return;
    }

    const { res } = await webapi.fetchAccountsByCustomerId(customerId);
    this.dispatch('customerAccounts', fromJS(res));
    this.dispatch('refundId', refundId);
    this.dispatch('offlineAccount:customerId', customerId);
    this.dispatch('returnOrderCode', returnOrderCode);
    this.dispatch('edit:returnAmount', returnPrice);
    this.dispatch('modal:show');
  };

  /**
   * 在线支付退款
   * @param returnOrderCode
   * @returns {Promise<void>}
   */
  onCreateOnlineRefund = async (returnOrderCode) => {
    const { res } = await webapi.refundOnline(returnOrderCode);
    this.messageByResult(res);
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
    refundForm.createTime = refundForm.createTime.format(Const.DATE_FORMAT);
    refundForm.offlineAccountId = refundForm.accountId;
    refundForm.customerId = this.state().get('refundOfflineCustomerId');
    //保存
    webapi
      .refundOffline(this.state().get('returnOrderCode'), refundForm)
      .then((result) => {
        const { res } = result;
        const code = res.code;
        const errorInfo = res.message;
        // 提示异常信息
        if (code != Const.SUCCESS_CODE) {
          message.error(errorInfo);

          if (code === 'K-040017') {
            throw Error('K-040017');
          }
        } else {
          message.success('操作成功');
        }

        this.dispatch('modal:hide');

        this.init();
      });
  };

  /**
   * 选中的账户id
   * @param accountId
   */
  onSelectAccountId = (accountId: string) => {
    this.dispatch('offlineAccount:selectedAccountId', accountId);
  };

  /**
   * 显示拒绝退款弹窗
   */
  onCreateRefuse = async (refundId: string) => {
    const { res: result } = await webapi.checkFunctionAuth(
      '/account/refundOrders/refuse',
      'PUT'
    );
    if (!result.context) {
      message.error('此功能您没有权限访问');
      return;
    }

    this.dispatch('refuse:refundId', refundId);
    this.dispatch('refuse:show');
  };

  /**
   * 隐藏拒绝退款
   */
  onCancelRefuse = () => {
    this.dispatch('refuse:hide');
  };

  /**
   * 拒绝原因
   * @param reason
   */
  onChangeReason = (reason: string) => {
    this.dispatch('refuseReason', reason);
  };

  /**
   * 添加拒绝退款
   * @returns {Promise<void>}
   */
  saveRefuse = async () => {
    const refuseForm = this.state()
      .get('refuseForm')
      .toJS();
    const { res } = await webapi.saveRefuse(refuseForm);
    if (res.code === Const.SUCCESS_CODE) {
      message.success(res.message);
      this.transaction(() => {
        this.dispatch('refuse:hide');
        this.dispatch('current', 1);
        this.init();
      });
    } else {
      message.error(res.message);
    }
  };

  /**
   * 校验退款单的状态，是否已经在退款处理中
   * @param {string} rid
   * @returns {Promise<IAsyncResult<any>>}
   */
  checkRefundStatus = async (rid: string) => {
    return await webapi.checkRefundStatus(rid);
  };
}
