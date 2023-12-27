import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class LevelActor extends Actor {
  defaultState() {
    return {
      dataList: [],
    };
  }

  @Action('level:init')
  init(state: IMap, res) {
    return state.update(state => {
      return state.set('dataList', fromJS(res.storeLevelVOList));
    });
  }


}
