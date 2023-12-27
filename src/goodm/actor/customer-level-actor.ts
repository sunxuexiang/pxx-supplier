import { Actor, Action, IMap } from 'plume2';

export default class CustomerLevelActor extends Actor {
  defaultState() {
    return {
      customerLevels: []
    };
  }

  @Action('customerLevel:init')
  init(state: IMap, res) {
    return state.set('customerLevels', res);
  }
}
