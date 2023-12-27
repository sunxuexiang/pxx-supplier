import { Store } from 'plume2';
import { fromJS } from 'immutable';
import AccountActor from './actor/account-actor';
import * as webapi from './webapi';

export default class AppStore extends Store {
  bindActor() {
    return [new AccountActor()];
  }

  constructor(props) {
    super(props);
    //debug
    (window as any)._store = this;
  }

  /**
   * 加载退款账户信息
   * @param customerId
   */
  init = (customerId: string) => {
    Promise.all([
      webapi.fetchAccounts(),
      webapi.fetchCustomerAccounts(customerId)
    ])
      .then(results => {
        this.transaction(() => {
          this.dispatch('return-order:refund:accounts', fromJS(results[0].res));
          this.dispatch(
            'return-order:refund:customerAccounts',
            fromJS(results[1].res)
          );
        });
      })
      .catch(() => {});
  };

  onSave = (_formData: any) => {};
}
