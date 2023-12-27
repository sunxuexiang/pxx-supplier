import { Actor, Action, IMap } from 'plume2';

export default class VisibleActor extends Actor {
  defaultState() {
    return {
      visible: false
    };
  }

  @Action('modal:show')
  show(state: IMap) {
    return state.set('visible', true);
  }

  @Action('modal:hide')
  hide(state: IMap) {
    return state.set('visible', false);
  }
}
