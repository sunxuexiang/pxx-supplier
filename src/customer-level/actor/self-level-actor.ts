import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class SelfLevelActor extends Actor {
  defaultState() {
    return {
      selfDataList: [],
      selfCustomerLevel: {}
    };
  }

  @Action('self-level:init')
  init(state: IMap, res) {
    return state.update((state) => {
      return state.set('selfDataList', fromJS(res.customerLevelVOList));
    });
  }

  @Action('self-level:view')
  detail(state: IMap, res) {
    return state.set('selfCustomerLevel', res);
  }
}
