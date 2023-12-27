import { Actor, Action, IMap } from 'plume2';

export default class EditActor extends Actor {
  defaultState() {
    return {
      edit: false,
      customerLevel: {},
      lastData:""
    };
  }

  @Action('edit')
  edit(state: IMap, status: boolean) {
    return state.set('edit', status);
  }

  @Action('edit:init')
  init(state: IMap, res) {
    return state.set('customerLevel', res);
  }


  /**
   * 找到最后一个的值
   */
  @Action('edit: lastData')
  lastData(state: IMap, lastData) {
    return state.set('lastData', lastData)
  }

}
