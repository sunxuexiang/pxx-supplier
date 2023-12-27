import { IOptions, Store } from 'plume2';
import { message } from 'antd';
import LoadingActor from './actor/loading-actor';
import ListActor from './actor/list-actor';
import FormActor from './actor/form-actor';
import TabActor from './actor/tab-actor';
import ModalActor from './actor/modal-actor';
import * as webapi from './webapi';
import { fromJS } from 'immutable';
import { Const, history, util } from 'qmkit';
import moment from 'moment';

export default class AppStore extends Store {
  //btn加载
  btnLoading = false;

  constructor(props: IOptions) {
    super(props);
    // @ts-ignore
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [
      new LoadingActor(),
      new ListActor(),
      new FormActor(),
      new TabActor(),
      new ModalActor()
    ];
  }

  /**
   * 页面初始化
   * @param pageNum
   * @param pageSize
   */
  init = async (
    { pageNum, pageSize } = {
      pageNum: 0,
      pageSize: this.state().get('pageSize') || 10
    }
  ) => {
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
    form['orderType'] = 'NORMAL_ORDER';
    if (form.presellFlag === 1) {
      form['tradeState'].flowState = 'AUDIT';
    }
    const { res: needRes } = await webapi.getOrderNeedAudit();
    const { res: wareDate } = await webapi.wareList();
    let craeList = [];
    if (wareDate) {
      craeList = wareDate.context.wareHouseVOPage.content;
    }
    craeList.unshift({
      wareId: '0',
      wareName: '全部'
    });
    this.dispatch('wareList:init', craeList ? craeList : []);
    localStorage.setItem('wareHouseVOPage', JSON.stringify(craeList));
    if (needRes && needRes.code == Const.SUCCESS_CODE) {
      webapi.fetchOrderList({ ...form, pageNum, pageSize }).then(({ res }) => {
        if (res.code == Const.SUCCESS_CODE) {
          // console.log(res.context.content, 'res.context');
          res.context.content.forEach((el) => {
            const iDs = [];
            const imgList = [];
            el.tradeItems.concat(el.gifts).forEach((child) => {
              if (iDs.indexOf(child.skuId) === -1) {
                iDs.push(child.skuId);
                imgList.push(child);
              }
            });
            el.imgList = imgList;
            el.specNumber = iDs.length;
          });

          console.log(res.context.content, 'res.context.content');

          res.context.content.forEach((els) => {
            craeList.forEach((crael) => {
              if (els.wareId == crael.wareId) {
                els.wareName = crael.wareName;
              } else {
                return;
              }
            });
          });
          this.transaction(() => {
            this.dispatch('loading:end');
            this.dispatch('list:init', res.context);
            this.dispatch(
              'list:page',
              fromJS({ currentPage: pageNum + 1, pageSize: pageSize })
            );
            this.dispatch('list:setNeedAudit', needRes.context.audit);
            this.btnLoading = false;
          });
        } else {
          message.error(res.message);
          if (res.code === 'K-110001') {
            this.dispatch('loading:end');
          }
        }
      });
    }
  };

  /**
   * 缓存的搜索条件
   * @param params
   */
  onSearchOrderForm = (form, orderAddonBeforeForm, tabKey) => {
    const tradeState = form.tradeState;
    const ts = {} as any;
    if (tradeState.deliverStatus) {
      ts.deliverStatus = tradeState.deliverStatus;
    }
    if (tradeState.payState) {
      ts.payState = tradeState.payState;
    }
    if (tradeState.orderSource) {
      ts.orderSource = tradeState.orderSource;
    }
    form.tradeState = ts;
    this.dispatch('form:field', form);
    this.dispatch('addonBeforeForm:field', orderAddonBeforeForm);
    this.dispatch('tab:init', tabKey);
    this.init({ pageNum: form.currentPage, pageSize: form.pageSize });
  };

  onFormValFieldChange = (key, value, formName) => {
    this.dispatch('form:field:val', { key, value, formName });
  };

