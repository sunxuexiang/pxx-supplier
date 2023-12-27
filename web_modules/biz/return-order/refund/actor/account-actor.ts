import { Action, Actor } from 'plume2';
import { IMap, IList } from 'typings/globalType';

export default class FormActor extends Actor {
  defaultState() {
    return {
      // 要退款到客户的客户账户列表
      customerAccounts: [],
      // 商家的账户列表
      accounts: []
    };
  }

  @Action('return-order:refund:customerAccounts')
  customerAccounts(state: IMap, customerAccounts: IList) {
    return state.set('customerAccounts', customerAccounts);
  }

  @Action('return-order:refund:accounts')
  accounts(state: IMap, accounts: IList) {
    return state.set('accounts', accounts);
  }
}
