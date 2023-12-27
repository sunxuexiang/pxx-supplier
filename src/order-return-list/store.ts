import { Store } from 'plume2';
import { fromJS } from 'immutable';
import { message } from 'antd';
import { Const, util } from 'qmkit';
import TabActor from './actor/tab-actor';
import ListActor from './actor/list-actor';
import FormActor from './actor/form-actor';
import LoadingActor from './actor/loading-actor';
import * as webapi from './webapi';

export default class AppStore extends Store {
  bindActor() {
    return [
      new TabActor(),
      new ListActor(),
      new FormActor(),
      new LoadingActor()
    ];
  }

  constructor(props) {
    super(props);
    //debug
    (window as any)._store = this;
  }

  init = async (
    { pageNum, pageSize, flushSelected } = {
      pageNum: 0,
      pageSize: this.state().get('pageSize') || 10,
      flushSelected: true
    }
  ) => {
    this.dispatch('order-return-list:loading:start');
    //获取form数据
    let form = this.state()
      .get('form')
      .toJS();
    const key = this.state().getIn(['tab', 'key']);

    if (key != '0') {
      const values = key.split('-');
      form['returnFlowState'] = values[1];
    }
    if (form.presellFlag === 0) {
      form.presellFlag = false;
    } else if (form.presellFlag === 1) {
      form.presellFlag = true;
    }
    webapi
      .fetchOrderReturnList({ ...form, pageNum, pageSize })
      .then(({ res }) => {
        if (res.code === Const.SUCCESS_CODE) {
          const wareHouseVOPage =
            JSON.parse(localStorage.getItem('wareHouseVOPage')) || [];

          //  console.log(res.context.content, 'res.context');
          res.context.content.forEach((el) => {
            const iDs = [];
            const imgList = [];
            el.returnItems.concat(el.returnGifts).forEach((child) => {
              if (iDs.indexOf(child.skuId) === -1) {
                iDs.push(child.skuId);
                imgList.push(child);
              }
            });
            el.imgList = imgList;
            el.specNumber = iDs.length;
            wareHouseVOPage.forEach((ware) => {
              if (ware.wareId == el.wareId) {
                el.wareName = ware.wareName;
              }
            });
          });
          this.transaction(() => {
            this.dispatch('order-return-list:loading:end');
            this.dispatch('order-return-list:init', {
              flushSelected: flushSelected,
              ...res.context
            });
            this.dispatch(
              'order-return-list:page',
              fromJS({ currentPage: pageNum + 1, pageSize: pageSize })
            );
          });
        } else {
          message.error(res.message);
          if (res.code === 'K-110001') {
            this.dispatch('order-return-list:loading:end');
          }
        }
      });
  };

  onSearchFormChange = (searchFormParams) => {
    this.dispatch('order-return-list:form:field', searchFormParams);
  };

  /**
   * 搜索
   * @param params
   */
  onSearch = (params) => {
    this.dispatch('order-return-list:form:field', params);
    this.init();
  };

  onTabChange = (key) => {
    this.dispatch('order-return-list:tab:init', key);
    this.init();
  };

  // 驳回／拒绝收货 modal状态改变
  onRejectModalChange = (status) => {
    this.dispatch('order-return-list:reject-modal:change', fromJS(status));
  };

  onRejectModalHide = () => {
    this.dispatch('order-return-list:reject-modal:hide');
  };

  // 填写物流 modal状态改变
  onDeliverModalChange = (status) => {
    this.dispatch('order-return-list:deliver-modal:change', fromJS(status));
  };

  onDeliverModalHide = () => {
    this.dispatch('order-return-list:deliver-modal:hide');
  };

  // 线下退款 modal状态改变
  onRefundModalChange = (status) => {
    this.dispatch('order-return-list:refund-modal:change', fromJS(status));
  };

  onRefundModalHide = () => {
    this.dispatch('order-return-list:refund-modal:hide');
  };

  // 线下退款 modal状态改变
  onExportModalChange = (status) => {
    this.dispatch('order-return-list:export-modal:change', fromJS(status));
  };

  //线上退款 modal状态改变
  onRefundOnlineModalChange = (status) => {
    this.dispatch(
      'order-return-detail:refund-online-modal:change',
      fromJS(status)
    );
  };

  onlineRefundModalHide = () => {
    this.dispatch('order-return-detail:hide');
  };

  onExportModalHide = () => {
    this.dispatch('order-return-list:export-modal:hide');
  };

  onAudit = (rid: string) => {
    return webapi
      .audit(rid)
      .then(({ res }) => {
        if (res.code == Const.SUCCESS_CODE) {
          message.success('操作成功');
          this.init();
        } else {
          message.error(res.message);
        }
      })
      .catch(() => {});
  };

