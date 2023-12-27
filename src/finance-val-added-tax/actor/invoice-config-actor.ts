import { Actor, Action, IMap } from 'plume2';

export default class InvoiceConfigActor extends Actor {
  defaultState() {
    return {
      invoiceConfig: {
        status: ''
      }
    };
  }

  @Action('invoiceConfig')
  invoiceConfig(state: IMap, invoiceConfig) {
    return state.set('invoiceConfig', invoiceConfig);
  }

  @Action('updateInvoiceStatus')
  updateInvoiceStatus(state: IMap, invoiceConfig) {
    return state.setIn(['invoiceConfig', 'status'], invoiceConfig);
  }
}
