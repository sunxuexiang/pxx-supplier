import { Action, Actor, IMap } from 'plume2';

export default class EditActor extends Actor {
  //数据源
  defaultState() {
    return {
      receivableForm: {
        payOrderId: '',
        createTime: null,
        comment: '',
        accountName: '',
        offLineAccountId: ''
      },
      payOrderId: '',
      //用户收款账号
      offlineAccounts: []
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
   * 商家线下账户
   * @param state
   * @param offlineAccounts
   * @returns {Map<string, V>}
   */
  @Action('offlineAccount')
  offlineAccount(state: IMap, offlineAccounts) {
    return state.set('offlineAccounts', offlineAccounts);
  }

  /**
   * 线下账户
   * @param state
   * @param offLineAccounts
   * @returns {Map<string, V>}
   */
  @Action('offlineAccount:payOrderId')
  setPayOrderId(state: IMap, payOrderId) {
    return state.set('payOrderId', payOrderId);
  }
}