  onBatchAudit = (ids: string[]) => {
    return webapi
      .batchAudit(ids)
      .then(({ res }) => {
        if (res.code == Const.SUCCESS_CODE) {
          message.success('批量审核操作成功');
          this.init();
        } else {
          message.error(res.message || res.code);
        }
      })
      .catch(() => {});
  };

  onReject = (rid: string, reason: string) => {
    return webapi
      .reject(rid, reason)
      .then(({ res }) => {
        if (res.code == Const.SUCCESS_CODE) {
          message.success('操作成功');
          this.init();
        } else {
          message.error(res.message);
        }
      })
      .catch(() => {});
  };

  onDeliver = (rid: string, values) => {
    return webapi
      .deliver(rid, values)
      .then(({ res }) => {
        if (res.code == Const.SUCCESS_CODE) {
          message.success('操作成功');
          this.init();
        } else {
          message.error(res.message);
        }
      })
      .catch(() => {});
  };

  onReceive = (rid: string) => {
    return webapi
      .receive(rid)
      .then(({ res }) => {
        if (res.code == Const.SUCCESS_CODE) {
          message.success('操作成功');
          this.init();
        } else {
          message.error(res.message);
        }
      })
      .catch(() => {});
  };

  onBatchReceive = (ids: string[]) => {
    return webapi
      .batchReceive(ids)
      .then(({ res }) => {
        if (res.code == Const.SUCCESS_CODE) {
          message.success('操作成功');
          this.init();
        } else {
          message.error(res.message);
        }
      })
      .catch(() => {});
  };

  onRejectReceive = (rid: string, reason: string) => {
    return webapi.rejectReceive(rid, reason).then(({ res }) => {
      if (res.code == Const.SUCCESS_CODE) {
        message.success('操作成功');
        this.init();
      } else {
        message.error(res.message);
      }
    });
  };

  onRejectRefund = (rid: string, reason: string) => {
    return webapi.rejectRefund(rid, reason).then(({ res }) => {
      if (res.code == Const.SUCCESS_CODE) {
        message.success('操作成功');
        this.init();
      } else {
        message.error(res.message);
      }
    });
  };

  onCheckFunAuth = async (url: string, type: string) => {
    return await webapi.checkFunctionAuth(url, type);
  };

  onOnlineRefund = (rid: string, fromData: any) => {
    return webapi.refundOnline(rid, fromData).then((result) => {
      const { res } = result;
      const code = res.code;
      const errorInfo = res.message;

      // 提示异常信息
      if (code != Const.SUCCESS_CODE) {
        message.error(errorInfo);
      } else {
        // 退款的回调是异步的，立刻刷新页面可能退单的状态还没有被回调修改。所以先给个提示信息，延迟3秒后再刷新列表
        message.success('操作成功');
      }

      setTimeout(this.init, 3000);
    });
  };

  onOfflineRefund = (rid: string, formData: any) => {
    return webapi.refundOffline(rid, formData).then((result) => {
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
        this.init();
      }
    });
  };

  /**
   * 全选
   * @param checked
   */
  onCheckedAll = (checked: boolean) => {
    this.dispatch('order-return-list:checkAll', checked);
  };

  /**
   * 单选
   * @param index
   * @param checked
   */
  onChecked = (index: number, checked: boolean) => {
    this.dispatch('order-return-list:check', {
      index,
      checked
    });
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

    return this._onExport({ rids: selected.toJS() });
  };

  /**
   * 按搜索条件导出
   * @returns {Promise<IAsyncResult<TResult>>}
   */
  onExportByParams = () => {
    // 搜索条件
    let params = this.state()
      .get('form')
      .toJS();
    // tab
    const key = this.state().getIn(['tab', 'key']);
    if (key != '0') {
      const values = key.split('-');
      params['returnFlowState'] = values[1];
    }
    return this._onExport(params);
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
          const exportHref = Const.HOST + `/return/export/params/${encrypted}`;
          window.open(exportHref);
        } else {
          message.error('请登录');
        }

        resolve();
      }, 500);
    });
  };

  /**
   * 校验退款单的状态，是否已经在退款处理中
   * @param {string} rid
   * @returns {Promise<IAsyncResult<any>>}
   */
  checkRefundStatus = async (rid: string) => {
    return await webapi.checkRefundStatus(rid);
  };

  //退单确认收货
  receiveConfirm = async (id) => {
    const { res } = await webapi.receive(id);
    if (res && res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.init();
    } else {
      message.error(res.message || '');
    }
  };
}
