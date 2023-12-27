import { Store } from 'plume2';
import { fromJS } from 'immutable';

import ListActor from './actor/list-actor';
import LoadingActor from './actor/loading-actor';
import SearchActor from './actor/search-actor';
import SelectedActor from './actor/selected-actor';
import * as webapi from './webapi';
import { message } from 'antd';
import VisibleActor from './actor/visible-actor';
import OrderInvocieActor from './actor/order-invoice-actor';
import InvoiceFormActor from './actor/invoice-form-actor';
import InvoiceProjectActor from './actor/invoice-project-actor';
import AddressInfoActor from './actor/address-info-actor';
import moment from 'moment';
import { Const, util, FindArea } from 'qmkit';
import InvoiceViewActor from './actor/invoice-view-actor';
import ExportActor from './actor/export-actor';

export default class AppStore extends Store {
  bindActor() {
    return [
      new ListActor(),
      new LoadingActor(),
      new SearchActor(),
      new SelectedActor(),
      new VisibleActor(),
      new OrderInvocieActor(),
      new InvoiceFormActor(),
      new InvoiceProjectActor(),
      new AddressInfoActor(),
      new InvoiceViewActor(),
      new ExportActor()
    ];
  }

  constructor(props) {
    super(props);
    //debug
    (window as any)._store = this;
  }