  onTabChange = (key) => {
    this.dispatch('tab:init', key);
    let { pageSize } = this.state().toJS();
    this.init({ pageNum: 0, pageSize });
  };

  /**
   * 搜索
   * @param params
   */
  onSearch = (params?, addonBeforeForm?) => {
    // this.dispatch('form:clear');
    // this.dispatch('form:field', params);
    // this.dispatch('addonBeforeForm:field', addonBeforeForm);
    let { pageSize } = this.state().toJS();
    this.init({ pageNum: 0, pageSize });
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
        pathname: `/order-detail/${tid}`,
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
        pathname: `/order-detail/${tid}`,
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
    console.log(status, 'statusstatus');
    this.dispatch('list:export-modal:change', fromJS(status));
  };

  /**
   * 是否导出子单号
   */
  onExportBySonTrade = () => {
    this.dispatch('list:export-modal:son');
  };

  /**
   * 是否导出明细
   */
  onExportBySonDetail = () => {
    this.dispatch('list:export-modal:detail');
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
    let params = this.state()
      .get('form')
      .toJS();
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
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        // 参数加密
        let base64 = new util.Base64();
        const token = (window as any).token;
        if (token) {
          let result = JSON.stringify({ ...params, token: token });
          // isDetailed: disabled
          let resultDisabled = JSON.stringify({ disabled, token: token });
          // console.log(resultDisabled, 'resultDisabled');
          // console.log(result, 'result')
          let encrypted = base64.urlEncode(result);
          let encryptedable = base64.urlEncode(resultDisabled);
          let detailFlag = this.state().getIn([
            'exportModalData',
            'detailFlag'
          ]);
          let exportHref;
          if (!detailFlag) {
            exportHref =
              Const.HOST +
              `/trade/export/params/providerTrade/${encrypted}/${encryptedable}`;
          } else {
            exportHref =
              Const.HOST +
              `/trade/export/params/${encrypted}/${encryptedable}?isDetailed=true`;
          }
          // 新窗口下载
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

  /**
   * 显示订单发货弹框
   */
  showLogisticsModal = (rowInfo) => {
    this.transaction(() => {
      this.dispatch('modal:visible', true);
      this.dispatch('modal:detail', rowInfo);
    });
    if (rowInfo.get('deliverWay') === 7) {
      const marketId = rowInfo.getIn(['supplier', 'marketId']);
      // 表示承运商ID
      const carrierId = rowInfo.getIn([
        'tradeDelivers',
        0,
        'logistics',
        'logisticCompanyId'
      ]);
      this.getMarketShipmentList(marketId, carrierId);
    }
    if (rowInfo.get('deliverWay') === 11) {
      this.getShippingList();
    }
  };

  /**
   * 关闭订单发货弹框
   */
  closeLogisticsModal = () => {
    this.dispatch('modal:visible', false);
    this.dispatch('modal:detail', fromJS({ tradeItems: [], gifts: [] }));
  };

  /**
   * 订单发货提交
   */
  supplierDeliver = async (values, form) => {
    const tradeItems =
      this.state()
        .get('detail')
        .toJS().tradeItems || [];
    const gifts =
      this.state()
        .get('detail')
        .toJS().gifts || [];
    const id =
      this.state()
        .get('detail')
        .toJS().id || '';
    const deliverWay =
      this.state()
        .get('detail')
        .toJS().deliverWay || '';
    let totalNum = 0;
    const params = {
      deliverNo: values.deliverNo, //物流单号
      deliverId: values.deliverId, //物流公司ID notnull, 其他 -1
      deliverTime: moment(values.deliverTime).format('YYYY-MM-DD HH:mm:ss'), //发货时间
      logisticPhone: values.logisticPhone, //物流公司联系方式
      supplierDeliverWay: values.supplierDeliverWay || deliverWay, //商家实际配送方式
      shippingItemList: tradeItems.map((item) => {
        totalNum += values[`deliveredNum${item.skuId}`];
        return {
          skuId: item.skuId,
          skuNo: item.skuNo,
          listNo: item.goodsBatchNo,
          specDetails: item.goodsSubtitle,
          itemNum: values[`deliveredNum${item.skuId}`]
        };
      }),
      giftItemList: gifts.map((item) => {
        return {
          skuId: item.skuId,
          skuNo: item.skuNo,
          listNo: item.goodsBatchNo,
          specDetails: item.goodsSubtitle,
          itemNum: values[`deliveredNumisGift${item.skuId}`]
        };
      })
    } as any;
    if (deliverWay === 1 || deliverWay === 8) {
      params.logisticCompanyName = values.logisticCompanyName;
    }
    // totalNum计算不包括赠品
    if (totalNum < 1) {
      message.error('订单商品发货总数量必须大于等于1');
      return;
    }
    if (values.otherCompany) {
      params.logisticCompanyName = values.otherCompany; //公司名称(选其他的时候的填)
    }
    if (values.shipmentSiteId) {
      params.shipmentSiteId = values.shipmentSiteId;
      if (deliverWay === 7) {
        const marketShipmentList = this.state()
          .get('marketShipmentList')
          .toJS();
        params.shipmentSiteName =
          marketShipmentList.filter(
            (item) => item.siteId === params.shipmentSiteId
          )[0]?.siteName || '';
      }
      if (deliverWay === 2) {
        const shippingList = this.state()
          .get('shippingList')
          .toJS();
        params.shipmentSiteName =
          shippingList.filter((item) => item.id === params.shipmentSiteId)[0]
            ?.shippingName || '';
      }
    }
    if (
      values.encloses &&
      values.encloses.fileList &&
      values.encloses.fileList.length > 0
    ) {
      params.encloses = values.encloses.fileList[0].response[0];
    }
    this.dispatch('modal:loading', true);
    const { res } = await webapi.supplierDeliver(params, id);
    this.dispatch('modal:loading', false);
    if (res) {
      if (res.code === Const.SUCCESS_CODE) {
        form.resetFields();
        this.closeLogisticsModal();
        message.success('提交成功');
        //refresh
        this.init({
          pageNum: this.state().get('currentPage') - 1,
          pageSize: this.state().get('pageSize')
        });
      } else if (res.message) {
        message.error(res.message);
      }
    }
  };

  /**
   * 显示修改运单号弹框
   */
  showChangeModal = (rowInfo) => {
    this.transaction(() => {
      this.dispatch('modal:detail', rowInfo);
      this.dispatch('modal:changeVisible', true);
    });
  };

  /**
   * 关闭修改运单号弹框
   */
  closeChangeModal = () => {
    this.dispatch('modal:changeVisible', false);
    this.dispatch('modal:detail', fromJS({ tradeItems: [], gifts: [] }));
  };

  getCompanyName = (id) => {
    const expressCompanyList = this.state()
      .get('expressCompanyList')
      .toJS();
    let result = '';
    expressCompanyList.forEach((item) => {
      if (item.expressCompany.expressCompanyId === id) {
        result = item.expressCompany.expressName;
        return;
      }
    });
    return result;
  };

  /**
   * 修改运单号提交接口
   */
  updateLogistics = async (values) => {
    const tradeDelivers = this.state()
      .get('detail')
      .toJS().tradeDelivers;
    let oldData = [] as any;
    if (tradeDelivers && tradeDelivers.length > 0) {
      oldData = tradeDelivers[0];
    }
    const id =
      this.state()
        .get('detail')
        .toJS().id || '';
    const deliverWay =
      this.state()
        .get('detail')
        .toJS().deliverWay || '';
    const params = {
      oldData: {
        //查出来的数据
        deliverNo:
          oldData.logistics && oldData.logistics.logisticNo
            ? oldData.logistics.logisticNo
            : '',
        deliverId:
          oldData.logistics && oldData.logistics.logisticCompanyId
            ? Number(oldData.logistics.logisticCompanyId)
            : '',
        logisticCompanyName:
          oldData.logistics && oldData.logistics.logisticCompanyName
            ? oldData.logistics.logisticCompanyName
            : '',
        logisticPhone:
          oldData.logistics && oldData.logistics.logisticPhone
            ? oldData.logistics.logisticPhone
            : '',
        deliverTime: oldData.deliverTime
          ? moment(oldData.deliverTime).format('YYYY-MM-DD HH:mm:ss')
          : '',
        encloses:
          oldData.logistics && oldData.logistics.encloses
            ? oldData.logistics.encloses
            : ''
      },
      newData: {
        //要保存的数据
        deliverNo: values.deliverNo, //物流单号
        deliverId:
          deliverWay === 1 || deliverWay === 8
            ? Number(oldData.logistics.logisticCompanyId)
            : values.deliverId, //物流公司ID notnull, 其他 -1
        deliverTime: moment(values.deliverTime).format('YYYY-MM-DD HH:mm:ss'), //发货时间
        logisticPhone: values.logisticPhone, //物流公司联系方式
        supplierDeliverWay: deliverWay, //商家实际配送方式
        logisticCompanyName:
          values.deliverId === -1
            ? values.otherCompany
            : this.getCompanyName(values.deliverId),
        encloses:
          values.encloses &&
          values.encloses.fileList &&
          values.encloses.fileList.length > 0
            ? values.encloses.fileList[0].response[0]
            : ''
      }
    };
    this.dispatch('modal:loading', true);
    const { res } = await webapi.updateLogistics(params, id);
    this.dispatch('modal:loading', false);
    if (res) {
      if (res.code === Const.SUCCESS_CODE) {
        this.closeChangeModal();
        message.success('提交成功');
        //refresh
        this.init({
          pageNum: this.state().get('currentPage') - 1,
          pageSize: this.state().get('pageSize')
        });
      } else if (res.message) {
        message.error(res.message);
      }
    }
  };

  /**
   * 获取商家勾选的物流
   */
  getExpressCompany = async () => {
    const { res: list } = await webapi.fetchCheckedExpress();
    if (list && list.code === Const.SUCCESS_CODE) {
      this.dispatch('modal:expressCompanyList', fromJS(list.context || []));
    } else {
      message.error(list.message);
    }
  };

  /**
   * 获取托运部公司列表
   */
  getLogisticsCompany = async () => {
    const { res: list } = await webapi.getLogisticscompany({
      pageNum: 0,
      pageSize: 10000
    });
    if (list && list.code === Const.SUCCESS_CODE) {
      this.dispatch(
        'modal:logisticsCompanyList',
        fromJS(list.context.logisticsCompanyVOPage.content || [])
      );
    } else {
      message.error(list.message);
    }
  };

  // 获取快递到家发货点列表
  getShippingList = async () => {
    const { res } = await webapi.fetchShippingAddress();
    this.dispatch('modal:shippingList', fromJS(res.context || []));
  };
  // 获取接货点列表
  getMarketShipmentList = async (marketId, carrierId) => {
    if (!marketId) {
      return;
    }
    const { res: list } = await webapi.fetchMarketShipment(marketId, carrierId);
    this.dispatch('modal:marketShipmentList', fromJS(list || []));
  };
  /**
   * 显示订单发货弹框
   */
  showPresaleModal = (rowInfo) => {
    this.transaction(() => {
      this.dispatch('modal:presaleVisible', true);
      this.dispatch('modal:presaleDetail', rowInfo);
    });
  };

  /**
   * 关闭订单发货弹框
   */
  closePresaleModal = () => {
    this.dispatch('modal:presaleVisible', false);
    this.dispatch('modal:presaleDetail', fromJS({ tradeItems: [], gifts: [] }));
  };

  // 预售到货
  presaleSubmit = async (callback) => {
    const presaleDetail = this.state().get('presaleDetail');
    this.dispatch('modal:loading', true);
    const { res } = await webapi.deliverPresell(presaleDetail.get('id'));
    this.dispatch('modal:loading', false);
    if (res && res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      callback();
      //refresh
      this.init({
        pageNum: this.state().get('currentPage') - 1,
        pageSize: this.state().get('pageSize')
      });
    } else {
      message.error(res.message || '');
    }
  };
}
