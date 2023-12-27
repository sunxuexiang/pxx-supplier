import { Actor, Action, IMap } from 'plume2';

export default class ListActor extends Actor {
  defaultState() {
    return {
      dataList: [],
      current: 1
    };
  }

  @Action('list:init')
  init(state: IMap, res) {
    return state
      .set('total', res.get('totalElements'))
      .set('pageSize', res.get('size'))
      .set('dataList', res.get('content'));
  }

  @Action('current')
  current(state: IMap, current) {
    return state.set('current', current);
  }
}
