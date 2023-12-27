import { Actor, Action, IMap } from 'plume2';

export default class TabActor extends Actor {
  defaultState() {
    return {
      tab: '1'
    };
  }

  @Action('tab:init')
  init(state: IMap, key: string) {
    return state.set('tab', key);
  }
}
