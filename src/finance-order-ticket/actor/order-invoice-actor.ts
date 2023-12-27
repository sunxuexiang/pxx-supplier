import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class OrderInvocieActor extends Actor {
  defaultState() {
    return {
      orderInvoiceDetail: {},
      invoiceConfig: {}
    };
  }

  /**
   * 初始化开票详情
   * @param state
   * @param orderInvoiceDetail
   * @returns {Map<string, V>}
   */
  @Action('orderInvoice:orderInvoiceDetail')
  orderInvoiceDetail(state: IMap, orderInvoiceDetail) {
    return state.set('orderInvoiceDetail', fromJS(orderInvoiceDetail));
  }

  @Action('invoice:invoiceConfig')
  invoiceConfig(state: IMap, invoiceConfig) {
    return state.set('invoiceConfig', fromJS(invoiceConfig));
  }
}
