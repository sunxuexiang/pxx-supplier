import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class FormModalActor extends Actor {
  defaultState() {
    return {
      addressList: []
    };
  }

  @Action('initAddressList')
  initAddressList(state: IMap, result) {
    return state.set('addressList', fromJS(result));
  }

  @Action('switchAddressFormVisible')
  switchAddressFormVisible(state: IMap, result) {
    return state.set('addressFormVisible', result);
  }
}
