import { Actor, Action, IMap } from 'plume2';

export default class VisibleActor extends Actor {
  defaultState() {
    return {
      visible: false,
      selfVisible: false
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

  @Action('modal-self:show')
  showSelf(state: IMap) {
    return state.set('selfVisible', true);
  }

  @Action('modal-self:hide')
  hideSelf(state: IMap) {
    return state.set('selfVisible', false);
  }
}
