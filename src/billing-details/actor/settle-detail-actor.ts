import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class SettleDetailActor extends Actor {
  //数据源
  defaultState() {
    return {
      settleList: [],
      settlement: {}
    };
  }

  constructor() {
    super();
  }

  @Action('settleDetail:settlement')
  settlement(state: IMap, settlement) {
    return state.set('settlement', fromJS(settlement));
  }

  @Action('settleDetail:list')
  list(state: IMap, settleList) {
    return state.set('settleList', fromJS(settleList));
  }
}
