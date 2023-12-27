import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class EditActor extends Actor {
  defaultState() {
    return {
      invoiceType: {
        //id
        invoiceProjectSwitchId: null,
        //是否支持开票 0 不支持 1 支持
        isSupportInvoice: 0,
        //普通发票 0 不支持 1 支持
        isPaperInvoice: 0,
        //增值税专用发票 0 不支持 1 支持
        isValueAddedTaxInvoice: 0
      }
    };
  }

  /**
   * 开票支持类型初始化
   * @param state
   * @param invoiceType
   * @returns {Map<string, V>}
   */
  @Action('type:init')
  init(state: IMap, invoiceType) {
    return state.set('invoiceType', fromJS(invoiceType));
  }

  /**
   *
   * @param state
   * @param field
   * @param value
   * @returns {Map<K, V>}
   */
  @Action('type:edit')
  edit(state: IMap, { field, value }) {
    return state.setIn(['invoiceType', field], value);
  }
}
