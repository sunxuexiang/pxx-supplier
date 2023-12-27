/**
 * Created by feitingting on 2017/10/16.
 */
import { Actor, Action, IMap } from 'plume2';

export default class ModalActor extends Actor {
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
