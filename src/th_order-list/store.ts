import { IOptions, Store } from 'plume2';
import { message } from 'antd';
import LoadingActor from './actor/loading-actor';
import ListActor from './actor/list-actor';
import FormActor from './actor/form-actor';
import TabActor from './actor/tab-actor';
import * as webapi from './webapi';
import dex from './dex.json';
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
  init = async ({ pageNum, pageSize } = { pageNum: 0, pageSize:  this.state().get('pageSize')||10  }) => {
    this.dispatch('loading:start');
    //获取form数据
    let form = this.state().get('form').toJS();
    const key = this.state().getIn(['tab', 'key']);

   if (key != '0') {
      const [state, value] = key.split('-');
      form['tradeState'][state] = value;
    } 
    form['orderType'] = 'NORMAL_ORDER'; 
    // const { res: needRes } = await webapi.getOrderNeedAudit();
    // if (needRes.code == Const.SUCCESS_CODE) {
   


      webapi.fetchOrderList({ ...form, pageNum, pageSize }).then(({ res }) => {
        
        if (res.code == Const.SUCCESS_CODE) {
          this.transaction(() => {
            this.dispatch('loading:end');
            this.dispatch('list:init', res.context);
            this.dispatch('list:page', fromJS({ currentPage: res.context?.number+1||1,pageSize }));
            // this.dispatch('list:setNeedAudit', needRes.context.audit);
            this.btnLoading = false;
          });
        } else {
          message.error(res.message);
          if (res.code === 'K-110001') {
            this.dispatch('loading:end');
          }
        }
      });


    // }
  };

  onTabChange = (key) => {
    this.dispatch('tab:init', key);
    this.init();
  };

  /**
   * 搜索
   * @param params
   */
  onSearch = (params) => {
    this.dispatch('form:clear');
    this.dispatch('form:field', params);
    this.init();
  };

  /**
   * 全选
   * @param checked
   */
  onCheckedAll = (checked: boolean) => {
    this.dispatch('list:checkedAll', checked);
  };

  /**
   * 增加数量
   * @param checked
   */
  setProviderNum = (checked) => {
    this.dispatch('list:providerNum', checked);
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
   * 批量审核
   */
  onBatchAudit = async () => {
    const checkedIds = this.state()
      .get('dataList')
      .filter((v) => v.get('checked'))
      .map((v) => v.get('id'))
      .toJS();

    if (checkedIds.length == 0) {
      message.error('请选择需要操作的订单');
      return;
    }

    const { res } = await webapi.batchAudit(checkedIds);
    if (res.code == Const.SUCCESS_CODE) {
      message.success('批量审核成功');
      //refresh
      this.init();
    } else {
      message.error('批量审核失败');
    }
  };

  onAudit = async (tid: string, audit: string, reason?: string) => {
    if (audit !== 'CHECKED') {
      if (!reason.trim()) {
        message.error('请填写驳回原因');
        return;
      }
    }

    if (!this.btnLoading) {
      this.btnLoading = true;
      //set loading true
      // this.dispatch('detail-actor:setButtonLoading', true)

      const { res } = await webapi.audit(tid, audit, reason);
      this.hideRejectModal();
      if (res.code == Const.SUCCESS_CODE) {
        message.success(audit == 'CHECKED' ? '审核成功' : '驳回成功');
        this.init();
      } else {
        message.error(
          res.message || (audit == 'CHECKED' ? '审核失败' : '驳回失败')
        );
        this.btnLoading = false;
        //set loading false
        // this.dispatch('detail-actor:setButtonLoading', false)
      }
    }
  };

  onRetrial = async (tid: string) => {
    const { res } = await webapi.retrial(tid);
    if (res.code == Const.SUCCESS_CODE) {
      this.init();
      message.success('回审成功!');
    } else {
      message.error(res.message);
    }
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
   * 订单取消
   */
  cancelOrder = async (tid: string) => {
    const { res } = await webapi.cancelOrder(tid);
    if (res.code == Const.SUCCESS_CODE) {
      //成功
      message.success('取消成功!');
      //刷新
      this.init();
    } else if (res.code == 'K-000001') {
      message.error('取消失败!');
    } else {
      message.error(res.message);
    }
  };

  /**
   * 发货前 验证订单是否存在售后申请
   * @param tid
   * @returns {Promise<void>}
   */
  onCheckReturn = async (tid: string) => {
    const { res } = await webapi.deliverVerify(tid);
    if (res.code !== Const.SUCCESS_CODE) {
      message.error(res.message);
    } else {
      history.push({
        pathname: `/th_order-detail/${tid}`,
        state: { tab: '2' }
      });
    }
  };

  /**
   * 发货前 验证订单是否存在售后申请
   * @param tid
   * @returns {Promise<void>}
   */
  onCheckReturnToPickUp = async (tid: string) => {
    const { res } = await webapi.deliverVerify(tid);
    if (res.code !== Const.SUCCESS_CODE) {
      message.error(res.message);
    } else {
      history.push({
        pathname: `/th_order-detail/${tid}`,
        state: { tab: '4' }
      });
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
   * 是否导出子单号
   */
  onExportBySonTrade = () => {
    this.dispatch('list:export-modal:son');
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
    let disabled = this.state().getIn(['exportModalData', 'disabled']);

    return this._onExport({ ids: selected }, disabled);
  };

  /**
   * 按搜索条件导出
   * @returns {Promise<T>}
   */
  onExportByParams = () => {
    // 搜索条件
    let params = this.state().get('form').toJS();
    let disabled = this.state().getIn(['exportModalData', 'disabled']);
    // tab
    const key = this.state().getIn(['tab', 'key']);
    if (key != '0') {
      const [state, value] = key.split('-');
      params['tradeState'][state] = value;
    }

    const total = this.state().get('total');
    if (total > 0) {
      return this._onExport(params, disabled);
    } else {
      message.error('当前搜索结果没有要导出的订单');
      return new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
    }
  };

  _onExport = (params: {}, disabled) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 参数加密
        let base64 = new util.Base64();
        const token = (window as any).token;
        if (token) {
          let result = JSON.stringify({ ...params, token: token });
          let resultDisabled = JSON.stringify({ disabled, token: token });
          let encrypted = base64.urlEncode(result);
          let encryptedable = base64.urlEncode(resultDisabled);
          console.log(result,'result')
          console.log(resultDisabled,'resultDisabled')
          // 新窗口下载
          const exportHref =
            Const.HOST +
            `/newPileTrade/export/params/${encrypted}/${encryptedable}?isDetailed=${disabled}`;
          window.open(exportHref);
        } else {
          message.error('请登录');
        }

        resolve();
      }, 500);
    });
  };

  /**
   * 证订单客户是否已刪除
   * @returns {Promise<void>}
   */
  verify = async (tid: string, buyerId: string) => {
    const { res } = await webapi.verifyBuyer(buyerId);
    if (res) {
      message.error('客户已被删除，不能修改订单！');
      return;
    } else {
      history.push('/order-edit/' + tid);
    }
  };

  /**
   * 显示驳回弹框
   */
  showRejectModal = () => {
    this.dispatch('order:list:reject:show');
  };

  /**
   *关闭驳回弹框
   */
  hideRejectModal = () => {
    this.dispatch('order:list:reject:hide');
  };
}
