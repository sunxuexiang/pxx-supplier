import { Actor, Action, IMap } from 'plume2';

export default class TabActor extends Actor {
  defaultState() {
    return {
      tab: {
        key: '0'
      }
    };
  }

  @Action('order-return-list:tab:init')
  init(state: IMap, key: string) {
    return state.setIn(['tab', 'key'], key);
  }
}
