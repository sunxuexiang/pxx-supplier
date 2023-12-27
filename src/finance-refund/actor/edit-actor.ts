import { Action, Actor, IMap } from 'plume2';

export default class EditActor extends Actor {
  //数据源
  defaultState() {
    return {
      receivableForm: {
        refundOrderId: '',
        createTime: null,
        comment: '',
        accountName: '',
        offLineAccountId: ''
      },
      refundId: '',
      //用户收款账号
      selectedAccountId: '',
      //会员收款账户
      customerAccounts: [],
      //退款号
      returnOrderCode: '',
      returnAmount: '',
      // 当前线下退款的用户
      refundOfflineCustomerId: ''
    };
  }

  constructor() {
    super();
  }

  @Action('edit:init')
  init(state: IMap, receivable) {
    return state.mergeIn(['receivableForm'], receivable);
  }

  @Action('edit')
  edit(state: IMap, isEdit) {
    return state.set('edit', isEdit);
  }

  /**
   * 用户收款账户
   * @param state
   * @param customerAccounts
   * @returns {Map<string, V>}
   */
  @Action('customerAccounts')
  customerAccounts(state: IMap, customerAccounts) {
    return state.set('customerAccounts', customerAccounts);
  }

  /**
   * 线下账户
   * @param state
   * @param offLineAccounts
   * @returns {Map<string, V>}
   */
  @Action('refundId')
  setPayOrderId(state: IMap, refundId) {
    return state.set('refundId', refundId);
  }

  /**
   * 退款单号
   * @param state
   * @param returnOrderCode
   * @returns {Map<string, V>}
   */
  @Action('returnOrderCode')
  setPayOrderCode(state: IMap, returnOrderCode) {
    return state.set('returnOrderCode', returnOrderCode);
  }

  /**
   * 退款金额
   * @param state
   * @param returnAmount
   * @returns {Map<string, V>}
   */
  @Action('edit:returnAmount')
  returnAmount(state: IMap, returnAmount) {
    return state.set('returnAmount', returnAmount);
  }

  @Action('offlineAccount:selectedAccountId')
  selectedAccountId(state: IMap, selectedAccountId) {
    return state.set('selectedAccountId', selectedAccountId);
  }

  @Action('offlineAccount:customerId')
  customerId(state: IMap, refundOfflineCustomerId) {
    return state.set('refundOfflineCustomerId', refundOfflineCustomerId);
  }
}
