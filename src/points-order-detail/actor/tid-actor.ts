import { Actor, Action, IMap } from 'plume2';

export default class TidActor extends Actor {
  defaultState() {
    return {
      tid: ''
    };
  }

  @Action('tid:init')
  init(state: IMap, tid: string) {
    return state.set('tid', tid);
  }
}
