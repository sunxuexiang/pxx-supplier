import { Actor, Action, IMap } from 'plume2';

export default class ProcessActor extends Actor {
  defaultState() {
    return {
      current: 0
    };
  }

  @Action('process:next')
  next(state: IMap, index) {
    return state.set('current', index);
  }
}
