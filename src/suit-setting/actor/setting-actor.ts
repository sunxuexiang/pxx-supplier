import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class FormActor extends Actor {
  defaultState() {
    return {
      settings: {
        storeId: '', // 店铺标识
        storeLogo: '', // 店铺logo
        storeSign: '' // 店招
      }
    };
  }

  @Action('setting:init')
  init(state: IMap, setting) {
    return state.mergeIn(['settings'], setting);
  }
  /**
   * 键值设置
   * @param state
   * @param param1
   */
  @Action('coupon: info: field: value')
  fieldsValue(state, { field, value }) {
    state = state.set(field, fromJS(value));
    return state;
  }
}
