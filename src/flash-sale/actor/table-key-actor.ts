import { Action, Actor, IMap } from 'plume2';

export default class VisibleActor extends Actor {
  defaultState() {
    return {
      key: '0',
      activityKey: '0'
    };
  }

  @Action('change:key')
  changeKey(state: IMap, key) {
    return state.set('key', key);
  }

  @Action('change:activityKey')
  changeActivityKey(state: IMap, activityKey) {
    return state.set('activityKey', activityKey);
  }
}
