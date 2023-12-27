import { Actor, Action, IMap } from 'plume2';

export default class VisibleActor extends Actor {
  defaultState() {
    return {
      visible: false,
      viewVisible: false
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

  @Action('viewModal:show')
  viewShow(state: IMap) {
    return state.set('viewVisible', true);
  }

  @Action('viewModal:hide')
  viewHide(state: IMap) {
    return state.set('viewVisible', false);
  }
}
