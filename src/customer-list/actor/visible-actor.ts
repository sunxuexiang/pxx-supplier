import { Actor, Action, IMap } from 'plume2';

export default class VisibleActor extends Actor {
  defaultState() {
    return {
      visible: false,
      onSubmit: true
    };
  }

  @Action('modal:show')
  show(state: IMap) {
    return state.set('visible', true);
  }

  @Action('modal:hide')
  hide(state: IMap) {
    return state.set('visible', false).set('onSubmit', true);
  }

  @Action('modal:submit')
  submit(state: IMap, onSubmit) {
    return state.set('onSubmit', onSubmit);
  }
}
