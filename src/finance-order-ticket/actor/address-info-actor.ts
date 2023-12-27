import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

/**
 * 地址信息actor
 */
export default class AddressInfoActor extends Actor {
  defaultState() {
    return {
      addressInfos: []
    };
  }

  @Action('invoice:addressInfos')
  addressInfos(state: IMap, addresses) {
    return state.set('addressInfos', fromJS(addresses));
  }
}
