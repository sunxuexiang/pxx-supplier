import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class CustomerActor extends Actor {
  defaultState() {
    return {
      //当前选中的会员
      selectedCustomerId: '',
      customers: [],
      //选中的会员信息 ----> 客户名称 客户账号 客户等级
      selectedCustomerInfo: '',
      //选中会员的增票资质
      invoice: fromJS({}),
      //是否有增票资质
      invoiceFlag: false,
      //发票信息选项列表
      invoiceOptions: fromJS([]),
      //后台发票配置信息
      isSupportInvoice: false,
      isPaperInvoice: false,
      isValueAddedTaxInvoice: false
    };
  }

  /**
   * 会员信息列表初始化
   * @param state
   * @param res
   * @returns {Map<string, V>}
   */
  @Action('customer:init')
  init(state: IMap, res) {
    return state.set('customers', fromJS(res));
  }

  /**
   * 选中会员获取增票资质
   * @param state
   * @param res
   * @returns {Map<string, V>}
   */
  @Action('customer:invoice:init')
  invoice(state: IMap, res) {
    const flag = fromJS(res).get('flag');
    const isPaperInvoice = state.get('isPaperInvoice');
    const isValueAddedTaxInvoice = state.get('isValueAddedTaxInvoice');
    let invoiceOptions = fromJS([]);
    if (state.get('selectedCustomerId')) {
      if (isPaperInvoice) {
        invoiceOptions = invoiceOptions.push(
          fromJS({ val: '0', label: '普通发票' })
        );
      }
      if (isValueAddedTaxInvoice && flag) {
        invoiceOptions = invoiceOptions.push(
          fromJS({ val: '1', label: '增值税专用发票' })
        );
      }
    }
    return state
      .set('invoice', fromJS(res))
      .set('invoiceFlag', flag)
      .set('invoiceOptions', invoiceOptions);
  }

  @Action('customer:select')
  select(state: IMap, customerId) {
    return state.set('selectedCustomerId', customerId);
  }

  /**
   * 选中的会员信息
   * @param state
   * @param userInfo
   * @returns {Map<string, string>}
   */
  @Action('customer:info:select')
  choose(state: IMap, userInfo) {
    return state.set(
      'selectedCustomerInfo',
      (userInfo.get('customerName') ? userInfo.get('customerName') : '') +
        ' ' +
        (userInfo.get('customerAccount')
          ? userInfo.get('customerAccount')
          : '') +
        ' ' +
        (userInfo.get('customerLevelName')
          ? userInfo.get('customerLevelName')
          : '')
    );
  }

  /**
   * 清除选中的会员
   * @param state
   * @returns {Map<string, string>}
   */
  @Action('customer:clear')
  clear(state: IMap) {
    return state
      .set('selectedCustomerId', '')
      .set('selectedCustomerInfo', '')
      .set('invoice', fromJS({}))
      .set('invoiceFlag', false)
      .set('invoiceOptions', fromJS([]));
  }

  @Action('setInvoiceSwitch')
  setInvoiceSwitch(state, info) {
    const { isSupportInvoice, isPaperInvoice, isValueAddedTaxInvoice } = info;
    return state
      .set('isSupportInvoice', isSupportInvoice == 1 ? true : false)
      .set('isPaperInvoice', isPaperInvoice == 1 ? true : false)
      .set(
        'isValueAddedTaxInvoice',
        isValueAddedTaxInvoice == 1 ? true : false
      );
  }
}
