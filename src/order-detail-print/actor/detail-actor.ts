import { Actor, Action, IMap } from 'plume2';
import { Map, fromJS } from 'immutable';

export default class DetailActor extends Actor {
  defaultState() {
    return {
      detail: {},
      printSetting: {}
    };
  }

  @Action('detail:init')
  init(state: IMap, res: Object) {
    return state.update('detail', (detail) => detail.merge(res));
  }

  @Action('printSetting:init')
  settingInit(state: IMap, res: Object) {
    return state.update('printSetting', (printSetting) =>
      printSetting.merge(res)
    );
  }
}
