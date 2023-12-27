import { Actor, Action, IMap } from 'plume2';
import { List } from 'immutable';

/**
 * 收款记录actor
 */
export default class ReceiveRecordActor extends Actor {
  defaultState() {
    return {
      payRecord: []
    };
  }

  @Action('receive-record-actor:init')
  init(state: IMap, res: Object) {
    return state.set('payRecord', List(res));
  }
}
