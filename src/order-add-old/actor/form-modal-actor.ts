import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

const defaultState = {
  customerFormVisible: false,
  addressFormVisible: false,
  //收货地址类型 0:没有 1:收货地址 2:发票收货地址
  addressType: 0,
  customerTempAddressVisiable: false,
  //发票临时地址
  customerInvoiceTempAddressVisiable: false
};

export default class FormModalActor extends Actor {
  defaultState() {
    return {
      ...defaultState
    };
  }

  /**
   *
   * @param state 修改可见性
   * @param param1
   */
  @Action('switchVisible')
  switchisible(state: IMap, { field, result }) {
    return state.set(field, result);
  }

  /**
   * 编辑地址类型 0:重置 1:收货地址 2:发票收货地址
   * @param state
   * @param result
   * @returns {Map<string, V>}
   */
  @Action('addressType')
  addressType(state: IMap, result) {
    return state.set('addressType', result);
  }

  /**
   * 恢复初始状态
   */
  @Action('form:model:clear')
  formModelClear(state: IMap) {
    return state.merge(fromJS(defaultState));
  }
}