  //;;;;;;;;;;;;;action;;;;;;;;;;;;;;;;;;;;;;;
  init = async (param?: any) => {
    this.dispatch('loading:start');
    param = Object.assign(
      this.state()
        .get('searchForm')
        .toJS(),
      param
    );
    //查询已退款的

    const { res } = await webapi.fetchOrderInovices(param);

    if (res.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch('loading:end');
        this.dispatch('list:init', res.context);
        this.dispatch('current', param && param.pageNum + 1);
        this.dispatch('select:init', []);
      });
    } else {
      message.error(res.message);
      if (res.code === 'K-110001') {
        this.dispatch('loading:end');
      }
    }
  };

  onFormChange = (searchParam) => {
    this.dispatch('change:searchForm', searchParam);
  };

  onSearch = async () => {
    let param = this.state()
      .get('searchForm')
      .toJS();
    if (param && param.endTime) {
      param.endTime = moment(param.endTime)
        .add(1, 'day')
        .format(Const.DAY_FORMAT);
    }
    this.init(param);
    this.dispatch('current', 1);
  };

  /**
   * 订单开票
   * @param id
   * @returns {Promise<void>}
   */
  onConfirm = async (id) => {
    let ids = [];
    ids.push(id);
    const { res } = await webapi.openOrderInvocies(ids);
    this.messageResult(res);
  };

  onBatchConfirm = async () => {
    const seletedIds = this.state().get('selected');
    if (seletedIds.count() < 1) {
      message.error('请先选择订单');
      return;
    }
    const { res } = await webapi.openOrderInvocies(seletedIds.toJS());
    this.messageResult(res);
  };

  /**
   * 作废订单开票
   * @param id
   * @returns {Promise<void>}
   */
  onDestory = async (id: string) => {
    const { res } = await webapi.destoryOrderInvoice(id);
    this.messageResult(res);
  };

  /**
   * 选中ids
   * @param ids
   */
  onSelect = (ids: string[]) => {
    this.dispatch('select:init', ids);
  };

  /**
   * 显示弹出框
   */
  onShow = async () => {
    const { res } = (await webapi.fetchInvoiceProjects()) as any;
    if (res.code == Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch('modal:show');
        this.dispatch('invoice:invoiceProject', res.context);
        this.dispatch('invoice:property', {
          propertyName: 'orderInvoiceProject',
          propertyValue: this.fetchDefault()
        });
        this.dispatch('orderInvoice:orderInvoiceDetail', {});
      });
    }
  };

  /**
   * 查询默认
   * @returns {any}
   */
  fetchDefault() {
    const invoiceProjects = this.state().get('invoiceProjects');
    const invoiceProject = invoiceProjects.find(
      (project) => project.get('projectName') == '明细'
    );

    return invoiceProject.get('projectId');
  }

  /**
   * 隐藏谈出库
   */
  onHide = () => {
    this.transaction(() => {
      this.dispatch('modal:hide');
      this.dispatch('invoice:emptyForm');
    });
  };

  /**
   * 根据订单号查询
   * @param orderNo
   * @returns {Promise<void>}
   */
  onSearchByOrderNo = async (orderNo: string) => {
    if (!orderNo.trim()) {
      return;
    }

    this.dispatch('invoice:property', {
      propertyName: 'orderNo',
      propertyValue: orderNo
    });
    const { res: orderInvoiceDetail } = await webapi.fetchOrderInvoiceDetail(
      orderNo
    );
    if (orderInvoiceDetail.code !== Const.SUCCESS_CODE) {
      message.error(orderInvoiceDetail.message);
      return;
    }

    const { res: addressInfos } = await webapi.fetchAddressInfos(
      orderInvoiceDetail.context.customerId
    );
    if (addressInfos.code != Const.SUCCESS_CODE) {
      message.error(addressInfos.message);
      return;
    }

    const { res: invoiceConfig } = await webapi.invoiceConfig();

    this.transaction(() => {
      this.dispatch(
        'orderInvoice:orderInvoiceDetail',
        orderInvoiceDetail.context
      );
      this.dispatch('invoice:addressInfos', addressInfos.context);
      this.dispatch('invoice:invoiceConfig', invoiceConfig);
    });
  };

  /**
   * 根据订单开票类型
   * @param type type
   */
  onChangeOrderInvoiceForm = (param: any) => {
    this.dispatch('invoice:property', param);
  };

  /**
   * 导出
   * @returns {Promise<void>}
   */
  onExport = async () => {
    const selectedIds = this.state().get('selected');
    if (selectedIds.count() < 1) {
      message.error('请选择要导出的数据');
    }
    await webapi.exportOrderInvoice(selectedIds.toJS());
  };

  /**
   * 保存订单开票
   */
  onSaveOrderInvoice = async (param: any) => {
    param.invoiceTime = moment(param.invoiceTime)
      .format(Const.TIME_FORMAT)
      .toString();
    param.customerId = this.state().getIn(['orderInvoiceDetail', 'customerId']);

    const addressInfoId = this.state().getIn([
      'orderInvoiceForm',
      'addressInfoId'
    ]);
    param.invoiceAddress = this.renderAddress(addressInfoId);

    //订单发票收件信息
    if (param.addressInfoId) {
      const address = this.state()
        .get('addressInfos')
        .find(
          (addressInfo) =>
            addressInfo.get('deliveryAddressId').toString() == addressInfoId
        );
      param.contacts = address.get('consigneeName');
      param.phone = address.get('consigneeNumber');
      param.address = `${FindArea.addressInfo(
        address.get('provinceId').toString(),
        address.get('cityId') && address.get('cityId').toString(),
        address.get('areaId') && address.get('areaId').toString()
      )} ${address.get('deliveryAddress')}`;
    }

    if (param.invoiceType === '0' && param.isCompany === '1') {
      param.taxpayerNumber = '';
      param.invoiceTitle = '';
    }
    // 增票资质情况下, 保存纳税人识别号
    if (param.invoiceType === '1') {
      param.taxpayerNumber = this.state().getIn([
        'orderInvoiceDetail',
        'taxpayerNumber'
      ]);
    }
    const { res } = await webapi.createOrderInvoice(param);
    this.messageResult(res);
  };

  /**
   * 渲染地址
   * @param addressInfoId
   * @returns {string}
   */
  renderAddress = (addressInfoId: string) => {
    const address = this.state()
      .get('addressInfos')
      .find(
        (addressInfo) =>
          addressInfo.get('deliveryAddressId').toString() == addressInfoId
      );
    return `${address.get('consigneeName')} ${address.get(
      'consigneeNumber'
    )} ${FindArea.addressInfo(
      address.get('provinceId').toString(),
      address.get('cityId') && address.get('cityId').toString(),
      address.get('areaId') && address.get('areaId').toString()
    )} ${address.get('deliveryAddress')}`;
  };

  onSearchByInvoiceId = async (id: string) => {
    const { res } = await webapi.fetchInvoiceView(id);
    if (res.code == Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch('invoice:invoiceView', res.context);
        this.dispatch('viewModal:show');
      });
    } else {
      message.error(res.message);
    }
  };

  /**
   * 显示视图
   */
  onViewShow = () => {
    this.dispatch('viewModal:show');
  };

  /**
   * 隐藏视图
   */
  onViewHide = () => {
    this.dispatch('viewModal:hide');
  };

  /**
   * 隐藏导出框
   */
  onHideExportModal = () => {
    this.dispatch('ticket:hide-export');
  };

  /**
   * 导出状态
   * @param status
   */
  onExportModalChange = (status) => {
    this.dispatch('ticket:export-modal:change', fromJS(status));
  };

  /**
   * 按搜索条件导出
   * @returns {Promise<IAsyncResult<TResult>>}
   */
  onExportByParams = () => {
    let param = this.state()
      .get('searchForm')
      .toJS();
    if (param.invoiceState == 0) {
      param.invoiceState = 'WAIT';
    }

    if (param.invoiceState == 1) {
      param.invoiceState = 'ALREADY';
    }
    // param.startTime = momnet(param.dateRange[0]).format('yyyy-MM-dd HH:mm').toString()
    // param.endTime = momnet(param.dateRange[1]).format('yyyy-MM-dd HH:mm').toString()
    return this._onExport(param, () => this.dispatch('select:init', []));
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

    return this._onExport({ orderInvoiceIds: selected.toJS() }, () =>
      this.dispatch('select:init', [])
    );
  };

  _onExport = (params: {}, action: Function) => {
    action();
    return new Promise((resolve) => {
      setTimeout(() => {
        // 参数加密
        let base64 = new util.Base64();
        const token = (window as any).token;
        if (token) {
          let result = JSON.stringify({ ...params, token: token });
          let encrypted = base64.urlEncode(result);

          // 新窗口下载
          const exportHref =
            Const.HOST + `/account/export/orderInvoices/${encrypted}`;
          window.open(exportHref);
        } else {
          message.error('请登录');
        }

        resolve();
      }, 500);
    });
  };

  messageResult(res) {
    if (res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.init();
    } else {
      message.error(res.message);
    }
  }
}
