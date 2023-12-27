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
      customerAccounts: []
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

  @Action('offlineAccount:selectedAccountId')
  selectedAccountId(state: IMap, selectedAccountId) {
    return state.set('selectedAccountId', selectedAccountId);
  }
}
