import { Actor, IMap, Action } from 'plume2';
import { Map } from 'immutable';

export default class FormActor extends Actor {
  defaultState() {
    return {
      form: {
        tradeState: {},
        orderRejectModalVisible: false
      }
    };
  }

  @Action('form:field')
  formFieldChange(state: IMap, params) {
    return state.update('form', (form) => form.mergeDeep(params));
  }

  @Action('form:clear')
  formFieldClear(state: IMap) {
    return state.set('form', Map());
  }

  /**
   * 显示驳回弹框
   * @param state
   */
  @Action('order:list:reject:show')
  showRejectModal(state: IMap) {
    return state.set('orderRejectModalVisible', true);
  }

  /**
   *关闭驳回弹框
   * @param state
   */
  @Action('order:list:reject:hide')
  hideRejectModal(state: IMap) {
    return state.set('orderRejectModalVisible', false);
  }
}
