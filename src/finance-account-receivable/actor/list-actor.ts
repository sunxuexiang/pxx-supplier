import { Actor, Action, IMap } from 'plume2';

export default class ListActor extends Actor {
  defaultState() {
    return {
      dataList: []
    };
  }

  @Action('list:init')
  init(state: IMap, res) {
    return state.set('dataList', res);
  }
}
